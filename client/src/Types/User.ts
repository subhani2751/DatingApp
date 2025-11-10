export type User = {
    sId: string;
    sDisplayName: string;
    sEmail: string;
    sToken: string;
    sImageUrl?: string;
    roles: string[];
}
export type LoginCreds = {
    sEmail: string;
    sPassword: string;
}
export type RegisterCreds = {
    sEmail: string;
    sDisplayName: string;
    sPassword: string;
    sGender: string;
    sCity: string;
    sCountry: string;
    DateOfBirth: string;
}