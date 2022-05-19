import React, { useState } from 'react';
import {
  Box, Typography, Grid, Paper, styled,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import {
  red, green, blue, yellow, orange,
} from '@mui/material/colors';
import { graphql } from 'gatsby';
import {
  renderRichText,
  RenderRichTextData,
  ContentfulRichTextGatsbyReference,
} from 'gatsby-source-contentful/rich-text';
import { BLOCKS } from '@contentful/rich-text-types';
import { getCorrect, calcSolutionSet, reduceBuckets } from '../mastermind';
import '../stylesheet.css';
import HomeLayout from '../components/homeLayout';

const CodeBox = styled(Typography)<{ active: number, color: string }>(({ active, color }) => ({
  borderBottom: '2px solid white',
  textAlign: 'center',
  color,
  fontSize: '3em',
  ...active ? {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
  } : { userSelect: 'none' },
}));

const CodeButton = styled(Typography)({
  textAlign: 'center',
  fontSize: '3em',
  cursor: 'pointer',
  borderRadius: '4px',
  userSelect: 'none',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});

const CodeNumbers = styled('div')({ marginLeft: '0.5em', marginRight: '0.1em', letterSpacing: '2px' });
const CodeDigit = styled('span')(({ color }) => ({ color }));

const numberColors = [red.A200, green.A200, yellow.A200, blue.A200, orange.A200];

const drawHintBox = (quantity: number, color: string) => {
  const boxes = [];
  for (let i = 0; i < quantity; i += 1) {
    boxes.push(<Box
      key={i}
      sx={{
        width: '40%', height: '40%', margin: '5%', backgroundColor: color,
      }}
    />);
  }
  return boxes;
};

function HintDisplay({ activeHint, guesses, setActiveHint }:{
  activeHint:number,
  guesses:Array<[[number, number], number[]]>,
  // eslint-disable-next-line no-unused-vars
  setActiveHint:(index: number) => () => void,
}) {
  return (
    <Paper sx={{ height: '100%', padding: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3" sx={{ fontSize: '1.8em' }}>
          Hints:
        </Typography>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.8em' }}>
              right color, right spot
            </Typography>
            <Box sx={{
              backgroundColor: red.A200,
              width: '1em',
              height: '1em',
              marginLeft: '0.5ch',
            }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.8em' }}>
              right color, wrong spot
            </Typography>
            <Box sx={{
              backgroundColor: 'white',
              width: '1em',
              height: '1em',
              marginLeft: '0.5ch',
            }}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column-reverse' }}>
        {guesses.map(([[correct, halfCorrect], numbers], index) => (
          <Grid
            container
            spacing={2}
            columns={5}
                  // eslint-disable-next-line react/no-array-index-key
            key={index}
            sx={{ cursor: 'pointer', '&:hover>div>div': { backgroundColor: 'rgba(0,0,0,0.2)' } }}
            onClick={setActiveHint(index)}
          >
            {numbers.map((digit, digitIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <Grid item xs={1} key={digitIndex}>
                <Typography sx={{
                  textAlign: 'center',
                  color: numberColors[digit - 1],
                  fontSize: '3em',
                }}
                >
                  {digit}
                </Typography>
              </Grid>
            ))}
            <Grid item xs={1}>
              <Box sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: index === activeHint ? 'rgba(0,0,0,0.2)' : '',
              }}
              >
                <Box sx={{
                  height: '100%', maxWidth: '100%', display: 'flex', flexWrap: 'wrap', padding: '5%', aspectRatio: '1 / 1',
                }}
                >
                  {drawHintBox(correct, red.A200)}
                  {drawHintBox(halfCorrect, 'white')}
                </Box>
              </Box>
            </Grid>
          </Grid>
        ))}
      </Box>
    </Paper>
  );
}

export default function ({ location, data } : {
  location: { pathname: string },
  data: {
    allContentfulBlurb: { edges: { node: {
      text: RenderRichTextData<ContentfulRichTextGatsbyReference>
    } }[] }
  }
}) {
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
  const [hintSteps, setHintSteps] = useState<Record<string, number[][]>[]>([]);
  const [activeHint, setActiveHint] = useState(0);
  const [code, setCode] = useState([0, 0, 0, 0]);
  const [solution, setSolution] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<Array<[[number, number], number[]]>>([]);
  const [solved, setSolved] = useState(false);

  const reset = () => {
    setHintSteps([]);
    setActiveHint(0);
    setCode([0, 0, 0, 0]);
    setSolution([]);
    setGuesses([]);
    setSolved(false);
  };

  const makeSetCode = (value:number) => () => {
    const changeIndex = code.findIndex((element) => element === 0);
    if (changeIndex !== -1) {
      const newCode = [...code];
      newCode[changeIndex] = value;
      setCode(newCode);
    }
  };

  const makeRemoveCode = (index: number) => () => {
    const newCode = [...code];
    newCode[index] = 0;
    setCode(newCode);
  };

  const checkSolution = () => {
    const buckets = calcSolutionSet(code, possibleCodes);
    setHintSteps((prevValue) => [...prevValue, buckets]);
    setActiveHint(hintSteps.length);
    const [finalName, finalBucket] = reduceBuckets(buckets);
    const stringResult = finalName.split(':');
    const result:[number, number] = [parseInt(stringResult[0], 10), parseInt(stringResult[1], 10)];
    setPossibleCodes(finalBucket);

    setGuesses([...guesses, [result, code]]);

    if (finalBucket.length === 1 && !solution.length) {
      setSolution(finalBucket[0]);
    }

    if (solution.length && getCorrect(code, solution).numCorrect === 4) {
      setSolved(true);
    } else {
      setCode([0, 0, 0, 0]);
    }
  };

  const filled = code.reduce(
    (prevValue, currentValue) => (currentValue && prevValue ? 1 : 0),
  );

  return (
    <HomeLayout location={location}>
      {renderRichText(data.allContentfulBlurb.edges[0].node.text, {
        renderNode: {
          // eslint-disable-next-line react/no-unstable-nested-components
          [BLOCKS.PARAGRAPH]: (_node, children) => <Typography sx={{ marginBottom: '1em' }}>{children}</Typography>,
        },
      })}
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12} container direction="column" spacing={2}>
          <Grid item>
            <Paper sx={{ padding: 1 }}>
              <Grid container spacing={2} columns={5}>
                {code.map((number, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Grid item xs={1} key={index}>
                    <CodeBox
                      active={number}
                      color={numberColors[number - 1]}
                      onClick={makeRemoveCode(index)}
                    >
                      {number || <>&nbsp;</>}
                    </CodeBox>
                  </Grid>
                ))}
                <Grid item xs={1}>
                  <Box sx={{
                    height: '100%',
                    width: '100%',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: filled ? 'rgba(0,0,0,0.1)' : '',
                    },
                  }}
                  >
                    <Box
                      component="span"
                      className="material-icons-sharp"
                      sx={{
                        top: '50%',
                        fontSize: '3em',
                        lineHeight: '0',
                        color: filled ? 'white' : 'rgba(255,255,255,0.2)',
                        cursor: filled ? 'pointer' : 'default',
                        textAlign: 'center',
                        display: 'block',
                        position: 'relative',
                      }}
                      onClick={filled ? checkSolution : () => { /* do nothing */ }}
                    >
                      send
                    </Box>
                  </Box>
                </Grid>
                { numberColors.map((color, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Grid item xs={1} key={index}>
                    <CodeButton
                      sx={{ color }}
                      onClick={makeSetCode(index + 1)}
                    >
                      {index + 1}
                    </CodeButton>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
          <Grid
            item
            sx={{
              display: {
                xs: 'block',
                sm: 'none',
              },
            }}
          >
            {guesses.length ? (
              <Accordion>
                <AccordionSummary expandIcon={
                  <Box component="span" className="material-icons-sharp" color="white">expand_more</Box>
                  }
                >
                  <Grid container>
                    <Grid item xs={1}>
                      <Box sx={{
                        height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
                      }}
                      >
                        <Box sx={{
                          height: '1em', maxWidth: '100%', display: 'flex', flexWrap: 'wrap', aspectRatio: '1 / 1',
                        }}
                        >
                          {drawHintBox(guesses[activeHint][0][0], red.A200)}
                          {drawHintBox(guesses[activeHint][0][1], 'white')}
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={11}>
                      <Typography>
                          &nbsp;
                        {hintSteps[activeHint][`${guesses[activeHint][0][0]}:${guesses[activeHint][0][1]}`].length}
                          &nbsp; possible code
                        {hintSteps[activeHint][`${guesses[activeHint][0][0]}:${guesses[activeHint][0][1]}`].length === 1 ? '' : 's'}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {hintSteps[activeHint][`${guesses[activeHint][0][0]}:${guesses[activeHint][0][1]}`].map((codeNumbers) => (
                      <CodeNumbers>
                        {codeNumbers.map((number) => (
                          <CodeDigit color={numberColors[number - 1]}>
                            {number}
                          </CodeDigit>
                        ))}
                      </CodeNumbers>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ) : (
              <Paper sx={{ padding: 1, height: '100%' }}>
                <Typography>
                  Number of possible codes: 5 x 5 x 5 x 5 = 625
                </Typography>
              </Paper>
            )}
            { solved ? (
              <Paper
                sx={{ padding: 1, cursor: 'pointer', ':hover': { backgroundColor: 'rgba(0,0,0,0.1)' } }}
                onClick={reset}
              >
                <Typography variant="h2" sx={{ fontSize: '2em', textAlign: 'center' }}>Reset</Typography>
              </Paper>
            ) : null}
          </Grid>
          <Grid item sx={{ flex: '1' }}>
            <HintDisplay
              activeHint={activeHint}
              guesses={guesses}
              setActiveHint={(index) => () => setActiveHint(index)}
            />
          </Grid>
        </Grid>
        <Grid
          item
          sm={6}
          xs={0}
          sx={{
            display: {
              xs: 'none',
              sm: 'block',
            },
          }}
        >
          {guesses.length ? (
            Object.entries(hintSteps[activeHint]).map(([hintType, codes], index) => {
              const stringResult = hintType.split(':');
              const numCorrect = parseInt(stringResult[0], 10);
              const numHalfCorrect = parseInt(stringResult[1], 10);
              const isSelected = guesses[activeHint][0][0] === numCorrect
                && guesses[activeHint][0][1] === numHalfCorrect;
              return (
              // eslint-disable-next-line react/no-array-index-key
                <Accordion key={`${activeHint}-${index}`}>
                  <AccordionSummary expandIcon={
                    <Box component="span" className="material-icons-sharp" color="white">expand_more</Box>
                      }
                  >
                    <Grid container>
                      <Grid item xs={1}>
                        <Box sx={{
                          height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
                        }}
                        >
                          <Box sx={{
                            height: '1em', maxWidth: '100%', display: 'flex', flexWrap: 'wrap', aspectRatio: '1 / 1',
                          }}
                          >
                            {drawHintBox(numCorrect, red.A200)}
                            {drawHintBox(numHalfCorrect, 'white')}
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={11}>
                        <Typography>
                              &nbsp;
                          {codes.length}
                              &nbsp; possible code
                          {codes.length === 1 ? '' : 's'}
                              &nbsp;
                          {isSelected ? '(selected)' : ''}
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {codes.map((codeNumbers) => (
                        <CodeNumbers>
                          {codeNumbers.map((number) => (
                            <CodeDigit color={numberColors[number - 1]}>
                              {number}
                            </CodeDigit>
                          ))}
                        </CodeNumbers>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })
          ) : (
            <Paper sx={{ padding: 1, height: '100%' }}>
              <Typography>
                Number of possible codes: 5 x 5 x 5 x 5 = 625
              </Typography>
            </Paper>
          )}
          { solved ? (
            <Paper
              sx={{ padding: 1, cursor: 'pointer', ':hover': { backgroundColor: 'rgba(0,0,0,0.1)' } }}
              onClick={reset}
            >
              <Typography variant="h2" sx={{ fontSize: '2em', textAlign: 'center' }}>Reset</Typography>
            </Paper>
          ) : null}
        </Grid>
      </Grid>
    </HomeLayout>
  );
}

export const query = graphql`
  query HomeText {
    allContentfulBlurb(filter: {name: {eq: "Home"}}) {
      edges {
        node {
          text {
            raw
          }
        }
      }
    }
  }
`;
