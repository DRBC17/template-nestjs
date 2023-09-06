import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('text', {
    unique: true,
    transformer: {
      to: (value: string) => value.toLowerCase(),
      from: (value: string) => value,
    },
  })
  username: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text')
  fullName: string;

  @Column('text', {
    array: true,
    default: ['user'], //TODO: Agregar sección para manejar roles
  })
  roles?: string[];

  @Column('boolean', { default: true })
  isActive?: boolean;

  //TODO: Relaciones
}
