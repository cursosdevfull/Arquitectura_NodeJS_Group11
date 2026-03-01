import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { type Request, type Response } from 'express';
import { AppService } from './app.service';
import { AddressDto, extractValidationMessages, UserDto, UserIdDto, UserQueryStringDto } from './validators/validators-class-validator';

@Controller("user")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async createUser(@Req() req: Request, @Res() res: Response){

    const address = plainToInstance(AddressDto, req.body.address)

    const dto = new UserDto()
    dto.name = req.body.name
    dto.lastname = req.body.lastname
    dto.age = req.body.age
    dto.hobbies = req.body.hobbies
    dto.books = req.body.books
    dto.email = req.body.email
    dto.address = address

    validate(dto).then(errors => {
        const messages = extractValidationMessages(errors)
      if(messages.length > 0) {
        return res.status(400).json(messages)
      }

      return res.status(201).send("User created successfully");
    })

/*     const validationResult = validateUser(req)
    if (validationResult.length > 0) {
      return res.status(400).json(validationResult);
    } */

/*         const result = validateUserZod(req)

        if (!result.success) {
           res.status(400).json(result.error.message)
        } */

        //return res.status(201).send("User created successfully");

  }

  @Post("create/:id")
  createUser2(@Body() body: UserDto, @Param() params: UserIdDto, @Query() query: UserQueryStringDto) {
    console.log(body)
    return "User created successfully"
  }
}
