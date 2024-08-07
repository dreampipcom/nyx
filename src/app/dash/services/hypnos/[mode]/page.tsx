// page.tsx
import { DPPublicListings } from '@blocks/server';

export default function Home({ params }: any) {
  const mode = params?.mode || 'list';
  return (
    <main>
      <section>
        <DPPublicListings mode={mode} />
      </section>
    </main>
  );
}
