import useAuth from '@/auth/store';
import { getRefreshToken } from '@/services/AuthService';
import axios from 'axios';

const apiClient = axios.create({
    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:8081/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 10000,
});


// ================================
// REQUEST INTERCEPTOR
// ================================

apiClient.interceptors.request.use(
    (config) => {

        const accessToken = useAuth.getState().accessToken;

        console.log("inside Request Interceptor");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// ================================
// REFRESH QUEUE
// ================================

let isRefreshing = false;

let pending: Array<
    (token: string | null) => void
> = [];


function queueRequest(
    callback: (token: string | null) => void
) {
    pending.push(callback);
}


function resolveQueue(token: string | null) {

    pending.forEach((callback) => {
        callback(token);
    });

    pending = [];
}


// ================================
// RESPONSE INTERCEPTOR
// ================================

apiClient.interceptors.response.use(

    (response) => {
        return response;
    },

    async (error) => {

        const original = error.config;

        console.log("inside Response Interceptor");


        // Only handle 401
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }


        // ================================
        // PREVENT INFINITE RETRY
        // ================================

        if (original._retry) {

            console.log("Already retried. Logging out.");

            useAuth.getState().logout();

            return Promise.reject(error);
        }


        // Mark request as retried
        original._retry = true;


        // ================================
        // ANOTHER REQUEST IS REFRESHING
        // ================================

        if (isRefreshing) {

            console.log("Refresh already running. Queueing request.");

            return new Promise((resolve, reject) => {

                queueRequest((newToken) => {

                    if (!newToken) {
                        reject(error);
                        return;
                    }

                    original.headers.Authorization =
                        `Bearer ${newToken}`;

                    resolve(apiClient(original));
                });

            });
        }


        // ================================
        // START REFRESH
        // ================================

        isRefreshing = true;

        console.log("Starting token refresh...");


        try {

            const refreshResponse = await getRefreshToken();

            const newToken = refreshResponse.accessToken;


            if (!newToken) {
                throw new Error(
                    "No access token received from refresh API"
                );
            }


            console.log("New access token received");


            // ================================
            // UPDATE AUTH STORE
            // ================================

            useAuth.getState().changeLocalLoginData(
                refreshResponse.accessToken,
                refreshResponse.userDto,
                true,
                false
            );


            // ================================
            // RESOLVE QUEUED REQUESTS
            // ================================

            resolveQueue(newToken);


            // ================================
            // RETRY ORIGINAL REQUEST
            // ================================

            original.headers.Authorization =
                `Bearer ${newToken}`;

            return apiClient(original);

        }


        catch (refreshError) {

            console.error(
                "Token refresh failed:",
                refreshError
            );

            resolveQueue(null);

            useAuth.getState().logout();

            return Promise.reject(refreshError);

        }


        finally {

            isRefreshing = false;

        }
    }
);


export default apiClient;