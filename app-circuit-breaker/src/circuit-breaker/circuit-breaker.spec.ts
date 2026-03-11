import {
    CircuitBreaker,
    CircuitBreakerRejectedError,
    CircuitBreakerState,
} from './circuit-breaker';

describe('CircuitBreaker', () => {
  it('resets the failure count after a successful call while closed', async () => {
    const breaker = new CircuitBreaker(2, 1, 5);

    await expect(
      breaker.call(async () => Promise.reject(new Error('first failure'))),
    ).rejects.toThrow('first failure');

    await expect(
      breaker.call(async () => Promise.resolve('recovered')),
    ).resolves.toBe('recovered');

    await expect(
      breaker.call(async () => Promise.reject(new Error('second failure'))),
    ).rejects.toThrow('second failure');

    await expect(breaker.call(async () => Promise.resolve('still closed'))).resolves.toBe(
      'still closed',
    );

    expect((breaker as { state: CircuitBreakerState }).state).toBe(
      CircuitBreakerState.CLOSED,
    );
  });

  it('reopens on a failed half-open probe and requires the success threshold again', async () => {
    const breaker = new CircuitBreaker(1, 2, 1);

    await expect(
      breaker.call(async () => Promise.reject(new Error('trip circuit'))),
    ).rejects.toThrow('trip circuit');

    await new Promise((resolve) => setTimeout(resolve, 5));

    await expect(breaker.call(async () => Promise.resolve('probe 1'))).resolves.toBe(
      'probe 1',
    );

    expect((breaker as { state: CircuitBreakerState }).state).toBe(
      CircuitBreakerState.HALF_OPEN,
    );

    await expect(
      breaker.call(async () => Promise.reject(new Error('probe failed'))),
    ).rejects.toThrow('probe failed');

    expect((breaker as { state: CircuitBreakerState }).state).toBe(
      CircuitBreakerState.OPEN,
    );

    await new Promise((resolve) => setTimeout(resolve, 5));

    await expect(breaker.call(async () => Promise.resolve('probe 2'))).resolves.toBe(
      'probe 2',
    );

    expect((breaker as { state: CircuitBreakerState }).state).toBe(
      CircuitBreakerState.HALF_OPEN,
    );

    await expect(breaker.call(async () => Promise.resolve('probe 3'))).resolves.toBe(
      'probe 3',
    );

    expect((breaker as { state: CircuitBreakerState }).state).toBe(
      CircuitBreakerState.CLOSED,
    );
  });

  it('rejects concurrent probe requests while half-open', async () => {
    const breaker = new CircuitBreaker(1, 1, 1);

    await expect(
      breaker.call(async () => Promise.reject(new Error('trip circuit'))),
    ).rejects.toThrow('trip circuit');

    await new Promise((resolve) => setTimeout(resolve, 5));

    let releaseProbe: () => void;
    const firstProbe = breaker.call(
      () =>
        new Promise<string>((resolve) => {
          releaseProbe = () => resolve('probe completed');
        }),
    );

    await expect(breaker.call(async () => Promise.resolve('second probe'))).rejects.toBeInstanceOf(
      CircuitBreakerRejectedError,
    );

    releaseProbe!();

    await expect(firstProbe).resolves.toBe('probe completed');
  });
});