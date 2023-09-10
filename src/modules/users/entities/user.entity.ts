import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('text', {
    unique: true,
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

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.username = this.username.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
