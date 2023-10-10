import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Quesion extends BaseEntity {
    @PrimaryGeneratedColumn('rowid')
    id : number;

    @Column()
    question_text : string ;
}