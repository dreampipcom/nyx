// page.tsx
import { DPRMList } from '@blocks/server';

export default function Home({ params }: any) {
  const mode = params?.mode || 'list';
  return (
    <main>
      <section>
        <DPRMList mode={mode} />
      </section>
    </main>
  );
}
