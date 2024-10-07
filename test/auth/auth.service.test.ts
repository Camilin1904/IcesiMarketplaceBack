import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { User } from '../../src/auth/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../../src/auth/dtos/create-user.dto';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { validRoles } from '../../src/auth/interfaces/valid-roles';
import { LoginUserDto } from '../../src/auth/dtos/login-user.dto';
import { SellerDto } from '../../src/auth/dtos/seller-dto';
import { UpdateUserDto } from '../../src/auth/dtos/update-user.dto';
import { PaginationDto } from '../../src/common/dtos/pagination.dto';



describe('AuthService', () => {
    const id = '1'
    const password = 'StrongPass1'
    const hashedPassword = bcrypt.hashSync(password, 10) 
    const user = { 
        id: id, 
        name: 'test', 
        email: 'test@example.com', 
        password: hashedPassword
    };
    const createUserDto: CreateUserDto = { email: 'test@example.com', password: password, name: 'Test User' };
    const createUserDto2: CreateUserDto = { email: 'tes2t@example.com', password: password, name: 'Test User2' };
    const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'StrongPass1' };
    const paginationDto: PaginationDto = { limit: 10, offset: 0 };


    let service: AuthService;
  
    // Mock del repositorio
    const mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      preload: jest.fn(),
    };
    
    // Mock del servico jwt
    const mockJwtService = {
      sign: jest.fn(),
    };
  
    // Crear un modulo de testing con un AuthService y nuestros mocks de repositorio y jwt
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: getRepositoryToken(User),
            useValue: mockUserRepository,
          },
          {
            provide: JwtService,
            useValue: mockJwtService,
          },
        ],
      }).compile();
      // Generamos nuestro Auth Service
      service = module.get<AuthService>(AuthService);
    });

    describe('createUser', () => {

        it('should create a user successfully', async () => {
            // simulamos que no existen usuarios y el comportamiento de crear y guardar
            mockUserRepository.find.mockResolvedValueOnce([]);
            mockUserRepository.create.mockReturnValue({ ...createUserDto, password: hashedPassword, roles: [validRoles.user, validRoles.admin] });
            mockUserRepository.save.mockResolvedValue({ ...createUserDto, password: hashedPassword });
        
            const result = await service.createUser(createUserDto);
        
            expect(result).toEqual({ ...createUserDto, password: hashedPassword, roles: [validRoles.user, validRoles.admin] });
        });

        it('should create a user with only user role when users already exist', async () => {
          mockUserRepository.find.mockResolvedValueOnce([{ id: '1', email: 'existing@example.com' }]); // Simula que ya hay usuarios
          mockUserRepository.create.mockReturnValue({ ...createUserDto, password: hashedPassword, roles: [validRoles.user] });
          mockUserRepository.save.mockResolvedValue({ ...createUserDto, password: hashedPassword });
          
          const result = await service.createUser(createUserDto);
        
          expect(result).toEqual({ ...createUserDto, password: hashedPassword, roles: [validRoles.user] });
        });

        it('should throw a InternalServerErrorException if the db returns an error', async () => {
          mockUserRepository.save.mockImplementation(() => {
            throw new Error();
          });
    
          await expect(service.createUser(createUserDto)).rejects.toThrow(InternalServerErrorException);
          await expect(service.createUser(createUserDto)).rejects.toThrow('Error creating user');
        });
      });

      describe('loginUser', () => {

        it('should return user info and token on successful login', async () => {
          // mock del retorno del repositorio
          mockUserRepository.findOne.mockResolvedValue(user);
          // mock del jwt
          mockJwtService.sign.mockReturnValue('token');
    
          const result = await service.loginUser(loginUserDto);
    
          expect(result).toEqual({
            user_id: user.id,
            email: user.email,
            token: 'token',
          });

          expect(mockUserRepository.findOne).toHaveBeenCalledWith({
            where: { email: loginUserDto.email },
            select: ['id', 'email', 'password'],
          });

          expect(bcrypt.compareSync(loginUserDto.password, user.password)).toBe(true);
        });
    
        it('should throw an UnauthorizedException for invalid credentials', async () => {
          const loginUserDto: LoginUserDto = { email: 'test@example.com', password: 'wrongPassword' };
          mockUserRepository.findOne.mockResolvedValue(null); // Simulando que el usuario no existe
    
          await expect(service.loginUser(loginUserDto)).rejects.toThrow(UnauthorizedException);
          await expect(service.loginUser(loginUserDto)).rejects.toThrow('Invalid credentials');
        });
      });

      describe('becomeSeller', () => {
        it('should update user roles to include seller', async () => {
          const id = '1';
          const sellerDto: SellerDto = { phone: '123456789', location: 'Javeriana' };
          const user = { id, roles: [validRoles.user], phone: '', location: '' };
    
          mockUserRepository.findOne.mockResolvedValue(user);
          mockUserRepository.preload.mockResolvedValue({ ...user, ...sellerDto, roles: [validRoles.user, validRoles.seller] });
          mockUserRepository.save.mockResolvedValue({ ...user, ...sellerDto, roles: [validRoles.user, validRoles.seller] });
    
          const result = await service.becomeSeller(id, sellerDto);
    
          expect(result).toEqual({ ...user, ...sellerDto, roles: [validRoles.user, validRoles.seller] });
          expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id } });
          expect(mockUserRepository.preload).toHaveBeenCalledWith({
            id,
            roles: [validRoles.user, validRoles.seller],
            ...sellerDto,
          });
          expect(mockUserRepository.save).toHaveBeenCalled();
        });
      });

      describe('myInfo', () => {
        it('should return the user information', async () => {
            const id = '1'
            const user = { id: id, name: 'test', email: 'test@example.com', password: bcrypt.hashSync("StrongPassS1", 10) };
      
            mockUserRepository.findOne.mockResolvedValue(user);
            
            const result = await service.myInfo('1');
      
            expect(result).toEqual(user);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id } });
          });
      })

      describe('update', () => {
        it('should update a user successfully', async () => {
            const id = '1';
            const updateUserDto: UpdateUserDto = {
                name: 'Updated Name',
                password: '',
                phone: '',
                location: ''
            };
            const user = { id, ...updateUserDto };
    
            mockUserRepository.preload.mockResolvedValue(user);
            mockUserRepository.save.mockResolvedValue(user);
    
            const result = await service.update(id, updateUserDto);
    
            expect(result).toEqual(user);
            expect(mockUserRepository.preload).toHaveBeenCalledWith({ id, ...updateUserDto });
            expect(mockUserRepository.save).toHaveBeenCalledWith(user);
        });
    
    });

    describe('findAll', () => {
        it('should return a list of users with pagination', async () => {
            const users = [{ id: '1', email: 'test1@example.com' }, { id: '2', email: 'test2@example.com' }];
    
            mockUserRepository.find.mockResolvedValue(users);
    
            const result = await service.findAll(paginationDto);
    
            expect(result).toEqual(users);
            expect(mockUserRepository.find).toHaveBeenCalledWith({ take: paginationDto.limit, skip: paginationDto.offset });
        });
    
        it('should return an empty array if no users exist', async () => {
    
            mockUserRepository.find.mockResolvedValue([]);
    
            const result = await service.findAll(paginationDto);
    
            expect(result).toEqual([]);
        });
    });

    describe('findByName', () => {
        it('should return users by name with pagination', async () => {
            const name = 'Test User';
            const paginationDto: PaginationDto = { limit: 10, offset: 0 };
            const users = [{ id: '1', name }, { id: '2', name }];
    
            mockUserRepository.find.mockResolvedValue(users);
    
            const result = await service.findByName(name, paginationDto);
    
            expect(result).toEqual(users);
            expect(mockUserRepository.find).toHaveBeenCalledWith({ where: { name }, take: paginationDto.limit, skip: paginationDto.offset });
        });
    
        it('should return an empty array if no users found by name', async () => {
            const name = 'Nonexistent User';
            const paginationDto: PaginationDto = { limit: 10, offset: 0 };
    
            mockUserRepository.find.mockResolvedValue([]);
    
            const result = await service.findByName(name, paginationDto);
    
            expect(result).toEqual([]);
        });
    });

    
    describe('findByEmail', () => {
        it('should return a user by email', async () => {
            const email = 'test@example.com';
            const user = { id: '1', email };
    
            mockUserRepository.findOne.mockResolvedValue(user);
    
            const result = await service.findByEmail(email);
    
            expect(result).toEqual(user);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email } });
        });
    
        it('should return null if no user found by email', async () => {
            const email = 'nonexistent@example.com';
    
            mockUserRepository.findOne.mockResolvedValue(null);
    
            const result = await service.findByEmail(email);
    
            expect(result).toBeNull();
        });
    });

    
    describe('delete', () => {
        it('should deactivate a user', async () => {
            const id = '1';
            const user = { id, isActive: false };
    
            mockUserRepository.save.mockResolvedValue(user);
    
            const result = await service.delete(id);
    
            expect(result).toEqual(user);
            expect(mockUserRepository.preload).toHaveBeenCalledWith({ id, isActive: false });
        });
    
    });
       
  
})