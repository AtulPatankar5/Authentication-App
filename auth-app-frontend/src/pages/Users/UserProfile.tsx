import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Edit3,
    Save,
    X,
    User as UserIcon,
    Mail,
    ShieldCheck,
    CalendarDays,
    ImageIcon,
    Hash,
    Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useAuth from "@/auth/store";
import { useNavigate } from "react-router";


export default function UserProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        email: "",
        name: "",
        enable: "",
        image: "",
        updatedAt: "",
        createdAt: "",
        provider: "",
    });


    /* -------------------------------- */
    /* Load User Data */
    /* -------------------------------- */

    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id || "",
                email: user.email || "",
                name: user.name || "",
                enable: user.enable || "",
                image: user.image || "",
                updatedAt: user.updatedAt || "",
                createdAt: user.createdAt || "",
                provider: user.provider || "",
            });
        }
    }, [user]);


    /* -------------------------------- */
    /* Handle Input */
    /* -------------------------------- */

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    /* -------------------------------- */
    /* Save */
    /* -------------------------------- */

    const handleSave = () => {

        /*
         * Put your API update call here.
         *
         * Example:
         *
         * await updateUser(formData);
         */

        setIsEditing(false);
    };


    /* -------------------------------- */
    /* Date Format */
    /* -------------------------------- */

    const formatDate = (date?: string) => {
        if (!date) return "—";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };


    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p className="text-sm text-muted-foreground">
                    User not found.
                </p>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* ================================= */}
            {/* Background Effects */}
            {/* ================================= */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />

                <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />

                <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

            </div>


            {/* Grid */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.035]"
                style={{
                    backgroundImage: `
                        linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                        linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                }}
            />


            <div className="relative z-10 min-h-screen">


                {/* ================================= */}
                {/* Header */}
                {/* ================================= */}

                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border/50 bg-background/60 px-4 backdrop-blur-xl sm:px-6 lg:px-8">

                    <div className="flex items-center gap-4">

                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl"
                            onClick={() => navigate("/user/dashboard")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>

                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">
                                User Profile
                            </h2>

                            <p className="hidden text-xs text-muted-foreground sm:block">
                                View and manage your profile
                            </p>
                        </div>

                    </div>


                    {!isEditing ? (

                        <Button
                            className="rounded-xl"
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit
                        </Button>

                    ) : (

                        <div className="flex items-center gap-2">

                            <Button
                                variant="outline"
                                className="rounded-xl"
                                onClick={() => {
                                    setFormData({
                                        id: user.id || "",
                                        email: user.email || "",
                                        name: user.name || "",
                                        enable: user.enable || "",
                                        image: user.image || "",
                                        updatedAt: user.updatedAt || "",
                                        createdAt: user.createdAt || "",
                                        provider: user.provider || "",
                                    });

                                    setIsEditing(false);
                                }}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>

                            <Button
                                className="rounded-xl"
                                onClick={handleSave}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Save
                            </Button>

                        </div>

                    )}

                </header>


                {/* ================================= */}
                {/* Main */}
                {/* ================================= */}

                <main className="p-4 sm:p-6 lg:p-8">

                    <div className="mx-auto max-w-6xl">


                        {/* Page Title */}

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8"
                        >

                            <p className="text-sm text-muted-foreground">
                                Account
                            </p>

                            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                                {isEditing
                                    ? "Edit User"
                                    : "User Details"
                                }
                            </h1>

                            <p className="mt-2 text-sm text-muted-foreground">
                                {isEditing
                                    ? "Update the available information for this user."
                                    : "View the information available for this user."
                                }
                            </p>

                        </motion.div>


                        {/* ================================= */}
                        {/* Profile */}
                        {/* ================================= */}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >

                            <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl">

                                <CardHeader>

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <CardTitle className="text-base">
                                                Profile Information
                                            </CardTitle>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                User account information
                                            </p>

                                        </div>

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                            <UserIcon className="h-5 w-5 text-primary" />
                                        </div>

                                    </div>

                                </CardHeader>


                                <CardContent>

                                    <div className="grid gap-5 md:grid-cols-2">


                                        {/* Name */}

                                        <ProfileField
                                            icon={UserIcon}
                                            label="Name"
                                            value={formData.name}
                                            editing={isEditing}
                                            name="name"
                                            onChange={handleChange}
                                            placeholder="Enter name"
                                        />


                                        {/* Email */}

                                        <ProfileField
                                            icon={Mail}
                                            label="Email"
                                            value={formData.email}
                                            editing={isEditing}
                                            name="email"
                                            onChange={handleChange}
                                            placeholder="Enter email"
                                            type="email"
                                        />


                                        {/* enable */}

                                        <ProfileField
                                            icon={ShieldCheck}
                                            label="enable"
                                            value={formData.enable}
                                            editing={isEditing}
                                            name="enable"
                                            onChange={handleChange}
                                            placeholder="true / false"
                                        />


                                        {/* Provider */}

                                        <ProfileField
                                            icon={Globe}
                                            label="Provider"
                                            value={formData.provider}
                                            editing={isEditing}
                                            name="provider"
                                            onChange={handleChange}
                                            placeholder="Provider"
                                        />


                                        {/* Image */}

                                        <ProfileField
                                            icon={ImageIcon}
                                            label="Image"
                                            value={formData.image}
                                            editing={isEditing}
                                            name="image"
                                            onChange={handleChange}
                                            placeholder="Image URL"
                                        />


                                        {/* ID - View only */}

                                        <ProfileField
                                            icon={Hash}
                                            label="User ID"
                                            value={formData.id}
                                            editing={false}
                                            name="id"
                                            onChange={handleChange}
                                            placeholder=""
                                        />


                                        {/* Created At - View only */}

                                        <ProfileField
                                            icon={CalendarDays}
                                            label="Created At"
                                            value={formatDate(formData.createdAt)}
                                            editing={false}
                                            name="createdAt"
                                            onChange={handleChange}
                                            placeholder=""
                                        />


                                        {/* Updated At - View only */}

                                        <ProfileField
                                            icon={CalendarDays}
                                            label="Updated At"
                                            value={formatDate(formData.updatedAt)}
                                            editing={false}
                                            name="updatedAt"
                                            onChange={handleChange}
                                            placeholder=""
                                        />

                                    </div>

                                </CardContent>

                            </Card>

                        </motion.div>


                        {/* ================================= */}
                        {/* Image Preview */}
                        {/* ================================= */}

                        {formData.image && (

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6"
                            >

                                <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl">

                                    <CardHeader>

                                        <CardTitle className="text-base">
                                            Profile Image
                                        </CardTitle>

                                    </CardHeader>

                                    <CardContent>

                                        <img
                                            src={formData.image}
                                            alt={formData.name || "User"}
                                            className="h-24 w-24 rounded-2xl border border-border/50 object-cover"
                                        />

                                    </CardContent>

                                </Card>

                            </motion.div>

                        )}

                    </div>

                </main>

            </div>

        </div>
    );
}


/* ================================= */
/* Profile Field */
/* ================================= */

interface ProfileFieldProps {
    icon: React.ElementType;
    label: string;
    value: string;
    editing: boolean;
    name: string;
    placeholder: string;
    type?: string;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
}


function ProfileField({
    icon: Icon,
    label,
    value,
    editing,
    name,
    placeholder,
    type = "text",
    onChange,
}: ProfileFieldProps) {

    return (

        <div className="rounded-xl border border-border/50 bg-background/30 p-4 transition-all hover:border-primary/20">

            <div className="mb-3 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                </div>

                <p className="text-sm font-medium">
                    {label}
                </p>

            </div>


            {editing ? (

                <Input
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="rounded-lg bg-background/50"
                />

            ) : (

                <p className="break-all text-sm text-muted-foreground">
                    {value || "—"}
                </p>

            )}

        </div>

    );
}