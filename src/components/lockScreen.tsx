// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled, { keyframes } from 'styled-components';
import { Layer } from '../styles/styles';

const BannerLayer = styled(Layer)`
  background-color: rgba(0,0,0,0.4);
`;

const appear = keyframes`
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
`;

const Banner = styled.div`
  position: relative;
  width: 100%;
  border-top: 30px solid #D6224C;
  border-bottom: 30px solid #D6224C;
  margin: 1em 0;
  background-color: rgba(2, 15, 24, 0.95);
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 6em;
  user-select: none;
  animation: 0.1s ${appear};
`;

const LockIcon = styled.span`
  font-size: 4em;
  color: #246E8D;
`;

const Timer = styled.div`
  background-color: #246E8D;
  padding: 0 10px;
  position: absolute;
  bottom: calc(35% - 0.5em);
  display: flex;
  
  & > div {
    color: #020F18;
    width: 1ch;
  }

  & > div:nth-last-child(3) {
    width: 0.5ch;
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
      <Banner>
        <LockIcon className="material-icons-sharp">
          lock
        </LockIcon>
        <Timer>
          {timerValue.toFixed(2).split('').map((char:string) => <div>{char}</div>)}
        </Timer>
      </Banner>
    </BannerLayer>
  );
};

export default LockScreen;
