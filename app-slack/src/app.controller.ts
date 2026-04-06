import { Body, Controller, Get, Post } from '@nestjs/common';
import { SlackService } from './slack/slack.service';

@Controller()
export class AppController {
  constructor(private readonly slackService: SlackService) {}

  @Post('send-message')
  async sendMessage(@Body() body: any) {
    return this.slackService.sendMessage(body.channel, body.message);
  }

  @Get('home')
  getHome() {
    return 'Welcome to the Slack App!';
  }
}
