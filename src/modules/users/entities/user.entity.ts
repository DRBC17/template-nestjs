import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('text')
  fullName: string;

  @Column('text', {
    unique: true,
    transformer: {
      to: (value: string) => value.toLowerCase(),
      from: (value: string) => value,
    },
  })
  username: string;

  @Column('text')
  password: string;

  @Column('text', {
    array: true,
    default: ['user'], //TODO: Agregar sección para manejar roles
  })
  roles?: string[];

  @Column('boolean', { default: true })
  isActive?: boolean;

  @BeforeInsert()
  hashPasswordInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  @BeforeUpdate()
  hashPasswordUpdate() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  //TODO: Relaciones
}
