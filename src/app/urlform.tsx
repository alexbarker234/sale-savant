"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import styles from "./urlForm.module.scss";

const UrlForm = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [search, setSearch] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setButtonDisabled(true);

    const response = await fetch(`/api/get-user-id?url=${search}`);
    if (response.status === 404) {
      setMessage("Could not find steam user");
      setButtonDisabled(false);
      return;
    }
    const result: { id: string } = await response.json();
    router.push(`/user/${result.id}`);
  };
  return (
    <form onSubmit={handleSubmit} method="post" className={styles["form"]}>
      <label htmlFor="url">Enter your Steam profile URL</label>
      <input
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        id="url"
        name="url"
        required
        placeholder="Your profile url"
      />
      <p id="error" className={styles["error"]}>
        {message}
      </p>

      <button id="button" type="submit" disabled={buttonDisabled}>
        Submit
      </button>
    </form>
  );
};

export default UrlForm;
