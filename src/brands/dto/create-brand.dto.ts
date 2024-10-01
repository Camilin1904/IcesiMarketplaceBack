import { IsString, Length } from "class-validator";

export class CreateBrandDto {
    @IsString()
    @Length(3,50)    
    readonly name:string;
}
