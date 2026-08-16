import { useState } from "react";
import { motion } from "framer-motion";
import {
    AlertCircleIcon,
    ArrowRight,
    Eye,
    EyeOff,
    Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import type LoginData from "@/types/LoginData";
import toast from "react-hot-toast";
import { LoginUserService } from "@/services/AuthService";
import { useNavigate } from "react-router";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import useAuth from "@/auth/store";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const [data, setData] = useState<LoginData>({
        email: "",
        password: ""
    })
    const isFormInvalid =
        !data.email.trim() ||
        !data.password.trim();

    const login = useAuth((state) => state.login);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const validateForm = () => {
        const requiredFields = {
            password: "password",
            email: "email",
        };

        for (const [field, label] of Object.entries(requiredFields)) {
            const value = data[field as keyof typeof data];

            if (typeof value === "string" && value.trim() === "") {
                setError("All fields are required.");
                toast.error(`${label} field is required.`);
                return false;
            }
        }

        return true;
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }
        try {
            await login(data);
            // const res = await LoginUserService(data);
            toast.success("User LoggedIn Successfully");
            // console.log(res);
            navigate("/user/dashboard")

        } catch (error: any) {
            if (error.response) {
                // toast.error(error.response.data.message);
                setError(error.response.data.message);
            } else {
                toast.error("Network Error!! ");
            }
            setTimeout(() => {
                setError("");
            }, 3000);
        }
        finally {
            setLoading(false);
        }
    };


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleGoogleLogin = () => {
        window.location.href = import.meta.env.VITE_BASE_URL || "http://localhost:8081"
            + "/oauth2/authorization/google";
    };

    const handleGithubLogin = () => {
        window.location.href = import.meta.env.VITE_BASE_URL || "http://localhost:8081"
            + "/oauth2/authorization/github";
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
            {/* Background Effects */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />

                <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />

                <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
            </div>

            {/* Grid Background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage: `
                        linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                        linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Main Content */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 25, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    className="w-full max-w-md"
                >
                    {/* Logo / Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className="mb-8 flex flex-col items-center text-center"
                    >


                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Welcome Back
                        </h1>
                    </motion.div>

                    {/* Login Card */}
                    <Card className="relative overflow-hidden rounded-3xl border-border/60 bg-card/60 shadow-2xl backdrop-blur-2xl">
                        {/* Top Glow */}
                        <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />



                        <CardContent className="p-6 pt-5 sm:p-8">
                            {/* Login Form */}
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email address
                                    </Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={data.email}
                                        name="email"
                                        onChange={handleInputChange}
                                        autoComplete="email"
                                        className="h-11 rounded-xl border-border/70 bg-background/50 px-4 transition-all focus:border-primary/50 focus:ring-primary/20"
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>

                                        <button
                                            type="button"
                                            className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                                            onClick={() =>
                                                console.log(
                                                    "Forgot password"
                                                )
                                            }
                                        >
                                            Forgot password?
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter your password"
                                            value={data.password}
                                            onChange={handleInputChange}
                                            autoComplete="current-password"
                                            className="h-11 rounded-xl border-border/70 bg-background/50 px-4 pr-11 transition-all focus:border-primary/50 focus:ring-primary/20"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center gap-2">
                                    <Checkbox id="remember" />

                                    <Label
                                        htmlFor="remember"
                                        className="cursor-pointer text-sm font-normal text-muted-foreground"
                                    >
                                        Remember me
                                    </Label>
                                </div>

                                {/* Login Button */}
                                <Button
                                    type="submit"
                                    disabled={isFormInvalid || loading}
                                    className="group h-11 w-full rounded-xl text-sm font-semibold shadow-lg shadow-primary/10 transition-all hover:shadow-primary/20"
                                >
                                    {
                                        loading ? <>
                                            Signing In <Spinner />
                                        </>
                                            :
                                            <>
                                                Sign In
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </>
                                    }
                                </Button>
                                {
                                    error &&

                                    <Alert variant="destructive" className="max-w-md flex justify-center">
                                        <AlertCircleIcon />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                }
                            </form>

                            {/* Divider */}
                            <div className="my-7 flex items-center gap-4">
                                <Separator className="flex-1" />

                                <span className="text-xs text-muted-foreground">
                                    OR CONTINUE WITH
                                </span>

                                <Separator className="flex-1" />
                            </div>

                            {/* Social Login */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Google */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoogleLogin}
                                    className="h-11 rounded-xl border-border/70 bg-background/40 transition-all hover:bg-background/80"
                                >
                                    <GoogleIcon />

                                    <span className="ml-2">
                                        Google
                                    </span>
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGithubLogin}
                                    className="h-11 rounded-xl border-border/70 bg-background/40 transition-all hover:bg-background/80"
                                >
                                    <GithubIcon />

                                    <span className="ml-2">
                                        GitHub
                                    </span>
                                </Button>
                            </div>

                            {/* Sign Up */}
                            <p className="mt-7 text-center text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    className="font-semibold text-primary hover:underline"
                                    onClick={() =>
                                        console.log("Create account")
                                    }
                                >
                                    Create account
                                </button>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Security Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-primary" />

                        <span>
                            Your connection is secured with
                            industry-standard encryption
                        </span>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

/* Google Icon */
function GoogleIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M21.805 12.23c0-.79-.07-1.55-.225-2.28H12v4.31h5.495a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.05-4.4 3.05-7.67Z"
                fill="#4285F4"
            />

            <path
                d="M12 22c2.755 0 5.065-.91 6.755-2.47l-3.3-2.56c-.91.61-2.07.98-3.455.98-2.66 0-4.92-1.8-5.73-4.22H2.86v2.64A10.2 10.2 0 0 0 12 22Z"
                fill="#34A853"
            />

            <path
                d="M6.27 13.73A6.13 6.13 0 0 1 5.95 12c0-.6.11-1.18.32-1.73V7.63H2.86A10 10 0 0 0 2 12c0 1.61.39 3.13 1.07 4.37l3.2-2.64Z"
                fill="#FBBC05"
            />

            <path
                d="M12 6.05c1.5 0 2.84.52 3.9 1.54l2.93-2.93C17.06 3.04 14.75 2 12 2a10.2 10.2 0 0 0-9.14 5.63l3.41 2.64C7.08 7.85 9.34 6.05 12 6.05Z"
                fill="#EA4335"
            />
        </svg>
    );
}
function GithubIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.02c-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18A10.9 10.9 0 0 1 12 5.9c.97 0 1.94.13 2.85.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.35.78 1.04.78 2.1v3.11c0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
        </svg>
    );
}