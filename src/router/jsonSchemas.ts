import { validationMetadatasToSchemas, } from 'class-validator-jsonschema';
import { TodoDto } from '../dto/TodoDto.js';
import { TodoCreateDto } from '../dto/TodoCreateDto.js';
import { TodoUpdateDto } from '../dto/TodoUpdateDto.js';
import { UserDto } from '../dto/UserDto.js';
import { UserCreateDto } from '../dto/UserCreateDto.js';
import { UserAuthDto } from '../dto/UserAuthDto.js';

const knownDtoClasses = {
  TodoDto,
  TodoCreateDto,
  TodoUpdateDto,
  UserDto,
  UserCreateDto,
  UserAuthDto,
} as const;

type KnownDtoKeys = keyof typeof knownDtoClasses;

const allSchemas = validationMetadatasToSchemas();

type SchemasType = ReturnType<typeof validationMetadatasToSchemas>;

export const dtoJsonSchemas: Pick<SchemasType, KnownDtoKeys> = Object.fromEntries(
  Object.entries(knownDtoClasses).map(([key, cls]) => {
    return [key, allSchemas[cls.name]];
  })
) as Pick<SchemasType, KnownDtoKeys>;

export const objectIdJsonSchema = {
  type: 'string',
  pattern: '^[a-fA-F0-9]{24}$',
};
