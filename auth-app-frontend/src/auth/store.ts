import { LoginUserService, LogoutUserService } from '@/services/AuthService';
import type LoginData from '@/types/LoginData';
import type LoginResponseData from '@/types/LoginResponseData';
import type User from '@/types/User';
import { set } from 'date-fns';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const TOKEN_KEY = "maverick_are_the_best";

type AuthStatus = "idle" | "authenticating" | "authenticated" | "unauthenticated" | "anonymous";

type AuthState = {
    accessToken: string | null;
    user: User | null;
    authStatus: boolean;
    authLoading: boolean;
    login: (data: LoginData) => Promise<LoginResponseData>;
    logout: (silent?: boolean) => void;
    checkLogin: () => boolean | undefined;

    changeLocalLoginData?: (
        accessToken: string,
        user: User,
        authStatus: boolean,
        authLoading: boolean
    ) => void
}

const useAuth = create<AuthState>()(
    persist((set, get) => ({
        accessToken: null,
        user: null,
        authStatus: false,
        authLoading: false,
        login: async (loginData) => {
            console.log("started Login...");
            set({ authLoading: true });
            try {
                const response = await LoginUserService(loginData);
                console.log(response);
                set({
                    accessToken: response.accessToken,
                    user: response.userDto,
                    authStatus: true,

                })
                return Promise.resolve(response);
            } catch (error) {
                return Promise.reject(error);
            } finally {
                set({
                    authLoading: false
                })
            }
        },
        logout: async (silent = false) => {
            await LogoutUserService();

            set({ accessToken: null, user: null, authStatus: false, authLoading: false });
        },
        checkLogin: () => {
            if (get().accessToken && get().authStatus == true) {
                return true;
            } else {
                return false;
            }
        },
        changeLocalLoginData: (accessToken, user, authStatus, authLoading) => {
            set({
                accessToken: accessToken,
                user: user,
                authStatus: authStatus,
                authLoading: authLoading
            });
        }
    }), {
        name: TOKEN_KEY
    }),

)

export default useAuth;