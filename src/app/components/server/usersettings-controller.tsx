// usersettings-controller.tsx
'use server';
import type { IFeature, UserSchema } from '@types';
import { getUser } from '@gateway';
import { VUserSettings } from '@components/client';

interface INavBarData {
  user: UserSchema;
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
