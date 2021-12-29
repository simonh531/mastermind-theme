// eslint-disable-next-line no-use-before-define
import React from 'react';
import styled from 'styled-components';
import Panel from './panel';
import ArcReactor from '../images/arcReactor.svg';
import Asgard from '../images/asgard.svg';
import Hydra from '../images/hydra.svg';
import Sanctum from '../images/sanctum.svg';
import Shield from '../images/shield.svg';

const StyledPanel = styled(Panel)<{active: boolean}>`
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  transform: scale(${({ active }) => (active ? '1,1' : '0,0')});
  transition: transform 1s;
`;

const GuessLine = styled.div<{active: boolean}>`
  display: flex;
  position: relative;
  opacity: ${({ active }) => (active ? 1 : 0)};

  transition: opacity 2s;
`;

const ArcReactorIcon = styled(ArcReactor)`
  fill: #84ABC1;
  width: auto;
  height: auto;
`;

const AsgardIcon = styled(Asgard)`
  fill: #84ABC1;
  width: auto;
  height: auto;
`;

const HydraIcon = styled(Hydra)`
  fill: #84ABC1;
  width: auto;
  height: auto;
`;

const SanctumIcon = styled(Sanctum)`
  fill: #84ABC1;
  width: auto;
  height: auto;
`;

const ShieldIcon = styled(Shield)`
  fill: #84ABC1;
  width: auto;
  height: auto;
`;

const Icon = styled.div`
  flex: 1;
  width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1%;  
  margin: 1%;
`;

const Square = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;

  :after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;

const BlockContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-wrap: wrap;
  transform: rotate(45deg);
`;

const Block = styled.div<{color: string}>`
  width: 50%;
  height: 50%;
  background-color: ${({ color }) => color};

  :nth-child(1) {
    border-top: 2px solid #84ABC1;
    border-left: 2px solid #84ABC1;
    border-radius: 100% 0 0 0;
  }
  :nth-child(2) {
    border-top: 2px solid #84ABC1;
    border-right: 2px solid #84ABC1;
    border-radius: 0 100% 0 0;
  }
  :nth-child(3) {
    border-bottom: 2px solid #84ABC1;
    border-left: 2px solid #84ABC1;
    border-radius: 0 0 0 100%;
  }
  :nth-child(4) {
    border-bottom: 2px solid #84ABC1;
    border-right: 2px solid #84ABC1;
    border-radius: 0 0 100% 0;
  }
`;

const Guesses = function ({
  className,
  active,
  guesses,
  solution,
}: {
  className?: string,
  active: boolean,
  guesses: number[][],
  solution: number[],
}) {
  const guessCopy = [...guesses].reverse();
  const guessList = guessCopy.map((row, index) => {
    const iconList = row.map((value, valueIndex) => {
      switch (value) {
        case 1:
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Icon key={valueIndex}>
              <ArcReactorIcon />
            </Icon>
          );
        case 2:
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Icon key={valueIndex}>
              <AsgardIcon />
            </Icon>
          );
        case 3:
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Icon key={valueIndex}>
              <HydraIcon />
            </Icon>
          );
        case 4:
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Icon key={valueIndex}>
              <SanctumIcon />
            </Icon>
          );
        case 5:
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Icon key={valueIndex}>
              <ShieldIcon />
            </Icon>
          );
        default:
          return null;
      }
    });
    const rowCopy = [];
    const solutionCopy = [];
    let numCorrect = 0;
    for (let i = 0; i < 4; i += 1) {
      if (row[i] === solution[i]) {
        numCorrect += 1;
      } else {
        rowCopy.push(row[i]);
        solutionCopy.push(solution[i]);
      }
    }
    let numExist = 0;
    if (numCorrect !== 4) {
      for (let i = 0; i < rowCopy.length; i += 1) {
        let j = 0;
        let found = false;
        while (j < solutionCopy.length && !found) {
          if (rowCopy[i] === solutionCopy[j]) {
            numExist += 1;
            found = true;
            solutionCopy.splice(j, 1);
          } else {
            j += 1;
          }
        }
      }
    }

    const blocks = [];
    for (let i = 0; i < 4; i += 1) {
      if (i < numCorrect) {
        blocks.push(<Block color="#84ABC1" key={i} />);
      } else if (i < numCorrect + numExist) {
        blocks.push(<Block color="#246E8D" key={i} />);
      } else {
        blocks.push(<Block color="transparent" key={i} />);
      }
    }

    return (
      // eslint-disable-next-line react/no-array-index-key
      <GuessLine key={guessCopy.length - index} active={active}>
        {iconList}
        <Icon>
          <Square>
            <BlockContainer>
              {blocks}
            </BlockContainer>
          </Square>
        </Icon>
      </GuessLine>
    );
  });
  return (
    <StyledPanel backgroundColor="#020F18" className={className} active={active} scroll>
      {guessList}
    </StyledPanel>
  );
};

export default Guesses;
