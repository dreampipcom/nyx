// signin/page.tsx TS-Doc?
'use server';
import styles from '@styles/page.module.css';

export default async function SignUp() {
  return (
    <main className={styles.main}>
      <article>
        <img className={styles.logo} src="/logo.svg" />
        <p>There was an error logging you in.</p>
        <p>Please be patient, this is still an Alpha release and not official.</p>
      </article>
    </main>
  );
}
