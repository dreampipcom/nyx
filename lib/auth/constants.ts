// constants.ts TS-Doc?
export const providers = [
  { id: 'email', name: 'Email', type: 'oidc' },
  { id: 'github', name: 'GitHub', type: 'oidc' },
  { id: 'google', name: 'Google', type: 'oidc' },
  { id: 'apple', name: 'Apple', type: 'oidc' },
  { id: 'facebook', name: 'Facebook', type: 'oidc' }
];

const methods = {
  signIn: () => {},
  signOut: () => {},
  getCsrf: async () => {
    const response = await fetch('http://localhost:3000/api/auth/csrf');
    const csrf = await response.json();
    console.log({ csrf });
    return csrf.csrfToken;
  },
  getSession: async () => {
    const response = await fetch('http://localhost:3000/api/auth/session');
    const session = await response.json();
    console.log({ session, response });
    return session;
  },
};

export const { signIn, signOut, getCsrf, getSession } = methods;
