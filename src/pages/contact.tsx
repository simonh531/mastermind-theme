import React from 'react';
import { Typography, styled, IconButton } from '@mui/material';
import '../stylesheet.css';
import HomeLayout from '../components/homeLayout';

const MailTo = styled('a')(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export default function ({ location } : { location: { pathname: string } }) {
  return (
    <HomeLayout location={location}>
      <Typography variant="h3">
        Contact
      </Typography>
      <Typography sx={{ marginTop: 2, marginBottom: 2, fontSize: '1.2em' }}>
        If you&apos;re interested in having a themed mastermind
        puzzle for your own uses, you can contact
        {' '}
        <IconButton
          size="small"
          color="primary"
          onClick={() => {
            navigator.clipboard.writeText('me@simonh.io');
          }}
        >
          <span className="material-icons-sharp">copy</span>
        </IconButton>
        <MailTo href="mailto:me@simonh.io">me@simonh.io</MailTo>
        !
      </Typography>
      <Typography sx={{ fontSize: '0.8em' }}>
        I do not own Marvel Comics or any of their related characters. Marvel Entertainment
        is owned by The Walt Disney Company. The Marvel theme is fan work and is intended
        for entertainment only.
      </Typography>
    </HomeLayout>
  );
}
