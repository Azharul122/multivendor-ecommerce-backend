import z from "zod";
import { Role } from "../../genereted/prisma/browser";



const registerZodValidation = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.nativeEnum(Role).default(Role.USER),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});


export const userValidation = {
    register: registerZodValidation,
    login: loginSchema,
};

