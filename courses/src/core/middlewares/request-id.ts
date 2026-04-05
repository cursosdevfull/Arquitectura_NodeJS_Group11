import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export const REQUEST_ID_HEADER = 'x-request-id';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Capture response body
    const chunks: Buffer[] = [];
    const raw = res as any;
    const originalWrite = raw.write.bind(raw);
    const originalEnd = raw.end.bind(raw);

    raw.write = (chunk: any, ...args: any[]): boolean => {
      if (chunk)
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      return originalWrite(chunk, ...args);
    };

    raw.end = (chunk: any, ...args: any[]): void => {
      if (chunk)
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      try {
        raw.body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      } catch {
        raw.body = Buffer.concat(chunks).toString('utf8');
      }
      originalEnd(chunk, ...args);
    };

    next();
  }
}
