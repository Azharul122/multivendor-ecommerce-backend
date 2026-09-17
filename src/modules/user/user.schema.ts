import { Role } from "../../genereted/prisma/enums";


interface UserRegister {
    name: string;
    email: string;
    password: string;
    role: Role;
    image?: string;
}




export { UserRegister };