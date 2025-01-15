// signin/page.tsx TS-Doc?
'use server';
import { providers, getCsrf } from '@auth';
import { VSignUp } from '@components/client';

export default async function SignUp() {
  const csrf = await getCsrf();

  return (
    <main>
      <article>
        <VSignUp providers={providers} csrf={csrf} />
      </article>
    </main>
  );
}
