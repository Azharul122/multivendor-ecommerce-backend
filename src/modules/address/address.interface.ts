// addressLineOne String?
//   address      String
//   city       String
//   postalCode String
//   country    String

interface IAddressPayload {
    addressLineOne?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export { IAddressPayload };