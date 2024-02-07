import Image from 'next/image';
import styles from '@styles/page.module.css';
import { TopNav, List } from '@components';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <TopNav />
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src={
            (process.env.NEXT_PUBLIC_NEXUS_BASE_PATH || '') + (process.env.NEXT_PUBLIC_NEXUS_LOGO_PATH || '/logo.svg')
          }
          alt="Next.js Logo"
          width={284}
          height={284}
          priority
        />
      </div>

      <section className={styles.container}>
        <List />
      </section>
    </main>
  );
}
