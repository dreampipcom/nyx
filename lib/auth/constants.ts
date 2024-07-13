// constants.ts TS-Doc?
import { navigate } from '@gateway';

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
    const response = await fetch('http://localhost:3000/api/auth/signout', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ csrfToken: await methods.getCsrf() }),
    });
    // const session = await response.json();
    console.log('signout', { response: JSON.stringify(response) });
    await navigate('/');
    return { ok: true, status: 200 };
  },
  getCsrf: async () => {
    const response = await fetch('http://localhost:3000/api/auth/csrf');
    const csrf = await response.json();
    // console.log({ csrf });
    return csrf.csrfToken;
  },
  getSession: async () => {
    const response = await fetch('http://localhost:3000/api/auth/session');
    const session = await response.json();
    // console.log("requesting", { response: JSON.stringify(response) });
    return session;
  },
};

export const { signIn, signOut, getCsrf, getSession } = methods;
