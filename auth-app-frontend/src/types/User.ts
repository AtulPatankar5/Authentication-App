export default interface User {
    id: string;
    email: string;
    name?: string;
    enable: string;
    image?: string;
    updatedAt?: string;
    createdAt?: string;
    provider?: string;
    roles?: [];
}   