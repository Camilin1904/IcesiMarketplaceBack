import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class CategoriesService {

  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>){}

  create(createBrandDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createBrandDto);
    return this.categoryRepository.save(category);
  }

  findAll(paginationDto:PaginationDto) {
    const {limit=10, offset=0} = paginationDto;
    return this.categoryRepository.find({
      take:limit,
      skip:offset,
    });
  }

  findOne(term: string) {
    if(isUUID(term)){
      return this.categoryRepository.findOneBy({id:term});
    }
    else{
      const queryBuilder = this.categoryRepository.createQueryBuilder();
      return queryBuilder.where('UPPER(name) =: category or slug:=slug',
                                {
                                  category: term.toUpperCase(), slug:term.toLowerCase()
                                }).getOne()
    }
      

  }

  async update(id: string, updateBrandDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload({
      id:id,
      ...updateBrandDto
    });

    return this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    return this.categoryRepository.remove(category);
  }
}
