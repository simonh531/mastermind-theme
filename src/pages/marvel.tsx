import React, { useState, useRef, useEffect } from 'react';
import { graphql } from 'gatsby';
import { keyframes } from '@emotion/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  lightBlue, amber, lime, deepOrange,
} from '@mui/material/colors';
import {
  CssBaseline, Box, Typography, useMediaQuery,
} from '@mui/material';
import { getCorrect, reduceSolutionSet } from '../mastermind';
import '../stylesheet.css';
import Layer from '../components/layer';
import Passcode from '../components/passcode';
import Guesses from '../components/guesses';
import Hacking from '../components/hacking';
import Desktop from '../components/desktop';
import LockScreen from '../components/lockScreen';

declare module '@mui/material/styles' {
  interface Palette {
    stark: React.CSSProperties['color']
    asgard: React.CSSProperties['color']
    hydra: React.CSSProperties['color']
    sanctum: React.CSSProperties['color']
  }

  interface PaletteOptions {
    stark?: React.CSSProperties['color']
    asgard?: React.CSSProperties['color']
    hydra?: React.CSSProperties['color']
    sanctum?: React.CSSProperties['color']
  }

  interface BreakpointOverrides {
    mobileSm: true
    mobileLg: true
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#020F18',
      light: '#03141E',
    },
    secondary: {
      main: '#84ABC1',
      dark: '#246E8D',
    },
    error: {
      main: '#D6224C',
    },
    stark: lightBlue.A700,
    asgard: lime.A700,
    hydra: deepOrange.A700,
    sanctum: amber.A700,
  },
  typography: {
    fontFamily: "'Titillium Web', sans-serif",
  },
  breakpoints: {
    values: {
      xs: 0,
      mobileSm: 300,
      mobileLg: 450,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const appear = keyframes`
  0% {
    transform: scaleY(0);
  }
  10% {
    transform: scaleY(1);
  }
`;

const Home = function ({ data } : { data: {
  allContentfulSiteOptions: { edges: { node: {triesBeforeLock: number} }[] }
}}) {
  const [possibleCodes, setPossibleCodes] = useState(() => {
    const list = [];
    for (let i = 1; i <= 5; i += 1) {
      for (let j = 1; j <= 5; j += 1) {
        for (let k = 1; k <= 5; k += 1) {
          for (let l = 1; l <= 5; l += 1) {
            list.push([i, j, k, l]);
          }
        }
      }
    }
    return list;
  });
  const [code, setCode] = useState([0, 0, 0, 0]);
  const [solution, setSolution] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<Array<[[number, number], number[]]>>([]);
  const [key, setKey] = useState(1);
  const [unlocked, setUnlocked] = useState(false);
  const isPortraitPhone = useMediaQuery('(max-width: 599px) and (orientation: portrait)');

  const { triesBeforeLock } = data.allContentfulSiteOptions.edges[0].node;
  const [triesUntilLock, setTriesUntilLock] = useState(triesBeforeLock);

  const resetTriesUntilLock = () => setTriesUntilLock(triesBeforeLock);
  const backAudio = useRef<null|HTMLAudioElement>(null);
  const wrongAudio = useRef<null|HTMLAudioElement>(null);
  const correctAudio = useRef<null|HTMLAudioElement>(null);

  useEffect(() => {
    backAudio.current = new Audio('/sounds/back_001.ogg');
    wrongAudio.current = new Audio('/sounds/error_008.ogg');
    correctAudio.current = new Audio('/sounds/confirmation_002.ogg');
  }, []);

  const checkSolution = () => {
    let result:[number, number];
    let correct = false;
    if (!solution.length) {
      const [finalName, finalBucket] = reduceSolutionSet(code, possibleCodes);
      const stringResult = finalName.split(':');
      result = [parseInt(stringResult[0], 10), parseInt(stringResult[1], 10)];
      setPossibleCodes(finalBucket);
      if (finalBucket.length === 1) {
        setSolution(finalBucket[0]);
        if (result[0] === code.length) {
          correct = true;
        }
      }
    } else {
      const { numCorrect, numExist } = getCorrect(code, solution);
      result = [numCorrect, numExist];
      if (numCorrect === code.length) {
        correct = true;
      }
    }
    if (correct) {
      setKey(Math.random());
      setTriesUntilLock(triesBeforeLock);
      if (correctAudio.current) {
        correctAudio.current.pause();
        correctAudio.current.currentTime = 0;
        correctAudio.current.play();
      }
      setTimeout(() => {
        setUnlocked(true);
        setTimeout(() => {
          setGuesses([]);
          setCode([0, 0, 0, 0]);
        }, 1000);
      }, 2000);
    }
    if (correct && guesses.length) {
      setGuesses([...guesses, [result, code]]);
    }
    if (!correct) {
      if (wrongAudio.current) {
        wrongAudio.current.pause();
        wrongAudio.current.currentTime = 0;
        wrongAudio.current.play();
      }
      setCode([0, 0, 0, 0]);
      setGuesses([...guesses, [result, code]]);
      setTriesUntilLock((prevValue:number) => prevValue - 1);
    }
    return correct;
  };

  const active = !!guesses.length && !unlocked;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          '@media (max-width: 599px) and (orientation: portrait)': {
            flexDirection: 'column',
          },
          backgroundColor: 'primary.light',
        }}
      >
        <Box sx={{
          width: active ? '50%' : '75%',
          paddingLeft: active ? '0%' : '25%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 1s, flex 1s, padding-left 1s',

          '@media (max-width: 599px) and (orientation: portrait)': {
            flex: active ? '0' : '1',
            width: '100%',
            paddingLeft: '0%',
          },
        }}
        >
          <Box sx={{ // spacer
            flex: active ? '0' : '1',
            transition: 'flex 1s',
            '@media (max-width: 599px) and (orientation: portrait)': {
              flex: '0',
            },
          }}
          />
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 6px 6px 12px',
            '@media (max-width: 599px) and (orientation: landscape)': {
              fontSize: '0.5em',
            },
            '@media (max-width: 599px) and (orientation: portrait)': {
              height: '100%',
              fontSize: '0.65em',
              padding: '12px 12px 6px 12px',
            },
          }}
          >
            <Passcode
              code={code}
              setCode={setCode}
              checkSolution={checkSolution}
              active={!unlocked}
            />
          </Box>
          {!isPortraitPhone && (
            <Box sx={{
              flex: '1',
              height: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 6px 12px 12px',
              pointerEvents: 'none',
            }}
            >
              {/* {fontsReady && <Hacking active={active} />} */}
              <Hacking active={active} />
            </Box>
          )}
        </Box>
        <Box // guesses column
          sx={{
            width: active ? '50%' : '25%',
            padding: active ? '12px 12px 12px 6px' : '0px',
            transition: 'width 1s, padding 1s, flex 1s',
            ' @media (max-width: 599px) and (orientation: portrait)': {
              flex: active ? '1' : '0',
              height: '0',
              width: '100%',
              padding: active ? '6px 12px 12px 12px' : '0px',
            },
          }}
        >
          <Guesses
            active={active}
            guesses={guesses}
          />
        </Box>
        <Desktop
          active={unlocked}
          lock={() => {
            setUnlocked(false);
            if (backAudio.current) {
              backAudio.current.pause();
              backAudio.current.currentTime = 0;
              backAudio.current.play();
            }
          }}
        />
        {triesUntilLock ? '' : <LockScreen unlock={resetTriesUntilLock} />}
        <Layer sx={{ pointerEvents: 'none' }}>
          <Typography
            variant="h1"
            key={key}
            sx={{
              width: '100%',
              margin: '1em 0',
              backgroundColor: '#84ABC1',
              color: '#020F18',
              fontWeight: '700',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '6em',
              userSelect: 'none',
              animation: `1s 2 alternate ${appear} both`,
              opacity: key === 1 ? '0' : '1',
              pointerEvents: key === 1 ? 'none' : 'auto',
              textAlign: 'center',

              '@media (max-width: 599px) and (orientation: portrait)': {
                fontSize: '4em',
              },
            }}
          >
            ACCESS GRANTED
          </Typography>
        </Layer>
      </Box>
    </ThemeProvider>
  );
};

export const query = graphql`
  query triesBeforeLock {
    allContentfulSiteOptions {
      edges {
        node {
          triesBeforeLock
        }
      }
    }
  }
`;

export default Home;
