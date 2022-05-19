// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { keyframes } from '@emotion/react';
import { Box, Typography, styled } from '@mui/material';
import Layer from './layer';

const BannerLayer = styled(Layer)({
  backgroundColor: 'rgba(0,0,0,0.4)',
});

const appear = keyframes`
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
`;

const LockScreen = function ({ unlock }: { unlock: () => void }) {
  const queryResult = useStaticQuery(graphql`
    query timerLength {
      allContentfulSiteOptions {
        edges {
          node {
            timerLength
          }
        }
      }
    }
  `);

  const { timerLength } = queryResult.allContentfulSiteOptions.edges[0].node;

  const [timerValue, setTimerValue] = useState(timerLength);
  const animationId = useRef(0);
  useEffect(() => {
    let start: number | null;
    const step = (timestamp:number) => {
      if (!start) {
        start = timestamp;
        window.requestAnimationFrame(step);
      } else {
        const newTimerValue = timerLength - (timestamp - start) / 1000;
        if (newTimerValue <= 0) {
          setTimerValue(0);
          unlock();
        } else {
          setTimerValue(newTimerValue);
          animationId.current = window.requestAnimationFrame(step);
        }
      }
    };
    animationId.current = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationId.current);
  }, []);

  return (
    <BannerLayer>
      <Box sx={{
        position: 'relative',
        width: '100%',
        borderTop: '30px solid #D6224C',
        borderBottom: '30px solid #D6224C',
        margin: '1em 0',
        backgroundColor: '#020F18',
        fontWeight: '700',
        fontSize: '5em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
        animation: `0.1s ${appear}`,
        opacity: '0.8',
      }}
      >
        <Box
          className="material-icons-sharp"
          component="span"
          sx={{
            fontSize: '4em',
            color: '#246E8D',
          }}
        >
          lock
        </Box>
        <Typography sx={{
          position: 'absolute',
          bottom: 'calc(35% - 0.6em)',
          display: 'flex',
          fontSize: '1em',

          '& > div': {
            color: '#020F18',
            width: '1ch',
            backgroundColor: '#246E8D',
          },

          '& > div:nth-last-child(3)': {
            width: '0.5ch',
            backgroundColor: '#246E8D',
          },
        }}
        >
          {timerValue.toFixed(2).split('').map(
            // eslint-disable-next-line react/no-array-index-key
            (char:string, index:number) => <div key={index}>{char}</div>,
          )}
        </Typography>
      </Box>
    </BannerLayer>
  );
};

export default LockScreen;
