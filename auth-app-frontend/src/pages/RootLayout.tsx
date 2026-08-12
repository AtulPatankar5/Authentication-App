import { Outlet } from "react-router";
import Navbar from "@/components/Navbar";
import { Toaster } from 'react-hot-toast';

export default function RootLayout() {
    return (
        <div>
            <Toaster />
            <Navbar />
            <Outlet />
        </div>
    )
}