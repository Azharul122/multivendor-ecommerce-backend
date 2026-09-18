import { IRequestUser } from "../../types/user";


interface IProductPayload {
    name: string;
    description: string;
    price: number;
    images: string[];
    slug: string;
    categoryIds: string[];
    stock: number;
    isFeatured: boolean;
    isVerified: boolean;
    seller: IRequestUser;
}

export { IProductPayload };