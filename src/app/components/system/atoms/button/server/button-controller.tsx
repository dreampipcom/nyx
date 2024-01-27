// @atoms/button-controller.ts
"use server"
//import "server-only"

// import type { UserSchema } from "@types"
//import { NVButton } from "./button-view";

interface NCButtonProps {
}

export const NCButton = async ({}: NCButtonProps) => {
	console.log("--- button controller")
  // const props: ISignInData = await getProvidersData();
  // const providers: IAuthProviders[] = props?.providers || [];
  return <div>LOREM SERVER</div>;
  //return <NVButton />;
};
