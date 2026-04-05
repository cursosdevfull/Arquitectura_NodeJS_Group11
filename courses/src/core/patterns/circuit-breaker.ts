export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export class CircuitBreakerRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CircuitBreakerRejectedError';
  }
}

export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: number = 0;
  private halfOpenInFlight: boolean = false;
  private readonly failureThreshold: number;
  private readonly successThreshold: number;
  private readonly resetTimeout: number;

  constructor(
    failureThreshold: number,
    successThreshold: number,
    timeout: number,
  ) {
    this.failureThreshold = failureThreshold;
    this.successThreshold = successThreshold;
    this.resetTimeout = timeout;
  }

  public async call<T>(action: () => Promise<T>): Promise<T> {
    if (this.state === CircuitBreakerState.OPEN) {
      if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
        this.moveToHalfOpen();
      } else {
        console.log('Circuit is open. Request blocked.');
        throw new CircuitBreakerRejectedError('Circuit is open');
      }
    }

    if (this.state === CircuitBreakerState.HALF_OPEN && this.halfOpenInFlight) {
      console.log('Circuit is half-open. Probe request already in progress.');
      throw new CircuitBreakerRejectedError('Circuit is half-open');
    }

    const isHalfOpenAttempt = this.state === CircuitBreakerState.HALF_OPEN;

    if (isHalfOpenAttempt) {
      this.halfOpenInFlight = true;
    }

    try {
      const result = await action();
      this.onSuccess();
      console.log('Request succeeded. Circuit state:', this.state);
      return result;
    } catch (error) {
      this.onFailure();
      console.log('Request failed. Circuit state:', this.state);
      throw error;
    } finally {
      if (isHalfOpenAttempt) {
        this.halfOpenInFlight = false;
      }
    }
  }

  private onSuccess() {
    if (this.state === CircuitBreakerState.CLOSED) {
      this.failureCount = 0;
      return;
    }

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.successCount++;
      this.failureCount = 0;
      if (this.successCount >= this.successThreshold) {
        this.reset();
      }
    }
  }

  private onFailure() {
    this.lastFailureTime = Date.now();

    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.trip();
      return;
    }

    this.failureCount++;
    this.successCount = 0;

    if (this.failureCount >= this.failureThreshold) {
      this.trip();
    }
  }

  private moveToHalfOpen() {
    this.state = CircuitBreakerState.HALF_OPEN;
    this.failureCount = 0;
    this.successCount = 0;
  }

  private trip() {
    this.state = CircuitBreakerState.OPEN;
    this.successCount = 0;
  }

  private reset() {
    this.state = CircuitBreakerState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.halfOpenInFlight = false;
  }
}
