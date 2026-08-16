import { useState } from "react";
import { motion } from "framer-motion";
import {
    Activity,
    ArrowUpRight,
    Bell,
    CheckCircle2,
    ChevronDown,
    Clock3,
    KeyRound,
    LayoutDashboard,
    LogOut,
    Menu,
    MoreHorizontal,
    Plus,
    ShieldCheck,
    User,
    Users,
    X,
    Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useAuth from "@/auth/store";
import { useNavigate } from "react-router";

export default function UserDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const { authStatus, user, logout } = useAuth();

    const navigate = useNavigate();

    const stats = [
        {
            title: "Total Users",
            value: "2,847",
            change: "+12.5%",
            description: "from last month",
            icon: Users,
        },
        {
            title: "Active Sessions",
            value: "1,284",
            change: "+8.2%",
            description: "from last month",
            icon: Activity,
        },
        {
            title: "Authentication",
            value: "98.7%",
            change: "+2.4%",
            description: "success rate",
            icon: ShieldCheck,
        },
        {
            title: "API Requests",
            value: "48.2K",
            change: "+18.4%",
            description: "this month",
            icon: KeyRound,
        },
    ];

    const activities = [
        {
            title: "Successful login",
            description: "john.doe@example.com",
            time: "2 min ago",
            status: "success",
        },
        {
            title: "New user registered",
            description: "sarah.wilson@example.com",
            time: "18 min ago",
            status: "success",
        },
        {
            title: "Password changed",
            description: "michael@example.com",
            time: "42 min ago",
            status: "success",
        },
        {
            title: "Failed authentication",
            description: "unknown@example.com",
            time: "1 hr ago",
            status: "warning",
        },
        {
            title: "OAuth login",
            description: "alex@example.com via Google",
            time: "2 hrs ago",
            status: "success",
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Background Effects */}
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

            <div className="relative z-10 flex min-h-screen">

                {/* Mobile Overlay */}
                {!sidebarOpen && (
                    <button
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    />
                )}

                {/* Sidebar */}
                <motion.aside
                    initial={false}
                    animate={{
                        width: sidebarOpen ? 250 : 0,
                    }}
                    className={`fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden border-r border-border/60 bg-card/70 backdrop-blur-2xl lg:relative ${sidebarOpen ? "" : "lg:w-20"
                        }`}
                >
                    <div className="flex h-full w-[250px] flex-col">

                        {/* Logo */}
                        <div className="flex h-20 items-center px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                                    <ShieldCheck className="h-5 w-5 text-primary-foreground" />
                                </div>

                                <div>
                                    <h1 className="text-lg font-bold tracking-tight">
                                        Auth<span className="text-primary">Core</span>
                                    </h1>

                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                                        Security Platform
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-border/50" />

                        {/* Navigation */}
                        <div className="flex-1 px-3 py-6">

                            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                Overview
                            </p>

                            <nav className="space-y-1">

                                <SidebarItem
                                    icon={LayoutDashboard}
                                    label="Dashboard"
                                    active
                                />

                                <SidebarItem
                                    icon={Users}
                                    label="Users"
                                    onClick={() => navigate("/user/all-users")}
                                />

                                <SidebarItem
                                    icon={ShieldCheck}
                                    label="Authentication"
                                />

                                <SidebarItem
                                    icon={KeyRound}
                                    label="API Keys"
                                />

                            </nav>

                            <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                Management
                            </p>

                            <nav className="space-y-1">

                                <SidebarItem
                                    icon={Activity}
                                    label="Activity Logs"
                                />

                                <SidebarItem
                                    icon={Settings}
                                    label="Settings"
                                />

                            </nav>
                        </div>

                        {/* User */}
                        {/* <div className="border-t border-border/50 p-4"> */}
                        <div
                            onClick={() => navigate("/user/profile")}
                            className="flex cursor-pointer items-center gap-3 rounded-xl bg-background/40 p-3 transition-colors hover:bg-background/70"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15">
                                <User className="h-4 w-4 text-primary" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                    {user?.name}
                                </p>

                                <p className="truncate text-xs text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>

                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </div>
                        {/* </div> */}
                    </div>
                </motion.aside>

                {/* Main */}
                <main className="min-w-0 flex-1">

                    {/* Header */}
                    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border/50 bg-background/60 px-4 backdrop-blur-xl sm:px-6 lg:px-8">

                        <div className="flex items-center gap-4">

                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                {sidebarOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </Button>

                            <div>
                                <h2 className="text-xl font-semibold tracking-tight">
                                    Dashboard
                                </h2>

                                <p className="hidden text-xs text-muted-foreground sm:block">
                                    Monitor your authentication platform
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">

                            {/* Notification */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative rounded-xl"
                            >
                                <Bell className="h-4 w-4" />

                                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
                            </Button>

                            {/* User */}
                            <Button
                                variant="ghost"
                                className="hidden gap-2 rounded-xl sm:flex cursor-pointer"
                                onClick={() => navigate("/user/profile")}
                            >
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15">
                                    <User className="h-3.5 w-3.5 text-primary" />
                                </div>

                                <span className="text-sm">{user.name}</span>

                                {/* <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> */}
                            </Button>
                            {authStatus && <Button className="flex cursor-pointer items-center gap-1 hover:text-foreground" onClick={() => {
                                logout()
                                navigate("/");
                            }
                            }>
                                <LogOut className="h-3.5 w-3.5" />
                                Sign out
                            </Button>}
                        </div>
                    </header>

                    {/* Content */}
                    <div className="p-4 sm:p-6 lg:p-8">

                        {/* Welcome */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8"
                        >
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                                <div>
                                    <p className="mb-1 text-sm text-muted-foreground">
                                        Thursday, August 13, 2026
                                    </p>

                                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                        Good afternoon, {user.name}
                                    </h1>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Here's what's happening with your
                                        authentication system today.
                                    </p>
                                </div>

                                <Button className="rounded-xl shadow-lg shadow-primary/10">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add User
                                </Button>

                            </div>
                        </motion.div>

                        {/* Stats */}
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                            {stats.map((stat, index) => {
                                const Icon = stat.icon;

                                return (
                                    <motion.div
                                        key={stat.title}
                                        initial={{
                                            opacity: 0,
                                            y: 20,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            delay: index * 0.08,
                                            duration: 0.5,
                                        }}
                                    >
                                        <Card className="group relative overflow-hidden rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">

                                            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />

                                            <CardContent className="p-5">

                                                <div className="flex items-start justify-between">

                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {stat.title}
                                                        </p>

                                                        <p className="mt-2 text-2xl font-bold tracking-tight">
                                                            {stat.value}
                                                        </p>
                                                    </div>

                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                                        <Icon className="h-5 w-5 text-primary" />
                                                    </div>

                                                </div>

                                                <div className="mt-4 flex items-center gap-2 text-xs">
                                                    <span className="flex items-center font-medium text-emerald-500">
                                                        <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
                                                        {stat.change}
                                                    </span>

                                                    <span className="text-muted-foreground">
                                                        {stat.description}
                                                    </span>
                                                </div>

                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}

                        </div>

                        {/* Main Grid */}
                        <div className="mt-6 grid gap-6 xl:grid-cols-3">

                            {/* Authentication Overview */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="xl:col-span-2"
                            >
                                <Card className="h-full rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl">

                                    <CardHeader className="flex flex-row items-center justify-between">

                                        <div>
                                            <CardTitle className="text-base">
                                                Authentication Overview
                                            </CardTitle>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Authentication activity over the last 7 days
                                            </p>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-lg"
                                        >
                                            Last 7 days
                                            <ChevronDown className="ml-2 h-3.5 w-3.5" />
                                        </Button>

                                    </CardHeader>

                                    <CardContent>

                                        {/* Chart */}
                                        <div className="flex h-[280px] items-end gap-3 pt-8">

                                            {[42, 58, 48, 72, 64, 85, 92].map(
                                                (height, index) => (
                                                    <div
                                                        key={index}
                                                        className="group flex h-full flex-1 flex-col justify-end"
                                                    >
                                                        <div
                                                            className="relative w-full rounded-t-lg bg-primary/20 transition-all duration-300 group-hover:bg-primary/40"
                                                            style={{
                                                                height: `${height}%`,
                                                            }}
                                                        >
                                                            <div
                                                                className="absolute bottom-0 left-0 w-full rounded-t-lg bg-primary/60"
                                                                style={{
                                                                    height: `${height * 0.65}%`,
                                                                }}
                                                            />
                                                        </div>

                                                        <span className="mt-3 text-center text-xs text-muted-foreground">
                                                            {
                                                                [
                                                                    "Thu",
                                                                    "Fri",
                                                                    "Sat",
                                                                    "Sun",
                                                                    "Mon",
                                                                    "Tue",
                                                                    "Wed",
                                                                ][index]
                                                            }
                                                        </span>
                                                    </div>
                                                )
                                            )}

                                        </div>

                                        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border/50 pt-5">

                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Successful
                                                </p>

                                                <p className="mt-1 text-lg font-semibold">
                                                    47,892
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Failed
                                                </p>

                                                <p className="mt-1 text-lg font-semibold">
                                                    628
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Success Rate
                                                </p>

                                                <p className="mt-1 text-lg font-semibold text-emerald-500">
                                                    98.7%
                                                </p>
                                            </div>

                                        </div>

                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* System Status */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45 }}
                            >
                                <Card className="h-full rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl">

                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            System Status
                                        </CardTitle>

                                        <p className="text-xs text-muted-foreground">
                                            All services are operational
                                        </p>
                                    </CardHeader>

                                    <CardContent className="space-y-5">

                                        <StatusItem
                                            name="Authentication API"
                                            status="Operational"
                                        />

                                        <StatusItem
                                            name="OAuth Services"
                                            status="Operational"
                                        />

                                        <StatusItem
                                            name="Database"
                                            status="Operational"
                                        />

                                        <StatusItem
                                            name="JWT Service"
                                            status="Operational"
                                        />

                                        <Separator />

                                        <div className="rounded-xl bg-primary/5 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Everything looks good
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        No incidents detected
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    </CardContent>
                                </Card>
                            </motion.div>

                        </div>

                        {/* Bottom Section */}
                        <div className="mt-6 grid gap-6 lg:grid-cols-3">

                            {/* Recent Activity */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="lg:col-span-2"
                            >
                                <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl">

                                    <CardHeader className="flex flex-row items-center justify-between">

                                        <div>
                                            <CardTitle className="text-base">
                                                Recent Activity
                                            </CardTitle>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Latest authentication events
                                            </p>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs text-primary"
                                        >
                                            View all
                                            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                                        </Button>

                                    </CardHeader>

                                    <CardContent className="space-y-1">

                                        {activities.map((activity, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-background/50"
                                            >

                                                <div
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activity.status === "success"
                                                        ? "bg-emerald-500/10"
                                                        : "bg-yellow-500/10"
                                                        }`}
                                                >
                                                    {activity.status === "success" ? (
                                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                    ) : (
                                                        <ShieldCheck className="h-4 w-4 text-yellow-500" />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium">
                                                        {activity.title}
                                                    </p>

                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {activity.description}
                                                    </p>
                                                </div>

                                                <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                                                    <Clock3 className="h-3 w-3" />
                                                    {activity.time}
                                                </div>

                                                <button className="text-muted-foreground hover:text-foreground">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>

                                            </div>
                                        ))}

                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Quick Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl">

                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Quick Actions
                                        </CardTitle>

                                        <p className="text-xs text-muted-foreground">
                                            Manage your authentication system
                                        </p>
                                    </CardHeader>

                                    <CardContent className="space-y-3">

                                        <QuickAction
                                            icon={User}
                                            title="Add New User"
                                            description="Create an account"
                                        />

                                        <QuickAction
                                            icon={KeyRound}
                                            title="Create API Key"
                                            description="Generate access credentials"
                                        />

                                        <QuickAction
                                            icon={ShieldCheck}
                                            title="Security Settings"
                                            description="Manage authentication"
                                        />

                                        <QuickAction
                                            icon={Activity}
                                            title="View Activity"
                                            description="Inspect system logs"
                                        />

                                    </CardContent>
                                </Card>
                            </motion.div>

                        </div>

                        {/* Footer */}
                        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row">

                            <p>
                                © 2026 AuthCore. All rights reserved.
                            </p>

                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    All systems operational
                                </span>


                            </div>

                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}


/* -------------------------------- */
/* Sidebar Item */
/* -------------------------------- */

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

function SidebarItem({
    icon: Icon,
    label,
    active = false,
    onClick,
}: SidebarItemProps) {
    return (
        <button
            onClick={onClick}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${active
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                }`}
        >
            <Icon
                className={`h-4 w-4 ${active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                    }`}
            />
            <span>{label}</span>
            {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
            )}
        </button>
    );
}



/* -------------------------------- */
/* System Status */
/* -------------------------------- */

interface StatusItemProps {
    name: string;
    status: string;
}

function StatusItem({ name, status }: StatusItemProps) {
    return (
        <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />

                <span className="text-sm">
                    {name}
                </span>
            </div>

            <span className="text-xs font-medium text-emerald-500">
                {status}
            </span>

        </div>
    );
}


/* -------------------------------- */
/* Quick Action */
/* -------------------------------- */

interface QuickActionProps {
    icon: React.ElementType;
    title: string;
    description: string;
}

function QuickAction({
    icon: Icon,
    title,
    description,
}: QuickActionProps) {
    return (
        <button className="group flex w-full items-center gap-3 rounded-xl border border-border/50 bg-background/30 p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                <Icon className="h-4 w-4 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                    {title}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                    {description}
                </p>
            </div>

            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />

        </button>
    );
}