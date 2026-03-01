import { ValueObjectException } from "../../../core/exceptions/value-object.exception";
import { MessageEnum } from "./message.enum";

export class AgeVO {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    static create(age: number): AgeVO {
        if (age <= 0) {
            throw new ValueObjectException(MessageEnum.AGE_GREATER_THAN_ZERO);
        }
        const ageVO = new AgeVO(age);
        return ageVO;
    }

    toValue(): number {
        return this.value;
    }

}