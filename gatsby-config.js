module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.yourdomain.tld',
    title: 'Avengers Mastermind',
  },
  plugins: [
    'gatsby-plugin-image',
    {
      resolve: 'gatsby-source-contentful',
      options: {
        accessToken: 'e4pBa8sA871csJ0a9ldPuYBdHO9yPU1wGhciJrW14Zc',
        spaceId: 'rsayeahprxr9',
      },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /images/, // See below to configure properly
        },
      },
    },
    'gatsby-plugin-styled-components',
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Avengers',
        short_name: 'Avengers',
        icon: 'src/images/icon.png',
        start_url: '/',
        background_color: '#03141E',
        theme_color: '#03141E',
        display: 'standalone',
      },
    },
    'gatsby-plugin-offline',
  ],
};
