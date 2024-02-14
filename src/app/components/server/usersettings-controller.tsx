// usersettings-controller.tsx
'use server';
import type { IFeature, UserDecoration } from '@types';
import { getUser } from '@gateway';
import { VUserSettings } from '@components/client';

interface INavBarData {
  user: UserDecoration;
}

async function getEnabledFeatures(): Promise<INavBarData> {
  const user = await getUser();
  const logged = !user;

  return user;
}

export const CUserSettings = async () => {
  const props: INavBarData = await getEnabledFeatures();
  // const features: IAuthProviders[] = props?.features || [];
  return <VUserSettings />;
};
