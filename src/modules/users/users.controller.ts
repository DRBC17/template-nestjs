import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';

import { PaginationDto } from '../../common/dtos';

import { CreateUserDto, UpdateUserDto, UpdatePasswordDto } from './dto';
import { UsersService } from './users.service';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiUnauthorizedResponse({
  description: 'Unauthorized.',
})
@Auth(ValidRoles.superUser, ValidRoles.admin)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'Successfully created user.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiCreatedResponse({
    description: 'Successfully get all users.',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Get user by term' })
  @ApiCreatedResponse({
    description: 'Successfully get user.',
  })
  findOne(@Param('term') term: string) {
    return this.usersService.findOne(term);
  }

  @Patch('/update/:id')
  @ApiOperation({ summary: 'Update user' })
  @ApiCreatedResponse({
    description: 'Successfully updated user.',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('/update-password/:id')
  @ApiOperation({ summary: 'Update user password' })
  @ApiCreatedResponse({
    description: 'Successfully updated user password.',
  })
  updatePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(id, updatePasswordDto);
  }

  @Patch('/update-state/:id')
  @ApiOperation({ summary: 'Update user state' })
  @ApiCreatedResponse({
    description: 'Successfully updated user state.',
  })
  updateState(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.usersService.updateState(id, isActive);
  }
}
