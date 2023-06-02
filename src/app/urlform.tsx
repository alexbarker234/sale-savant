"use client"

import React from "react";
import { useRouter } from "next/navigation";
const UrlForm = () => {
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const url = (event.target as HTMLFormElement).first.value;

        const endpoint = `/api/get-user?url=${url}`;

        const response = await fetch(endpoint);
        const result = await response.json();

        router.push(`/user/${result.id}`);
    };
    return (
        <form onSubmit={handleSubmit} method="post">
            <label htmlFor="first">Steam User URL</label>
            <input type="text" id="first" name="first" required />

            <button type="submit">Submit</button>
        </form>
    );
};

export default UrlForm;
