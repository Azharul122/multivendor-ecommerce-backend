import { BillingInterval } from "../../genereted/prisma/enums";


interface IPlanPayload {
    name: string
    price: number
    interval: BillingInterval
}

export { IPlanPayload }



