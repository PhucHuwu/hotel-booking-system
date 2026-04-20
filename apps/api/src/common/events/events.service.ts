import { Injectable, Logger } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

/**
 * In-process event bus that replaces the previous RabbitMQ publisher.
 *
 * Why a custom bus instead of RabbitMQ?
 *  - The API runs as Vercel serverless functions: there is no long-lived
 *    process to host a consumer.
 *  - All side-effects (notifications, saga) live in the same Nest container,
 *    so we can dispatch synchronously without a broker.
 *
 * Handlers are resolved lazily via ModuleRef to avoid circular imports
 * between BookingsService / PaymentsService / NotificationsService.
 */
export type DomainEvent =
  | "booking.created"
  | "booking.confirmed"
  | "booking.cancelled"
  | "booking.expired"
  | "checkout.completed"
  | "payment.success"
  | "payment.failed";

type Handler = (payload: Record<string, unknown>) => Promise<void> | void;

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  private readonly handlers = new Map<DomainEvent, Handler[]>();

  constructor(private readonly moduleRef: ModuleRef) {}

  on(event: DomainEvent, handler: Handler): void {
    const list = this.handlers.get(event) ?? [];
    list.push(handler);
    this.handlers.set(event, list);
  }

  /**
   * Publishes an event. Each handler runs sequentially with isolated error
   * handling — one failing handler must not break siblings.
   */
  async emit(
    event: DomainEvent,
    payload: Record<string, unknown>,
  ): Promise<void> {
    const handlers = this.handlers.get(event) ?? [];
    if (handlers.length === 0) {
      this.logger.debug(`No handlers for ${event}`);
      return;
    }
    for (const handler of handlers) {
      try {
        await handler(payload);
      } catch (err) {
        this.logger.error(
          `Handler for ${event} failed: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
  }

  /**
   * Resolves a provider lazily. Useful for handlers that depend on services
   * registered in feature modules.
   */
  resolve<T>(token: new (...args: never[]) => T): T {
    return this.moduleRef.get(token, { strict: false });
  }
}
