import { Module } from "@nestjs/common";
import { NotificationsConsumer } from "./notifications.consumer";

@Module({
  providers: [NotificationsConsumer],
})
export class NotificationsModule {}
