import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Response } from 'express';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: { executeTask: jest.Mock };
  let response: Pick<Response, 'setHeader'>;
  const payload = {
    customerId: '123',
    amount: 42,
  };

  beforeEach(async () => {
    appService = {
      executeTask: jest.fn(),
    };

    response = {
      setHeader: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('executeRequest', () => {
    it('should return the service response', async () => {
      appService.executeTask.mockResolvedValue('Success!');

      await expect(
        appController.executeRequest(payload, response as Response),
      ).resolves.toBe('Success!');

      expect(appService.executeTask).toHaveBeenCalledWith(payload);
      expect(response.setHeader).not.toHaveBeenCalled();
    });

    it('should set Retry-After and return retryAfter when the circuit is open', async () => {
      appService.executeTask.mockRejectedValue(new Error('Failure!'));

      for (let attempt = 0; attempt < 4; attempt++) {
        await expect(
          appController.executeRequest(payload, response as Response),
        ).rejects.toBeInstanceOf(HttpException);
      }

      await expect(
        appController.executeRequest(payload, response as Response),
      ).rejects.toMatchObject({
        response: {
          message: 'Service unavailable',
          retryAfter: 60,
        },
        status: HttpStatus.SERVICE_UNAVAILABLE,
      });

      expect(response.setHeader).toHaveBeenCalledWith('Retry-After', '60');
    });
  });
});
