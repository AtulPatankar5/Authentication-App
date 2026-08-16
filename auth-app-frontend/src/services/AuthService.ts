import apiClient from "@/config/ApiClient";
import type LoginData from "@/types/LoginData";
import type LoginResponseData from "@/types/LoginResponseData";
import type RegisterData from "@/types/RegisterData";
import type User from "@/types/User";

export const RegisterUserService = async (signupData: RegisterData) => {
    return await apiClient.post('/auth/register', signupData);
}
export const LoginUserService = async (loginData: LoginData) => {
    const response = await apiClient.post<LoginResponseData>('/auth/login', loginData);
    return response.data;
}
export const LogoutUserService = async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
}

export const getUserDetailsByEmail = async (email: string) => {
    const response = await apiClient.get<User>(`/user/get-user/email?emailId=${email}`);
    return response.data;
}
export const getAllUsers = async () => {
    const response = await apiClient.get<User[]>(`/user/get-allUsers`);
    return response.data;
}

export const getRefreshToken = async () => {
    const response = await apiClient.post<LoginResponseData>('/auth/refresh');
    return response.data;
}