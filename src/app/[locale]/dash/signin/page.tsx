// signin/page.tsx TS-Doc?
'use server';
import { providers, getCsrf } from '@auth';
import { VSignUp } from '@components/client';
import styles from '@styles/page.module.css';

export default async function SignUp() {
  const csrf = await getCsrf();

  return (
    <main className={styles.main}>
      <article>
        <VSignUp providers={providers} csrf={csrf} />
      </article>
    </main>
  );
}
