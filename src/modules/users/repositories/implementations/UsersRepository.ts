import { Equal, getRepository, Like, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {


    return await this.repository
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.games","games")
      .where("users.id = :id ", {id:user_id})
      .getOne() as User;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(
      `
      SELECT *
      FROM users
      ORDER BY first_name ASC
      `);
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
      return await this.repository
            .query(`  select * from users 
                      where LOWER(first_name) = '${first_name.toLowerCase()}' 
                      and LOWER(last_name) = '${last_name.toLowerCase()}'`);
  }
}
