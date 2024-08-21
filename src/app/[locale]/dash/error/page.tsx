// error/page.tsx TS-Doc?
'use client';
import { Logo, Typography, Grid } from '@dreampipcom/oneiros';

export default function SignUp() {
  return (
    <Grid full>
      <div className="w-full flex flex-col justify-center items-center">
        <Logo />
        <Typography>There was an error logging you in.</Typography>
        <Typography>Please be patient, this is still an Alpha release and not official.</Typography>
      </div>
    </Grid>
  );
}
