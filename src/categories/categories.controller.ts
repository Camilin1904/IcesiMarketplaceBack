import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Request, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SubscribeCategoryDto } from './dto/subscribe-category.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategorydDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategorydDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoriesService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.categoriesService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }

  @Post('subscribe')
  @UseGuards(AuthGuard('jwt'))
  subscribe(@Request() req, @Body() subscribeCategoryDto:SubscribeCategoryDto){
    return this.categoriesService.subscribe(subscribeCategoryDto, req.user.id)
  }
}
