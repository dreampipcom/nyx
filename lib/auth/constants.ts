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
    console.log('start signout');
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEXUS_HOST}/api/auth/signout`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ csrfToken: await methods.getCsrf() }),
    });
    return response;
  },
  getCsrf: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEXUS_HOST}/api/auth/csrf`);
    const csrf = await response.json();
    return csrf.csrfToken;
  },
  getSession: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEXUS_HOST}/api/auth/session`);
    const session = await response.json();
    return session;
  },
};

export const { signIn, signOut, getCsrf, getSession } = methods;
