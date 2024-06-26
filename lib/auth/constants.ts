// constants.ts TS-Doc?
import type { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';
import InstagramProvider from 'next-auth/providers/instagram';

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER as string,
      from: process.env.EMAIL_FROM as string,
      // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      async profile(profile: any) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.username + '@insta.local',
          image: null,
        };
      },
    }),
    // ...add more providers here
  ],
  session: {
    strategy: 'jwt',
  },
  events: {},
  callbacks: {
    async signIn() {
      // extra sign-in checks
      return true;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? Promise.resolve(url) : Promise.resolve(baseUrl);
    },
    async jwt({ user, token }) {
      if (user) {
        // Note that this if condition is needed
        token.user = { ...user };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        // Note that this if condition is needed
        session.user = token.user;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    signOut: '/',
    error: '/error', // Error code passed in query string as ?error=
    verifyRequest: '/verify', // (used for check email message)
    // newUser: '/' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};
