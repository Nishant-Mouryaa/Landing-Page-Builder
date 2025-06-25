"user client";

import React from "react";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "./ui/menubar";
import UserAvatar from "./user-avatar";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/firebase-auth-provider";

type Props = {};

const UserMenu = ({}: Props) => {
    const { setTheme, theme } = useTheme();
    const { user, signOutUser } = useAuth();
    
    const handleSignOut = async () => {
        try {
            await signOutUser();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <Menubar className="border-0 p-0">
            <MenubarMenu>
                <MenubarTrigger>
                    <UserAvatar />
                </MenubarTrigger>
                <MenubarContent side="bottom" align="end">
                    {user && (
                        <>
                            <MenubarItem disabled className="flex flex-col items-start pb-4 pr-4">
                                <div className="">{user.displayName || 'User'}</div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-500">
                                    {user.email}
                                </div>
                            </MenubarItem>
                            <MenubarSeparator />
                        </>
                    )}
                    <MenubarItem>
                        <Link href="/">Home</Link>
                    </MenubarItem>
                    <MenubarItem>
                        <Link href="/dashboard">Dashboard</Link>
                    </MenubarItem>
                    <MenubarItem>
                        <Link href="/explore">Explore</Link>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                        <MenubarSubTrigger>Theme</MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarRadioGroup value={theme}>
                                <MenubarRadioItem value="light" onClick={() => setTheme("light")}>
                                    Light
                                </MenubarRadioItem>
                                <MenubarRadioItem value="dark" onClick={() => setTheme("dark")}>
                                    Dark
                                </MenubarRadioItem>
                                <MenubarRadioItem value="system" onClick={() => setTheme("system")}>
                                    System
                                </MenubarRadioItem>
                            </MenubarRadioGroup>
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    {user && (
                        <MenubarItem onClick={handleSignOut}>
                            Sign Out
                            <MenubarShortcut>
                                <LogOut size={16} />
                            </MenubarShortcut>
                        </MenubarItem>
                    )}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

export default UserMenu;
