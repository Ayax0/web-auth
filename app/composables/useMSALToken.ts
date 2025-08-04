import { PublicClientApplication } from "@azure/msal-browser";

const scopes = ["user.read"];

export default async function () {
  const config = useRuntimeConfig();

  const msal = new PublicClientApplication({
    auth: {
      clientId: config.public.msalClientId,
      authority: config.public.msalAuthority,
      redirectUri: config.public.msalRedirectUri,
    },
    cache: {
      storeAuthStateInCookie: true,
    },
  });

  await msal.initialize();

  const accounts = msal.getAllAccounts();
  const redirectUri = config.public.msalRedirectUri;

  if (accounts[0] && accounts.length > 1) msal.setActiveAccount(accounts[0]);

  if (accounts.length > 0) {
    try {
      return await msal.acquireTokenSilent({ scopes, redirectUri });
    } catch (error) {
      return await msal.acquireTokenPopup({ scopes, redirectUri });
    }
  } else {
    try {
      return await msal.ssoSilent({ scopes, redirectUri });
    } catch (error) {
      return await msal.acquireTokenPopup({ scopes, redirectUri });
    }
  }
}
