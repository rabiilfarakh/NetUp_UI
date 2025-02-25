export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    birthday: string;
    password: string;
    address: string;
    experience: string;
    location: string;
    photo: string;
    role: 'USER' | 'ADMIN';
  }

export interface UserRequest{
    firstName: string;
    lastName: string;
    email: string;
    birthday: string;
    password: string;
    address: string;
    experience: string;
    location: string;
    photo: string;
}
