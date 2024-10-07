import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PaginationDto } from '../../src/common/dtos/pagination.dto';
import { User } from '../../src/auth/entities/user.entity';
import { AuthService } from '../../src/auth/auth.service';
import { CategoriesService } from '../../src/categories/categories.service';
import { CreateCategoryDto } from '../../src/categories/dto/create-category.dto';
import { SubscribeCategoryDto } from '../../src/categories/dto/subscribe-category.dto';
import { UpdateCategoryDto } from '../../src/categories/dto/update-category.dto';
import { Category } from '../../src/categories/entities/category.entity';
import { MailService, SmsService } from '../../src/common/common.service';
import crypto from 'crypto';

describe('CategoriesService', () => {
    let service: CategoriesService;

    const mockSms = {}

    const mockMail = {}

    const mockCategoryRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOneBy: jest.fn(),
        preload: jest.fn(),
        remove: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
    };

    const mockAuthService = {
        myInfo: jest.fn(),
    };

    const createCategoryDto: CreateCategoryDto = { 
        name: 'Test Category', 
        description: 'Test Description' 
    };
    
    const updateCategoryDto: UpdateCategoryDto = { 
        name: 'Updated Category', 
        description: 'Updated Description' 
    };
    
    const category: Category = new Category();
    category.id = crypto.randomUUID();
    category.slug = 'test-category'; // Genera un slug válido.
    category.name = createCategoryDto.name;
    category.description = createCategoryDto.description;
    category.products = []; // Inicializar como un array vacío
    category.subscribers = []; // Inicializar como un array vacío

    const paginationDto: PaginationDto = { limit: 10, offset: 0 };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoriesService,
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockCategoryRepository,
                },
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
                {
                    provide: SmsService,
                    useValue: mockSms
                },
                {
                    provide: MailService,
                    useValue: mockMail
                }
            ],
        }).compile();

        service = module.get<CategoriesService>(CategoriesService);
    });

    describe('create', () => {
        it('should create a category successfully', async () => {
            mockCategoryRepository.create.mockReturnValue(category);
            mockCategoryRepository.save.mockResolvedValue(category);

            const result = await service.create(createCategoryDto);

            expect(result).toEqual(category);
            expect(mockCategoryRepository.create).toHaveBeenCalledWith(createCategoryDto);
            expect(mockCategoryRepository.save).toHaveBeenCalledWith(category);
        });

        it('should throw InternalServerErrorException if an error occurs', async () => {
            mockCategoryRepository.save.mockImplementation(() => {
                throw new Error();
            });

            await expect(service.create(createCategoryDto)).rejects.toThrow(InternalServerErrorException);
            await expect(service.create(createCategoryDto)).rejects.toThrow('Error creating category');
        });
    });

    describe('findAll', () => {
        it('should return a list of categories with pagination', async () => {
            mockCategoryRepository.find.mockResolvedValue([category]);

            const result = await service.findAll(paginationDto);

            expect(result).toEqual([category]);
            expect(mockCategoryRepository.find).toHaveBeenCalledWith({ take: paginationDto.limit, skip: paginationDto.offset });
        });

        it('should return an empty array if no categories exist', async () => {
            mockCategoryRepository.find.mockResolvedValue([]);

            const result = await service.findAll(paginationDto);

            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should return a category by ID', async () => {
            mockCategoryRepository.findOneBy.mockResolvedValue(category);
            mockCategoryRepository.getOne.mockResolvedValue(category);

            const result = await service.findOne(category.id);
            
            expect(result).toEqual(category);
            expect(mockCategoryRepository.findOneBy).toHaveBeenCalledWith({ id: category.id });
        });
        
        it('should return a category by slug', async () => {
            const slug = 'test-category';
            mockCategoryRepository.findOneBy = jest.fn().mockReturnValue(category);

            const result = await service.findOne(slug);

            expect(result).toEqual(category);
        });

        it('should throw NotFoundException if no category is found', async () => {
            mockCategoryRepository.findOneBy.mockResolvedValue(null);

            await expect(service.findOne(category.id)).rejects.toThrow(NotFoundException);
        });
        
    });
    
    describe('update', () => {
        it('should update a category successfully', async () => {
            mockCategoryRepository.preload.mockResolvedValue(category);
            mockCategoryRepository.save.mockResolvedValue(category);

            const result = await service.update(category.id, updateCategoryDto);

            expect(result).toEqual(category);
            expect(mockCategoryRepository.preload).toHaveBeenCalledWith({ id: category.id, ...updateCategoryDto });
            expect(mockCategoryRepository.save).toHaveBeenCalledWith(category);
        });

        it('should throw NotFoundException if the category is not found', async () => {
            mockCategoryRepository.preload.mockResolvedValue(null);

            await expect(service.update(category.id, updateCategoryDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove a category successfully', async () => {
            mockCategoryRepository.findOneBy.mockResolvedValue(category);
            mockCategoryRepository.remove.mockResolvedValue(category);

            const result = await service.remove(category.id);

            expect(result).toEqual(category);
            expect(mockCategoryRepository.findOneBy).toHaveBeenCalledWith({ id: category.id });
            expect(mockCategoryRepository.remove).toHaveBeenCalledWith(category);
        });

        it('should throw NotFoundException if the category is not found', async () => {
            mockCategoryRepository.findOneBy.mockResolvedValue(null);

            await expect(service.remove(category.id)).rejects.toThrow(NotFoundException);
        });
    });
    
    describe('subscribe', () => {
        it('should subscribe a user to a category successfully', async () => {
            const userId = 'user-id';
            const subscribeCategoryDto: SubscribeCategoryDto = { categoryId: category.id };
            const user: User = { id: userId } as User;

            mockCategoryRepository.findOneBy.mockResolvedValue(category);
            mockAuthService.myInfo.mockResolvedValue(user);
            mockCategoryRepository.save.mockResolvedValue({ ...category, subscribers: [user] });

            const result = await service.subscribe(subscribeCategoryDto, userId);

            expect(result).toEqual({ ...category, subscribers: [user] });
            expect(mockCategoryRepository.findOneBy).toHaveBeenCalledWith({ id: category.id });
            expect(mockAuthService.myInfo).toHaveBeenCalledWith(userId);
        });
    });
});
