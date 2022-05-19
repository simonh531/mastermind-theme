import React from 'react';
import { Typography } from '@mui/material';
import '../stylesheet.css';
import HomeLayout from '../components/homeLayout';
import PlainLink from '../components/plainLink';

export default function ({ location } : { location: { pathname: string } }) {
  return (
    <HomeLayout location={location}>
      <Typography variant="h4">
        404: Page not found
      </Typography>
      <PlainLink to="/" noHover>
        <Typography sx={{ fontSize: '0.8em' }} variant="h5">
          Return to homepage
        </Typography>
      </PlainLink>
    </HomeLayout>
  );
}
