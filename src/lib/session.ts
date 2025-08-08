import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SteamUser {
  steamId: string;
  displayName: string;
  avatarUrl?: string;
}

export interface SessionData {
  user?: SteamUser;
  isLoggedIn: boolean;
}

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: "steam-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production"
  }
};

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }

  return session;
}
