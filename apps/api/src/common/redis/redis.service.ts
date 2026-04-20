import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "@upstash/redis";

/**
 * Serverless-friendly Redis client backed by Upstash REST.
 *
 * Falls back to an in-memory implementation when no UPSTASH credentials are
 * configured so local `pnpm dev` keeps working without external dependencies.
 */
@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: RedisLike;

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>("UPSTASH_REDIS_REST_URL");
    const token = this.config.get<string>("UPSTASH_REDIS_REST_TOKEN");

    if (url && token) {
      this.client = new UpstashAdapter(new Redis({ url, token }));
      this.logger.log(`Using Upstash Redis (${new URL(url).hostname})`);
    } else {
      this.client = new InMemoryRedis();
      this.logger.warn(
        "UPSTASH_REDIS_REST_URL/TOKEN not set — using in-memory fallback (dev only)",
      );
    }
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    return this.client.set(key, value, ttlSeconds);
  }

  /** Distributed lock: succeeds only if key was absent. TTL in milliseconds. */
  setNx(key: string, value: string, ttlMs: number): Promise<boolean> {
    return this.client.setNx(key, value, ttlMs);
  }

  del(key: string): Promise<void> {
    return this.client.del(key);
  }

  async delPattern(pattern: string): Promise<void> {
    await this.client.delPattern(pattern);
  }
}

interface RedisLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  setNx(key: string, value: string, ttlMs: number): Promise<boolean>;
  del(key: string): Promise<void>;
  delPattern(pattern: string): Promise<void>;
}

class UpstashAdapter implements RedisLike {
  constructor(private readonly redis: Redis) {}

  async get(key: string): Promise<string | null> {
    const v = await this.redis.get<string>(key);
    return v ?? null;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) await this.redis.set(key, value, { ex: ttlSeconds });
    else await this.redis.set(key, value);
  }

  async setNx(key: string, value: string, ttlMs: number): Promise<boolean> {
    const res = await this.redis.set(key, value, { px: ttlMs, nx: true });
    return res === "OK";
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async delPattern(pattern: string): Promise<void> {
    let cursor = "0";
    do {
      const [next, keys] = (await this.redis.scan(cursor, {
        match: pattern,
        count: 100,
      })) as [string, string[]];
      if (keys.length) await this.redis.del(...keys);
      cursor = next;
    } while (cursor !== "0");
  }
}

class InMemoryRedis implements RedisLike {
  private readonly store = new Map<
    string,
    { value: string; expiresAt?: number }
  >();

  private isExpired(entry: { expiresAt?: number }): boolean {
    return Boolean(entry.expiresAt && entry.expiresAt < Date.now());
  }

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry || this.isExpired(entry)) {
      if (entry) this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.store.set(key, { value, expiresAt });
  }

  async setNx(key: string, value: string, ttlMs: number): Promise<boolean> {
    const existing = this.store.get(key);
    if (existing && !this.isExpired(existing)) return false;
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
    return true;
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async delPattern(pattern: string): Promise<void> {
    const re = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
    for (const key of this.store.keys()) {
      if (re.test(key)) this.store.delete(key);
    }
  }
}
