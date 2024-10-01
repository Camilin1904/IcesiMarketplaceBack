import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class BrandsService {

  constructor(@InjectRepository(Brand) private readonly brandRepository: Repository<Brand>){}

  create(createBrandDto: CreateBrandDto) {
    const brand = this.brandRepository.create(createBrandDto);
    return this.brandRepository.save(brand);
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
      return queryBuilder.where('UPPER(name) =: brand or slug:=slug',
                                {
                                  brand: term.toUpperCase(), slug:term.toLowerCase()
                                }).getOne()
    }
      

  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandRepository.preload({
      id:id,
      ...updateBrandDto
    });

    return this.brandRepository.save(brand);
  }

  async remove(id: string) {
    const brand = await this.findOne(id);
    return this.brandRepository.remove(brand);
  }
}
