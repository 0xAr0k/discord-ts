import axios from "axios";

export type OAuthResponse = {
  access_token: string;
  token_type: string;
  scope: string;
};

// change this class object into function object

export function OAuth2Handler() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;
  const discordToken = process.env.DISCORDTOKEN;

  async function generateOAuthURL(): Promise<string> {
    const scopes = ["identify"];
    const state = Math.random().toString(36).substring(2, 15);

    const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes.join("%20")}&state=${state}`;
    return url;
  }

  async function exchangeCodeForToken(code: string): Promise<OAuthResponse> {
    const data = {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        scope: "identify",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const response = await axios.post<OAuthResponse>(
      "https://discord.com/api/oauth2/token",
      data,
    );
    return response.data;
  }

  return {
    generateOAuthURL,
    exchangeCodeForToken,
  };
}
