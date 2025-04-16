export interface User {
  email: string;
  role: string;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserRegisterDTO {
  email: string;
  username: string,
  password: string;
  role: string
}

export interface AuthContextType {
  user: User | null;
  signup: (data: UserRegisterDTO) => Promise<any>;
  signin: (data: UserLoginDTO) => Promise<any>;
  isAuthenticated: boolean;
  errors: string[];
  loading: boolean;
}
