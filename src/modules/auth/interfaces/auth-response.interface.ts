import { User } from 'src/modules/users/entities/user.entity';

export interface AuthResponse {
  user: User;
  token: string;
}
