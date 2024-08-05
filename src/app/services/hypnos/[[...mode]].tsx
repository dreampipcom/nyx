// page.tsx
import { DPPublicListings } from '@blocks/server';

export default function Home({ mode = 'list' }) {

  return (
    <main>
      <section>
        <DPPublicListings mode={mode} />
      </section>
    </main>
  );
}
