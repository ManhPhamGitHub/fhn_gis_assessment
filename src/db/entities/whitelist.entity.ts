import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'whitelist_domains' })
export class WhitelistDomain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  domain: string;
}
