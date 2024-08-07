// constants.ts TS-Doc?
export const providers = [
  { id: 'email', name: 'Email', type: 'email' },
  { id: 'github', name: 'GitHub', type: 'oauth' },
  { id: 'google', name: 'Google', type: 'oidc' },
  { id: 'apple', name: 'Apple', type: 'oidc' },
  { id: 'facebook', name: 'Facebook', type: 'oauth' },
];

const methods = {
  signIn: () => {},
  signOut: async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_URL}/api/v1/auth/signout`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csrfToken: await methods.getCsrf() }),
      });
      return response;
    } catch (e) {
      console.error(e);
    }
  },
  getCsrf: async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_URL}/api/v1/auth/csrf`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        credentials: 'include',
      });
      const csrf = await response.json();
      return csrf.csrfToken;
    } catch (e) {
      console.error(e);
    }
  },
  getSession: async (params = { cookies: '' }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_URL}/api/v1/auth/session`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Cookie: params?.cookies,
        },
        credentials: 'include',
        cache: 'no-store',
      });
      const session = await response?.json();
      return session;
    } catch (e) {
      console.error(e);
    }
  },
};

export const { signIn, signOut, getCsrf, getSession } = methods;
