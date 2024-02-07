// signin.tsx
'use server';
import { CSignIn, CUserSettings } from '@components/server';

export const ToolBar = () => {
  return <div>
    <CUserSettings />
    <CSignIn />
  </div>;
};
