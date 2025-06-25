"use client";

import { useAuth } from "@/context/firebase-auth-provider";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {};

const UserAvatar = (props: Props) => {
    const { user } = useAuth();
    return (
        <Avatar>
            <AvatarImage src={user?.photoURL || undefined} />
            <AvatarFallback>
                {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;
