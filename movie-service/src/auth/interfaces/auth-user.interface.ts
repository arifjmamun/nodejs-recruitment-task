export enum AuthRole {
  Premium = 'premium',
  Basic = 'basic',
}

export interface AuthUser {
  userId: number;
  name: string;
  role: AuthRole;
}