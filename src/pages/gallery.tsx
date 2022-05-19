import React from 'react';
import {
  Grid, Card, CardHeader, CardMedia, CardActionArea,
} from '@mui/material';
import '../stylesheet.css';
import { graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import HomeLayout from '../components/homeLayout';
import PlainLink from '../components/plainLink';

export default function ({ location }: { location: { pathname: string } }) {
  return (
    <HomeLayout location={location}>
      <Grid container>
        <Grid item md={4} sm={6} xs={12}>
          <PlainLink to="/marvel" noHover>
            <Card>
              <CardActionArea>
                <CardMedia>
                  <StaticImage src="../screenshots/marvel.png" alt="marvel screen" />
                </CardMedia>
                <CardHeader title="Marvel" sx={{ textDecoration: 'none' }} />
              </CardActionArea>
            </Card>
          </PlainLink>
        </Grid>
      </Grid>
    </HomeLayout>
  );
}

export const query = graphql`
query Screenshots {
  allFile(filter: {dir: {regex: "/screenshots/"}}) {
    edges {
      node {
        name
        dir
      }
    }
  }
}`;
