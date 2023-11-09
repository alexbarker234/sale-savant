"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./urlForm.module.scss";

const UrlForm = () => {
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const url = (document.getElementById("url") as HTMLInputElement).value;

        const submitButton = document.getElementById('button') as HTMLButtonElement;
        submitButton.disabled = true;

        const endpoint = `/api/get-user-id?url=${url}`;

        const startTime = performance.now()
        
        const response = await fetch(endpoint);
        const result = await response.json();

        const endTime = performance.now();
        if(process.env.NODE_ENV == "development"){
            console.log(result)
            console.log(`Found user ${result.id} in ${endTime - startTime} ms`);
        }
        if (result.exists) {
            router.push(`/user/${result.id}`);
        } else {
            const error = document.getElementById("error");
            if (error) {
                error.innerHTML = "Could not find steam user";
            }
            submitButton.disabled = false;
        }
    };
    return (
        <form onSubmit={handleSubmit} method="post" className={styles["form"]} >
            <label htmlFor="url">Enter your Steam username or profile URL</label>
            <input type="text" id="url" name="url" required placeholder="Your profile url or username" />
            <p id="error" className={styles["error"]}></p>

            <button id="button" type="submit">Submit</button>
        </form>
    );
};

export default UrlForm;
