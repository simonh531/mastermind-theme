// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Box, styled } from '@mui/material';
import Panel from './panel';
import ArcReactor from '../images/arcReactor.svg';
import Asgard from '../images/asgard.svg';
import Hydra from '../images/hydra.svg';
import Sanctum from '../images/sanctum.svg';
import Shield from '../images/shield.svg';

const radius = 25;
const offset = radius * (Math.PI / 4);
const threeFourths = radius * (Math.PI * 1.5);
const half = radius * Math.PI;
const quarter = radius * (Math.PI / 2);

const ArcReactorIcon = styled(ArcReactor)(({ theme }) => ({
  fill: theme.palette.stark,
  width: 'auto',
  height: 'auto',
}));

const AsgardIcon = styled(Asgard)(({ theme }) => ({
  fill: theme.palette.asgard,
  width: 'auto',
  height: 'auto',
}));

const HydraIcon = styled(Hydra)(({ theme }) => ({
  fill: theme.palette.hydra,
  width: 'auto',
  height: 'auto',
}));

const SanctumIcon = styled(Sanctum)(({ theme }) => ({
  fill: theme.palette.sanctum,
  width: 'auto',
  height: 'auto',
}));

const ShieldIcon = styled(Shield)(({ theme }) => ({
  fill: theme.palette.secondary.main,
  width: 'auto',
  height: 'auto',
}));

const Icon = styled('div')`
  flex: 1;
  width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1%;  
  margin: 1%;
`;

const GuessResult = styled('svg')({
  width: '100%',
  height: '100%',
});

function CircleSegment({ color, size }:{ color: string, size: number }) {
  if (size === 3) {
    return (
      <circle
        cx="50"
        cy="50"
        r="25"
        fill="transparent"
        stroke={color}
        strokeWidth="50"
        strokeDasharray={threeFourths}
        strokeDashoffset={half + offset}
      />
    );
  }
  if (size === 2) {
    return (
      <circle
        cx="50"
        cy="50"
        r="25"
        fill="transparent"
        stroke={color}
        strokeWidth="50"
        strokeDasharray={half}
        strokeDashoffset={quarter + offset}
      />
    );
  }
  return (
    <circle
      cx="50"
      cy="50"
      r="25"
      fill="transparent"
      stroke={color}
      strokeWidth="50"
      strokeDasharray={`${quarter} ${threeFourths}`}
      strokeDashoffset={quarter + offset}
    />
  );
}

function Guesses({
  active,
  guesses,
}: {
  active: boolean,
  guesses: Array<[[number, number], number[]]>,
}) {
  const guessCopy = [...guesses].reverse();
  const guessList = guessCopy.map((row, index) => {
    const [numCorrect, numExist] = row[0];
    const code = row[1];
    const iconList = code.map((value, valueIndex) => {
      /* eslint-disable react/no-array-index-key */
      switch (value) {
        case 1:
          return (
            <Icon key={valueIndex}>
              <ArcReactorIcon />
            </Icon>
          );
        case 2:
          return (
            <Icon key={valueIndex}>
              <AsgardIcon />
            </Icon>
          );
        case 3:
          return (
            <Icon key={valueIndex}>
              <HydraIcon />
            </Icon>
          );
        case 4:
          return (
            <Icon key={valueIndex}>
              <SanctumIcon />
            </Icon>
          );
        case 5:
          return (
            <Icon key={valueIndex}>
              <ShieldIcon />
            </Icon>
          );
        default:
          return null;
      }
      /* eslint-enable react/no-array-index-key */
    });

    const blocks = [];
    const total = numCorrect + numExist;

    if (numCorrect === 4) {
      blocks.push(<circle key="4correct" cx="50" cy="50" r="50" fill="#84abc1" strokeWidth="0" />);
    } else {
      if (numExist) {
        if (total === 4) {
          blocks.push(<circle key="exist" cx="50" cy="50" r="50" fill="#246E8D" strokeWidth="0" />);
        } else {
          blocks.push(<CircleSegment key="exist" color="#246E8D" size={total} />);
        }
      }
      if (numCorrect) {
        blocks.push(<CircleSegment key="correct" color="#84abc1" size={numCorrect} />);
      }
      blocks.push(<circle key="outline" cx="50" cy="50" r="49" fill="transparent" stroke="#84abc1" strokeWidth="2" />);
    }

    return (
      <Box
        // eslint-disable-next-line react/no-array-index-key
        key={guessCopy.length - index}
        sx={{
          display: 'flex',
          position: 'relative',
          opacity: active ? '1' : '0',

          transition: 'opacity 2s',
        }}
      >
        {iconList}
        <Icon>
          <GuessResult viewBox="0 0 100 100">
            {blocks}
          </GuessResult>
        </Icon>
      </Box>
    );
  });
  return (
    <Panel
      scroll
      sx={{
        width: 'calc(100% - 16px)',
        height: 'calc(100% - 16px)',
        transform: `scale(${active ? '1,1' : '0,0'})`,
        transition: 'transform 1s',
      }}
    >
      {guessList}
    </Panel>
  );
}

export default Guesses;
