import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignupDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({value})=>value?.trim())
    name:string;

    @IsEmail()
    @IsNotEmpty()
    @Transform(({value})=>value.toLowerCase())
    email:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5, {message:'Password should contain more than 5 characters'})
    password:string;
}
