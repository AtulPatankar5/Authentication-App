import { NavLink } from "react-router";
import { Button } from "./ui/button";

export default function Navbar() {
    return (
        <nav className="flex dark:border-b border-gray-600 md:flex-row flex-col gap-4 md:gap-0 py-5 md:py-0 md:h-14 justify-around items-center">
            <div className="font-semibold items-center flex gap-2">

                <span className="text-center h-6 w-6 rounded-md bg-gradient-to-r from-primary to-primary/40"><img src="../../public/auth-icon.png" alt="" /> </span>
                <NavLink to={"/"}>
                    <span>Auth Core</span>
                </NavLink>
            </div>

            <div className="flex gap-4 items-center ">
                <NavLink to={"/"} className="cursor-pointer">
                    Home
                </NavLink>
                <NavLink to={"/signup"}>
                    <Button size="sm" className="cursor-pointer" variant="outline">Sign Up</Button>
                </NavLink>
                <NavLink to={"/signin"}>
                    <Button size="sm" className="cursor-pointer" variant="outline" >Sign In</Button>
                </NavLink>
            </div>
        </nav>

    )
}