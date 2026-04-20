import { ConfigService } from "@nestjs/config";
import { createNestApp } from "./bootstrap";

async function bootstrap() {
  const app = await createNestApp();
  const config = app.get(ConfigService);
  const port = config.get<number>("PORT", 3000);
  await app.listen(port);
  console.log(`API ready at http://localhost:${port}/api/docs`);
}

void bootstrap();
