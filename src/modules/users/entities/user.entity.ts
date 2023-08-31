import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('text')
  fullName: string;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column('text')
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user'], //TODO: Agregar sección para manejar roles
  })
  roles?: string[];

  @Column({ type: 'boolean', default: true })
  isActive?: boolean;

  @BeforeInsert()
  HashPasswordInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  // @BeforeUpdate()
  //TODO: Relaciones
}
