import apiClient from "@/config/ApiClient";
import type RegisterData from "@/types/Register";

export const RegisterUserService = async (signupData: RegisterData) => {
    return await apiClient.post('/auth/register', signupData);
}
// export const LoginUser = async (signupData: RegisterData) => {
//     const response = await apiClient.post('/auth/login', signupData);
//     return response.data;
// }