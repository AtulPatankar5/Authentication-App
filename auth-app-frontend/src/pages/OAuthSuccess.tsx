import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import useAuth from '@/auth/store';
import { getRefreshToken } from '@/services/AuthService';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/spinner';
import { useNavigate } from 'react-router';

const OAuthSuccess = () => {

    const [isrefreshing, setisRefreshing] = useState<boolean>(false);
    const auth = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        getAccessToken();
    }, [])

    const getAccessToken = async () => {
        if (!isrefreshing) {
            setisRefreshing(true);

            try {
                const response = await getRefreshToken();
                auth.changeLocalLoginData(
                    response.accessToken,
                    response.userDto,
                    true,
                    false
                );
                toast.success("Login success");
                navigate("/user/dashboard");
            } catch (error) {
                toast.error("Login failed");
            } finally {
                setisRefreshing(false);
            }
        }
    }
    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            <Spinner />
            <h1>Please wait....</h1>
        </div>
    );
}

export default OAuthSuccess;
