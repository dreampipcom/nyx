// signin/page.tsx TS-Doc?
'use client';
import { Logo, Typography, Grid } from '@dreampipcom/oneiros';

export default function SignUp() {
  return (
    <Grid full>
      <div className="w-full flex flex-col justify-center items-center">
        <Logo />
        <Typography>Please check your email.</Typography>
        <Typography>There should be a login link there.</Typography>
      </div>
    </Grid>
  );
}
