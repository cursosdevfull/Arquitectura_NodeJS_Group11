import { ValueObjectException } from "../../../core/exceptions/value-object.exception";
import { BaseVO } from "./base.vo";
import { MessageEnum } from "./message.enum";

export class EmailVO extends BaseVO<string>{
    private constructor(value: string) {
        super();
    }

    static create(email: string): EmailVO {
        if (!email || !email.includes('@')) {
            throw new ValueObjectException(MessageEnum.INVALID_EMAIL_ADDRESS);
        }
        const emailVO = new EmailVO(email);
        return emailVO;
    }
}