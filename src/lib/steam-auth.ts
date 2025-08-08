import { SteamUser } from "./session";

// Steam OpenID configuration
const STEAM_OPENID_URL = "https://steamcommunity.com/openid/login";

export function getSteamAuthUrl(): string {
  const returnUrl = `${process.env.BASE_URL || "http://localhost:3000"}/api/auth/callback`;
  const realm = process.env.BASE_URL || "http://localhost:3000";

  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnUrl,
    "openid.realm": realm,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select"
  });

  return `${STEAM_OPENID_URL}?${params.toString()}`;
}

export async function getSteamUserInfo(steamId: string): Promise<SteamUser> {
  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_KEY}&steamids=${steamId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Steam user info");
  }

  const data = await response.json();
  const player = data.response.players[0];

  return {
    steamId: player.steamid,
    displayName: player.personaname,
    avatarUrl: player.avatarfull
  };
}

export function extractSteamIdFromOpenId(openIdUrl: string): string {
  // Steam OpenID returns URLs like: https://steamcommunity.com/openid/id/76561198012345678
  const match = openIdUrl.match(/\/openid\/id\/(\d+)/);
  if (!match) {
    throw new Error("Invalid Steam OpenID URL");
  }
  return match[1];
}

export async function validateSteamOpenIdResponse(searchParams: URLSearchParams): Promise<string> {
  // Steam OpenID validation
  const openIdMode = searchParams.get("openid.mode");
  const openIdIdentity = searchParams.get("openid.identity");
  const openIdClaimedId = searchParams.get("openid.claimed_id");

  if (openIdMode !== "id_res" || !openIdIdentity || !openIdClaimedId) {
    throw new Error("Invalid Steam OpenID response");
  }

  // Extract Steam ID from the claimed_id
  const steamId = extractSteamIdFromOpenId(openIdClaimedId);

  // Validate the response with Steam
  const validationParams = new URLSearchParams({
    "openid.assoc_handle": searchParams.get("openid.assoc_handle") || "",
    "openid.signed": searchParams.get("openid.signed") || "",
    "openid.sig": searchParams.get("openid.sig") || "",
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "check_authentication"
  });

  // Add all signed parameters
  const signedParams = searchParams.get("openid.signed")?.split(",") || [];
  for (const param of signedParams) {
    const value = searchParams.get(`openid.${param}`);
    if (value) {
      validationParams.append(`openid.${param}`, value);
    }
  }

  const validationResponse = await fetch(STEAM_OPENID_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: validationParams.toString()
  });

  const validationText = await validationResponse.text();

  if (!validationText.includes("is_valid:true")) {
    throw new Error("Steam OpenID validation failed");
  }

  return steamId;
}
