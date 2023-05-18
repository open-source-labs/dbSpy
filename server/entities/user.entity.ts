import { Entity, PrimaryColumn, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    id!: number;

    @Column()
    full_name!: string;

    @Column()
    sub!: string;

    @Column()
    email!: string;

    @Column()
    picture!: string;

    @Column()
    pg_schema!: string;

    @Column()
    password!: string;
}

@Entity()
export class UserPost extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    user_name!: string;
}