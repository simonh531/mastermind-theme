// eslint-disable-next-line no-use-before-define
import React, {
  useState, useEffect, useRef, useMemo,
} from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import customStyle from '../styles/syntax';
import Panel from './panel';

SyntaxHighlighter.registerLanguage('tsx', tsx);

const StyledPanel = styled(Panel)<{active: boolean}>`
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  transform: scale(${({ active }) => (active ? '1,1' : '0,0')});
  transition: transform 1s;
`;

const HackingContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const HackingText = styled.div.attrs<{space: number}>(({ space }) => ({
  style: {
    top: `calc(100% - ${space * 0.8}em)`,
  },
}))<{space: number}>`
  position: relative;
  font-family: Roboto Mono;
  & > pre {
    overflow-x: hidden;
    color: #246E8D;
  }
`;

const Hacking = function ({ active } : {
  active: boolean,
}) {
  const queryResult = useStaticQuery(graphql`
    query HackerCode {
      allContentfulHackerCodeCodeTextNode {
        edges {
          node {
            code
          }
        }
      }
    }
  `);
  const { edges } = queryResult.allContentfulHackerCodeCodeTextNode;
  const lengths = edges.map(({ node }:{node:{code:string}}) => {
    const { code } = node;
    const lines = code.split('\n');
    return lines.map((line:string) => line.length);
  });
  const [lastIndex, setLastIndex] = useState(Math.floor(Math.random() * edges.length));
  const [currentIndex, setCurrentIndex] = useState(
    (lastIndex + Math.floor(Math.random() * (edges.length - 1)) + 1) % edges.length,
  );
  const lastIndexRef = useRef(lastIndex);
  const currentIndexRef = useRef(currentIndex);
  const [space, setSpace] = useState<number>(lengths[lastIndex].length);

  const animationId = useRef(0);
  useEffect(() => {
    if (active) {
      let lastTimestamp:number;
      const step = (timestamp:number) => {
        if (lastTimestamp) {
          const elapsed = timestamp - lastTimestamp;
          setSpace((prevValue) => {
            const nextValue = prevValue + Math.floor(elapsed / 16);
            if (nextValue < lengths[lastIndex].length + lengths[currentIndex].length) {
              return nextValue;
            }
            const toSubtract = lengths[lastIndexRef.current].length;
            lastIndexRef.current = currentIndexRef.current;
            setLastIndex(lastIndexRef.current);

            currentIndexRef.current = (currentIndexRef.current
              + Math.floor(Math.random() * (edges.length - 1)) + 1) % edges.length;
            setCurrentIndex(currentIndexRef.current);

            return nextValue - toSubtract;
          });
        }
        lastTimestamp = timestamp;
        animationId.current = window.requestAnimationFrame(step);
      };
      animationId.current = window.requestAnimationFrame(step);
      return () => window.cancelAnimationFrame(animationId.current);
    }
    return () => { /* no cleanup */ };
  }, [active]);

  const codeBlocks = useMemo(() => (
    <>
      <SyntaxHighlighter language="tsx" style={customStyle} key={lastIndex}>
        {edges[lastIndex].node.code}
      </SyntaxHighlighter>
      <SyntaxHighlighter language="tsx" style={customStyle} key={currentIndex}>
        {edges[currentIndex].node.code}
      </SyntaxHighlighter>
    </>
  ), [lastIndex, currentIndex]);

  return (
    <StyledPanel backgroundColor="#020F18" active={active} scroll>
      <HackingContainer>
        <HackingText space={space}>
          { codeBlocks }
        </HackingText>
      </HackingContainer>
    </StyledPanel>
  );
};

export default Hacking;
