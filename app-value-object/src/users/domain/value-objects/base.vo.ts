export abstract class BaseVO<T> {
    protected readonly value: T;

    toValue(): T {
        return this.value;
    }
}