"use client";

import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (!error) return null;

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "no_code":
        return "Authentication was cancelled or failed to complete.";
      case "callback_failed":
        return "Authentication failed. Please try again.";
      case "logout_failed":
        return "Logout failed. Please try again.";
      default:
        return "An authentication error occurred. Please try again.";
    }
  };

  return (
    <div className="auth-error">
      <p>{getErrorMessage(error)}</p>
    </div>
  );
}
