import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebClient } from '@slack/web-api';

@Injectable()
export class SlackService implements OnModuleInit {
  private client!: WebClient;

  async onModuleInit() {
    this.client = new WebClient('HERE_YOUR_TOKEN');

    console.log('SlackService initialized');
  }

  async sendMessage(channel: string, text: string) {
    try {
      const result = await this.client.chat.postMessage({ channel, text });
      return result;
    } catch (error) {
      console.error('Error sending message to Slack:', error);
      throw error;
    }
  }
}
