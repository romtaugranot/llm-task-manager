export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    createdAt: Date;
    lastLoginAt?: Date;
}
