export type User={
    sId: string;
    sDisplayName: string;
    sEmail: string;
    sToken: string;
    imageUrl?: string;
}
export type LoginCreds={
    sEmail: string;
    sPassword: string;
}
export type RegisterCreds={
    sEmail: string;
    sDisplayName: string;
    sPassword: string;
}