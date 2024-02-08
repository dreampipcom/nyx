// signin/page.tsx TS-Doc?
'use server';
import styles from '@styles/page.module.css';

export default async function SignUp() {
  return (
    <main className={styles.main}>
      <article>
        <img className={styles.logo} src="/logo.svg" />
        <p>Please check your email.</p>
        <p>There should be a login link there.</p>
      </article>
    </main>
  );
}
