// eslint-disable-next-line no-use-before-define
import React, { useState, useRef, useEffect } from 'react';
import { graphql } from 'gatsby';
import styled, { keyframes } from 'styled-components';
import { useMediaQuery } from 'react-responsive';
import '../stylesheet.css';
import '../normalize.css';
import Passcode from '../components/passcode';
import Guesses from '../components/guesses';
import Hacking from '../components/hacking';
import Desktop from '../components/desktop';
import LockScreen from '../components/lockScreen';
import { Layer } from '../styles/styles';

const Main = styled.main`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;

  @media (max-width: 768px) and (orientation: portrait) {
    flex-direction: column-reverse;
  }
`;

const Column1 = styled.div<{active: boolean}>`
  width: ${({ active }) => (active ? '50' : '25')}%;
  padding: ${({ active }) => (active ? '12px 6px 12px 12px' : '0px')};
  transition: width 1s, padding 1s, flex 1s;

  @media (max-width: 768px) and (orientation: portrait) {
    flex: ${({ active }) => (active ? 1 : 0)};
    height: 0;
    width: 100%;
    padding: ${({ active }) => (active ? '6px 12px 12px 12px' : '0px')};
  }
`;

const Column2 = styled.div<{active: boolean}>`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: width 1s, flex 1s;

  @media (max-width: 768px) and (orientation: portrait) {
    flex: ${({ active }) => (active ? 0 : 1)};
    width: 100%;
  }
`;

const EmptyArea = styled.div<{active: boolean}>`
  flex: ${({ active }) => (active ? 0 : 1)};
  transition: flex 1s;

  @media (max-width: 768px) and (orientation: portrait) {
    flex: 0;
  }
`;

const PasscodeArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 12px 6px 6px;

  @media (max-width: 768px) and (orientation: landscape) {
    font-size: 0.5em;
  }

  @media (max-width: 768px) and (orientation: portrait) {
    height: 100%;
    font-size: 0.7em;
    padding: 12px 12px 6px 12px;
  }
`;

const HackingArea = styled.div<{active: boolean}>`
  flex: 1;
  height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px 12px 6px;
  pointer-events: none;
`;

const BannerLayer = styled(Layer)`
  pointer-events: none;
`;

const appear = keyframes`
  0% {
    transform: scaleY(0);
  }
  10% {
    transform: scaleY(1);
  }
`;

const Banner = styled.h1<{initial: boolean}>`
  width: 100%;
  margin: 1em 0;
  background-color: #84ABC1;
  color: #020F18;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 6em;
  user-select: none;
  animation: 1s 2 alternate ${appear} both;
  opacity: ${({ initial }) => (initial ? '0' : '1')};
  pointer-events: ${({ initial }) => (initial ? 'none' : 'auto')};
  text-align: center;

  @media (max-width: 768px) and (orientation: portrait) {
    font-size: 4em;
  }
`;

const Home = function ({ data } : { data: {
  allContentfulSiteOptions: { edges: { node: {triesBeforeLock: number} }[] }
}}) {
  const [code, setCode] = useState([0, 0, 0, 0]);
  const [solution, setSolution] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<number[][]>([]);
  const [key, setKey] = useState(1);
  const [unlocked, setUnlocked] = useState(false);
  const isPortraitPhone = useMediaQuery({ query: '(max-width: 768px) and (orientation: portrait)' });

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
    if (!solution.length) {
      let validated = false;
      while (validated === false) {
        // the reason it keeps trying instead of choosing an adjacent one is
        // solutions adjacent to invalid ones are more likely to be chosen.
        // this method is fair but can take multiple tries.
        const testSolution = [
          Math.ceil(Math.random() * 5),
          Math.ceil(Math.random() * 5),
          Math.ceil(Math.random() * 5),
          Math.ceil(Math.random() * 5),
        ];
        let i = 0;
        let alreadyCorrect = false;
        let pairs = false;
        validated = true;
        while (i < 4 && validated) { // fail validation = early exit
          if (code[i] === testSolution[i]) {
            if (!alreadyCorrect) {
              alreadyCorrect = true; // only one is allowed to start correct
            } else {
              validated = false; // leading to early exit
            }
          }
          let j = i + 1;
          while (j < 4 && validated) {
            if (testSolution[i] === testSolution[j]) { // is a pair
              if (!pairs) {
                pairs = true; // only one pair allowed
              } else {
                validated = false;
              }
            }
            j += 1;
          }
          i += 1;
        }
        if (validated) { // passed all checks
          setTimeout(setSolution, 2000, testSolution);
        }
      }
    }
    let correct = true;
    let i = 0;
    while (correct && i < 4) {
      if (code[i] !== solution[i]) {
        correct = false;
      }
      i += 1;
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
      setGuesses([...guesses, code]);
    }
    if (!correct) {
      if (wrongAudio.current) {
        wrongAudio.current.pause();
        wrongAudio.current.currentTime = 0;
        wrongAudio.current.play();
      }
      setCode([0, 0, 0, 0]);
      setGuesses([...guesses, code]);
      setTriesUntilLock((prevValue:number) => prevValue - 1);
    }
    return correct;
  };

  return (
    <Main>
      <Column1 active={!!guesses.length && !!solution.length && !unlocked}>
        <Guesses
          active={
          !!guesses.length && !!solution.length && !unlocked
        }
          guesses={guesses}
          solution={solution}
        />
      </Column1>
      <Column2 active={!!guesses.length && !!solution.length && !unlocked}>
        <EmptyArea active={!!guesses.length && !!solution.length && !unlocked} />
        <PasscodeArea>
          <Passcode
            code={code}
            setCode={setCode}
            checkSolution={checkSolution}
            active={!unlocked}
          />
        </PasscodeArea>
        {!isPortraitPhone && (
          <HackingArea active={!!guesses.length && !!solution.length && !unlocked}>
            <Hacking active={!!guesses.length && !!solution.length && !unlocked} />
          </HackingArea>
        )}
      </Column2>
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
      <BannerLayer>
        <Banner key={key} initial={key === 1}>
          ACCESS GRANTED
        </Banner>
      </BannerLayer>
    </Main>
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
