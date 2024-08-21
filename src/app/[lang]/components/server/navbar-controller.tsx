// navbar-controller.tsx
'use server';
import type { IFeature } from '@types';
import { getUser } from '@gateway';
import { VNavBar } from '@components/client';

interface INavBarData {
  user: any;
}

async function getEnabledFeatures(): Promise<INavBarData> {
  const user = await getUser();
  const logged = !user;

  return user;
}

export const CNavBar = async () => {
  const props: INavBarData = await getEnabledFeatures();
  // const features: IAuthProviders[] = props?.features || [];
  return <VNavBar />;
};
