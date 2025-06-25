"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "@/context/firebase-auth-provider";
import { usePathname } from "next/navigation";
import Logo from "./logo";
import UserMenu from "./user-menu";

type Props = {};

const Navbar = (props: Props) => {
    const { user } = useAuth();
    const pathname = usePathname();
    return (
        <header className="w-full py-4 md:py-6 flex justify-between items-center">
            <Logo />
            <div className="flex space-x-4">
                {user ? (
                    <>
                        {pathname !== "/dashboard" && (
                            <Link href="/dashboard">
                                <Button variant={"primary"}>Dashboard</Button>
                            </Link>
                        )}
                        <UserMenu />
                    </>
                ) : (
                    <>
                        <ModeToggle />
                        <Link href="/login">
                            <Button variant={"primary"}>Login</Button>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Navbar;
