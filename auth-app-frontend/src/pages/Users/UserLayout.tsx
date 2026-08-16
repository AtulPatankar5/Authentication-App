import useAuth from '@/auth/store';
import { Navigate, Outlet } from 'react-router';


const UserLayout = () => {
    const auth = useAuth();

    // If user is not logged in, redirect to login page
    if (!auth.checkLogin()) {
        // You might want to use a navigation function that preserves the redirect URL
        // For simplicity, this will redirect to the root login page
        return <Navigate to="/signin" replace />;
    }
    return (
        <div>
            <Outlet />
        </div>
    );
}

export default UserLayout;
