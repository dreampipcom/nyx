// @elements/link-decorator
'use client';
import { Link as DPLink } from "@dreampipcom/oneiros"

export const DPLinkDec = (props: any) => {
    return (
      <DPLink host={process?.env?.NEXT_PUBLIC_MAIN_URL?.replace('https://', '').replace('http://', '')} {...props} />
    );
};
