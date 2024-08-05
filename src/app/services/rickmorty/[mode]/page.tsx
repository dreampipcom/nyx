// page.tsx
import { DPRMList } from '@blocks/server';

export default function Home({ params }) {
  const mode  = params.mode || "list"
  return (
    <main>
      <section>
        <DPRMList />
      </section>
    </main>
  );
}
