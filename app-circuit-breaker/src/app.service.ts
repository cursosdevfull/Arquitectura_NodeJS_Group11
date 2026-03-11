import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  private execute(_payload: Record<string, unknown>) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.2) {
          resolve('Success!');
        } else {
          reject(new Error('Failure!'));
        }
      }, 1000);
    });
  }

  executeTask(payload: Record<string, unknown>) {
    return this.execute(payload);
  }
}
