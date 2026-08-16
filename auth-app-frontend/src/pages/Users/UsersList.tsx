import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Mail,
    ShieldCheck,
    CalendarDays,
    Eye,
    Edit3,
    Plus,
    RefreshCw,
    UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";



import { useNavigate } from "react-router";
import type User from "@/types/User";
import { getAllUsers } from "@/services/AuthService";


export default function UsersList() {

    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");


    /* ================================= */
    /* Get All Users */
    /* ================================= */

    const fetchUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getAllUsers();

            setUsers(data);

        } catch (error) {

            console.error(error);

            setError("Unable to load users.");

        } finally {

            setLoading(false);

        }
    };


    /* ================================= */
    /* Initial API Call */
    /* ================================= */

    useEffect(() => {
        fetchUsers();
    }, []);


    /* ================================= */
    /* Search */
    /* ================================= */

    const filteredUsers = users.filter((user) => {

        const searchValue = search.toLowerCase();

        return (
            user.name?.toLowerCase().includes(searchValue) ||
            user.email?.toLowerCase().includes(searchValue) ||
            user.provider?.toLowerCase().includes(searchValue)
        );

    });


    /* ================================= */
    /* Date Format */
    /* ================================= */

    const formatDate = (date?: string) => {

        if (!date) return "—";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "—";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    };


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


            {/* Grid Background */}

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


            <main className="relative z-10 p-4 sm:p-6 lg:p-8">

                <div className="mx-auto max-w-7xl">


                    {/* ================================= */}
                    {/* Header */}
                    {/* ================================= */}

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Management
                                </p>

                                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                                    Users
                                </h1>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Manage all registered users in your system.
                                </p>

                            </div>


                            <Button className="rounded-xl">

                                <Plus className="mr-2 h-4 w-4" />

                                Add User

                            </Button>

                        </div>

                    </motion.div>


                    {/* ================================= */}
                    {/* Users Card */}
                    {/* ================================= */}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.1,
                            duration: 0.5,
                        }}
                    >

                        <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl">


                            {/* Card Header */}

                            <CardHeader>

                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                                    <div>

                                        <CardTitle className="text-base">
                                            All Users
                                        </CardTitle>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {users.length} registered users
                                        </p>

                                    </div>


                                    <div className="flex gap-2">


                                        {/* Search */}

                                        <div className="relative flex-1 lg:w-[300px]">

                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                            <Input
                                                placeholder="Search users..."
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                                className="rounded-xl pl-9"
                                            />

                                        </div>


                                        {/* Refresh */}

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="rounded-xl"
                                            onClick={fetchUsers}
                                            disabled={loading}
                                        >
                                            <RefreshCw
                                                className={`h-4 w-4 ${loading
                                                    ? "animate-spin"
                                                    : ""
                                                    }`}
                                            />
                                        </Button>

                                    </div>

                                </div>

                            </CardHeader>


                            <CardContent>


                                {/* ================================= */}
                                {/* Loading */}
                                {/* ================================= */}

                                {loading && (

                                    <div className="flex min-h-[300px] items-center justify-center">

                                        <div className="flex items-center gap-3 text-sm text-muted-foreground">

                                            <RefreshCw className="h-4 w-4 animate-spin" />

                                            Loading users...

                                        </div>

                                    </div>

                                )}


                                {/* ================================= */}
                                {/* Error */}
                                {/* ================================= */}

                                {!loading && error && (

                                    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">

                                            <ShieldCheck className="h-5 w-5 text-red-500" />

                                        </div>

                                        <p className="mt-4 text-sm font-medium">
                                            {error}
                                        </p>

                                        <Button
                                            variant="outline"
                                            className="mt-4 rounded-xl"
                                            onClick={fetchUsers}
                                        >
                                            Try Again
                                        </Button>

                                    </div>

                                )}


                                {/* ================================= */}
                                {/* Empty */}
                                {/* ================================= */}

                                {!loading &&
                                    !error &&
                                    filteredUsers.length === 0 && (

                                        <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">

                                                <UsersRound className="h-5 w-5 text-primary" />

                                            </div>

                                            <p className="mt-4 text-sm font-medium">
                                                No users found
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Try changing your search.
                                            </p>

                                        </div>

                                    )}


                                {/* ================================= */}
                                {/* Desktop Table */}
                                {/* ================================= */}

                                {!loading &&
                                    !error &&
                                    filteredUsers.length > 0 && (

                                        <div className="overflow-x-auto">

                                            <table className="w-full">

                                                <thead>

                                                    <tr className="border-b border-border/50">

                                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                                                            User
                                                        </th>

                                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                                                            Provider
                                                        </th>

                                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                                                            Status
                                                        </th>

                                                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                                                            Created
                                                        </th>

                                                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                                                            Actions
                                                        </th>

                                                    </tr>

                                                </thead>


                                                <tbody>

                                                    {filteredUsers.map(
                                                        (user, index) => (

                                                            <motion.tr
                                                                key={user.id}
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 10,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                }}
                                                                transition={{
                                                                    delay:
                                                                        index *
                                                                        0.03,
                                                                }}
                                                                className="border-b border-border/40 transition-colors hover:bg-background/40"
                                                            >


                                                                {/* User */}

                                                                <td className="px-4 py-4">

                                                                    <div className="flex items-center gap-3">

                                                                        {user.image ? (

                                                                            <img
                                                                                src={
                                                                                    user.image
                                                                                }
                                                                                alt={
                                                                                    user.name ||
                                                                                    "User"
                                                                                }
                                                                                className="h-10 w-10 rounded-full object-cover"
                                                                            />

                                                                        ) : (

                                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">

                                                                                <UsersRound className="h-4 w-4 text-primary" />

                                                                            </div>

                                                                        )}


                                                                        <div className="min-w-0">

                                                                            <p className="truncate text-sm font-medium">

                                                                                {user.name ||
                                                                                    "Unnamed User"}

                                                                            </p>

                                                                            <div className="mt-0.5 flex items-center gap-1">

                                                                                <Mail className="h-3 w-3 text-muted-foreground" />

                                                                                <p className="truncate text-xs text-muted-foreground">

                                                                                    {
                                                                                        user.email
                                                                                    }

                                                                                </p>

                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                </td>


                                                                {/* Provider */}

                                                                <td className="px-4 py-4">

                                                                    <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">

                                                                        {user.provider ||
                                                                            "LOCAL"}

                                                                    </span>

                                                                </td>


                                                                {/* Status */}

                                                                <td className="px-4 py-4">

                                                                    <StatusBadge
                                                                        enabled={
                                                                            user.enable
                                                                        }
                                                                    />

                                                                </td>


                                                                {/* Created */}

                                                                <td className="px-4 py-4">

                                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">

                                                                        <CalendarDays className="h-3.5 w-3.5" />

                                                                        {formatDate(
                                                                            user.createdAt
                                                                        )}

                                                                    </div>

                                                                </td>


                                                                {/* Actions */}

                                                                <td className="px-4 py-4">

                                                                    <div className="flex justify-end gap-2">

                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="rounded-lg"
                                                                            onClick={() =>
                                                                                navigate(
                                                                                    `/user/${user.id}`
                                                                                )
                                                                            }
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>


                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="rounded-lg"
                                                                            onClick={() =>
                                                                                navigate(
                                                                                    `/user/${user.id}/edit`
                                                                                )
                                                                            }
                                                                        >
                                                                            <Edit3 className="h-4 w-4" />
                                                                        </Button>

                                                                    </div>

                                                                </td>

                                                            </motion.tr>

                                                        )
                                                    )}

                                                </tbody>

                                            </table>

                                        </div>

                                    )}

                            </CardContent>

                        </Card>

                    </motion.div>


                </div>

            </main>

        </div>
    );
}


/* ================================= */
/* Status Badge */
/* ================================= */

function StatusBadge({
    enabled,
}: {
    enabled: string;
}) {

    const active =
        enabled === "true" ||
        enabled === "1" ||
        enabled === "enabled";


    return (

        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${active
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-500"
                }`}
        >

            <span
                className={`h-1.5 w-1.5 rounded-full ${active
                    ? "bg-emerald-500"
                    : "bg-red-500"
                    }`}
            />

            {active ? "Active" : "Disabled"}

        </span>

    );
}