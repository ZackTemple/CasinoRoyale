import { IUser } from '../interfaces/user';

export class User implements IUser{

  username: string;
  password: string;
  email: string;
}
