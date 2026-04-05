import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Body, Controller, Headers, Inject, Post } from '@nestjs/common';


//let counter = 0;

type IdempotencyEntry = {
  response: string;
  timestamp: number;
};


const list = new Map<string, IdempotencyEntry>();
const ttl = 10 * 1000; // 10 seconds in milliseconds

@Controller()
export class AppController {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  @Post()
  public create(@Body() body: any, @Headers() headers: any): string {
    const idempotencyKey = headers['x-idempotency'];
    if (idempotencyKey) {
      if (list.has(idempotencyKey)) {
        const expired = Date.now() - list.get(idempotencyKey)!.timestamp > ttl;
        if (expired) {
          list.delete(idempotencyKey);
        } else {
          console.log("List of idempotency keys: ", list);
          return "Response got from idempotency key: " + list.get(idempotencyKey)!.response;
        }
      }
      const response = "Created with body: " + JSON.stringify(body) + " and headers: " + JSON.stringify(headers);
      //console.log(`Created first time with idempotency key: ${idempotencyKey}`);
      list.set(idempotencyKey, { response, timestamp: Date.now() });
      console.log("List of idempotency keys: ", list);
      return response;
    } else {
      return "Header x-idempotency is missing. Cannot create resource without idempotency key.";
    }
  }

  @Post("create-with-cache")
  public async createWithCache(@Body() body: any, @Headers() headers: any) {
    const idempotencyKey = headers['x-idempotency'];
    if (idempotencyKey) {
      const value = await this.cache.get(idempotencyKey);
      if(value) {
        console.log("Cache hit for idempotency key: ", idempotencyKey);
        return "Response got from cache for idempotency key: " + value;
      }

      console.log("Cache miss for idempotency key: ", idempotencyKey);
      const response = "Created with body: " + JSON.stringify(body) + " and headers: " + JSON.stringify(headers);
      await this.cache.set(idempotencyKey, response);
      return response;
    } else {
      return "Header x-idempotency is missing. Cannot create resource without idempotency key.";
    }
  }

}
