import { User } from '../entities/user.entity';

export interface UserResponse {
  message: string;
  user?: User;
}
