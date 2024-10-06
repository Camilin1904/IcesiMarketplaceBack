import { IsString, IsUUID } from 'class-validator';

export class SubscribeCategoryDto{
    @IsString()
    @IsUUID()
    readonly categoryId: string;
}
