import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';

@Module({
  controllers: [],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {}
