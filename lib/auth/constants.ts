// constants.ts TS-Doc?
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import AppleProvider from 'next-auth/providers/apple';
import FacebookProvider from 'next-auth/providers/facebook';
import EmailProvider from 'next-auth/providers/email';
// import InstagramProvider from 'next-auth/providers/instagram';

const providersMap = [
  EmailProvider({
    server: process.env.EMAIL_SERVER as string,
    from: process.env.EMAIL_FROM as string,
    // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
  }),
  GithubProvider({
    clientId: process.env.GITHUB_ID as string,
    clientSecret: process.env.GITHUB_SECRET as string,
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  }),
  AppleProvider({
    clientId: process.env.APPLE_CLIENT_ID as string,
    clientSecret: process.env.APPLE_CLIENT_SECRET as string,
  }),
  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID as string,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
  }),
];

export const providers = providersMap.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name, type: providerData.type };
  } else {
    return { id: provider.id, name: provider.name, type: provider.type };
  }
});

async function getSession() {
  const response = await fetch('http://localhost:3001/api/auth/session');
  const session = await response.json();
  console.log({ session, response });
  return session;
}

async function getCsrf() {
  const response = await fetch('http://localhost:3001/api/auth/csrf');
  const csrf = await response.json();
  console.log({ csrf });
  return csrf.csrfToken;
}

const methods = {
  signIn: () => {},
  signOut: () => {},
  getCsrf: () => {},
  getSession: () => {},
};

export const { signIn, signOut, getCsrf, getSession } = methods;
