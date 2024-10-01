import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class BrandsService {

  constructor(@InjectRepository(Category) private readonly brandRepository: Repository<Category>){}

  create(createBrandDto: CreateBrandDto) {
    const category = this.brandRepository.create(createBrandDto);
    return this.brandRepository.save(category);
  }

  findAll(paginationDto:PaginationDto) {
    const {limit=10, offset=0} = paginationDto;
    return this.brandRepository.find({
      take:limit,
      skip:offset,
    });
  }

  findOne(term: string) {
    if(isUUID(term)){
      return this.brandRepository.findOneBy({id:term});
    }
    else{
      const queryBuilder = this.brandRepository.createQueryBuilder();
      return queryBuilder.where('UPPER(name) =: category or slug:=slug',
                                {
                                  category: term.toUpperCase(), slug:term.toLowerCase()
                                }).getOne()
    }
      

  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const category = await this.brandRepository.preload({
      id:id,
      ...updateBrandDto
    });

    return this.brandRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    return this.brandRepository.remove(category);
  }
}
