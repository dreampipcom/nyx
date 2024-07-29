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
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEXUS_HOST}/api/auth/signout`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEXUS_HOST}/api/auth/csrf`,{credentials: 'include'});
      const csrf = await response.json();
      return csrf.csrfToken;
    } catch (e) {
      console.error(e);
    }
  },
  getSession: async (params = {}) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/session`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Cookie': params?.cookie
        },
      });
      const session = await response?.json();
      return session;
    } catch (e) {
      console.error(e);
    }
  },
};

export const { signIn, signOut, getCsrf, getSession } = methods;
