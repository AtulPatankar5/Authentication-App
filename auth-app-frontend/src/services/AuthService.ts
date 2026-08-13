import apiClient from "@/config/ApiClient";
import type LoginData from "@/types/LoginData";
import type RegisterData from "@/types/RegisterData";

export const RegisterUserService = async (signupData: RegisterData) => {
    return await apiClient.post('/auth/register', signupData);
}
export const LoginUserService = async (loginData: LoginData) => {
    const response = await apiClient.post('/auth/login', loginData);
    return response.data;
}