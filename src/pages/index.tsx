// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import { graphql } from 'gatsby';
import '../stylesheet.css';
import '../normalize.css';
import styled, { keyframes } from 'styled-components';
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
`;

const Column1 = styled.div<{active: boolean}>`
  width: ${({ active }) => (active ? '50' : '25')}%;
  padding: ${({ active }) => (active ? '12px 6px 12px 12px' : '0px')};
  transition: width 1s, padding 1s;
`;

const Column2 = styled.div<{active: boolean}>`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: width 1s;
`;

const EmptyArea = styled.div<{active: boolean}>`
  flex: ${({ active }) => (active ? 0 : 1)};
  transition: flex 1s;
`;

const PasscodeArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 12px 6px 6px;
`;

const HackingArea = styled.div<{active: boolean}>`
  flex: 1;
  height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px 12px 6px;
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
`;

const Home = function ({ data } : { data: {
  allContentfulSiteOptions: { edges: { node: {triesBeforeLock: number} }[] }
}}) {
  const [code, setCode] = useState([0, 0, 0, 0]);
  const [solution, setSolution] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<number[][]>([]);
  const [key, setKey] = useState(1);
  const [unlocked, setUnlocked] = useState(false);

  const { triesBeforeLock } = data.allContentfulSiteOptions.edges[0].node;
  const [triesUntilLock, setTriesUntilLock] = useState(triesBeforeLock);

  const resetTriesUntilLock = () => setTriesUntilLock(triesBeforeLock);

  const backAudio = new Audio('/sounds/back_001.ogg');
  const wrongAudio = new Audio('/sounds/error_008.ogg');
  const correctAudio = new Audio('/sounds/confirmation_002.ogg');
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
      correctAudio.play();
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
      wrongAudio.play();
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
        <HackingArea active={!!guesses.length && !!solution.length && !unlocked}>
          <Hacking active={!!guesses.length && !!solution.length && !unlocked} />
        </HackingArea>
      </Column2>
      <Desktop active={unlocked} lock={() => { setUnlocked(false); backAudio.play(); }} />
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
