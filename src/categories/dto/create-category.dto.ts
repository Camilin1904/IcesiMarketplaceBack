import { IsString, Length } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @Length(3,50)    
    readonly name:string;
    @IsString()
    @Length(0,500)    
    readonly description:string;
}
