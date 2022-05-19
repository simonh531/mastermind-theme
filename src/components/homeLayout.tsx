import React, { ReactNode } from 'react';
import {
  Box, Container, CssBaseline, Typography, Tabs, Tab, Grid, styled, IconButton,
} from '@mui/material';
import {
  red, green, blue, yellow,
} from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'gatsby';
import PlainLink from './plainLink';

const MailTo = styled('a')(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto Slab', serif",
  },
  palette: {
    background: {
      paper: '#404040',
    },
    text: {
      primary: 'rgba(255,255,255,0.87)',
      secondary: 'rgba(255,255,255,0.6)',
    },
    primary: red,
  },
});

export default function HomeLayout(
  { location, children }:{location: { pathname: string }, children: ReactNode},
) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        backgroundColor: '#333',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
      >
        <Container sx={{ paddingBottom: 2, flex: '1' }}>
          <Typography
            variant="h1"
            sx={{
              color: 'white',
              fontSize: {
                xs: '2em',
                sm: '3em',
                md: '4em',
                lg: '5em',
                xl: '6em',
              },
            }}
          >
            Mastermind
            <Typography component="span" sx={{ fontSize: '1em', color: red.A200 }}>t</Typography>
            <Typography component="span" sx={{ fontSize: '1em', color: green.A200 }}>h</Typography>
            <Typography component="span" sx={{ fontSize: '1em', color: yellow.A200 }}>e</Typography>
            <Typography component="span" sx={{ fontSize: '1em' }}>.</Typography>
            <Typography component="span" sx={{ fontSize: '1em', color: blue.A200 }}>m</Typography>
            <Typography component="span" sx={{ fontSize: '1em', color: yellow.A200 }}>e</Typography>
          </Typography>
          <Tabs value={location.pathname} sx={{ marginBottom: 2 }}>
            <Tab component={Link} label="Home" to="/" value="/" />
            <Tab component={Link} label="Gallery" to="/gallery" value="/gallery" />
            <Tab component={Link} label="Contact" to="/contact" value="/contact" />
          </Tabs>
          {children}
        </Container>
        <Box sx={{ backgroundColor: '#222', paddingTop: 4, paddingBottom: 4 }}>
          <Container>
            <Grid container>
              <Grid item xs={4}>
                <PlainLink to="/">
                  <Typography variant="h4">
                    Home
                  </Typography>
                </PlainLink>
              </Grid>
              <Grid item xs={4}>
                <PlainLink to="/gallery">
                  <Typography variant="h4">
                    Gallery
                  </Typography>
                </PlainLink>
                <PlainLink to="/marvel">
                  <Typography variant="h6">
                    Marvel
                  </Typography>
                </PlainLink>
              </Grid>
              <Grid item xs={4}>
                <PlainLink to="/contact">
                  <Typography variant="h4">
                    Contact
                  </Typography>
                </PlainLink>
                <Typography variant="h6">
                  <MailTo href="mailto:me@simonh.io">me@simonh.io</MailTo>
                  <IconButton
                    size="small"
                    sx={{ color: 'text.primary' }}
                    onClick={() => {
                      navigator.clipboard.writeText('me@simonh.io');
                    }}
                  >
                    <span className="material-icons-sharp">copy</span>
                  </IconButton>
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
