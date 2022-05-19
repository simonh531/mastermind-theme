import React, { useState, useRef, useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import {
  renderRichText, RenderRichTextData, ContentfulRichTextGatsbyReference,
} from 'gatsby-source-contentful/rich-text';
import { Box, Typography, styled } from '@mui/material';
import Panel from './panel';
import Avengers from '../images/The_Avengers_logo.svg';

const AvengersLogo = styled(Avengers)`
  fill: #246E8D;
  width: 50%;
  height: auto;
  
  @media (max-width: 599px) and (orientation: portrait) {
    width: 80%;
  }
`;

const LogOff = styled('button')`
  width: 30px;
  height: 30px;
  border: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  cursor: pointer;

  @media (hover: hover) {
    :hover {
      background-color: #84ABC1;
      & > span {
        color: #246E8D;
      }
    }

    :active {
      background-color: transparent;
      & > span {
        color: #84ABC1;
      }
    }
  }
  @media (hover: none) {
    :active {
      background-color: #84ABC1;
      & > span {
        color: #246E8D;
      }
    }
  }
`;

const File = styled('button')`
  background: none;
  border: 0;
  margin: 6px;
  cursor: pointer;

  @media (hover: hover) {
    :hover {
      & > div, & > span {
        color: #246E8D;
      }
    }

    :active {
      & > div, & > span {
        color: #84ABC1;
      }
    }
  }
  @media (hover: none) {
    :active {
      & > div, & > span {
        color: #246E8D;
      }
    }
  }
`;

const CloseButton = styled('button')`
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  position: absolute;
  top: -4px;
  right: 0;

  @media (hover: hover) {
    :hover {
      & > span {
        color: #246E8D;
      }
    }

    :active {
      & > span {
        color: #84ABC1;
      }
    }
  }
  @media (hover: none) {
    :active {
      & > span {
        color: #246E8D;
      }
    }
  }
`;

const Desktop = function ({ active, lock }: {
  active: boolean,
  lock: () => void,
}) {
  const [focus, setFocus] = useState('');
  const [show, setShow] = useState(false);
  const queryResult = useStaticQuery(graphql`
    query Files {
      allContentfulFile {
        edges {
          node {
            title
            fileName
            id
            text {
              raw
            }
          }
        }
      }
    }
  `);
  const openAudio = useRef<null | HTMLAudioElement>(null);
  const backAudio = useRef<null | HTMLAudioElement>(null);
  useEffect(() => {
    openAudio.current = new Audio('/sounds/click_003.ogg');
    backAudio.current = new Audio('/sounds/back_001.ogg');
  }, []);

  const open = (file:string) => () => {
    if (openAudio.current) {
      openAudio.current.pause();
      openAudio.current.currentTime = 0;
      openAudio.current.play();
    }
    setFocus(file);
    setShow(true);
  };

  const fileNodes:React.ReactNode[] = [];
  const textObject:Record<string, {
    title: string,
    body: RenderRichTextData<ContentfulRichTextGatsbyReference>
  }> = {};

  queryResult.allContentfulFile.edges.forEach((data : {node: {
    id: string,
    title: string,
    text: RenderRichTextData<ContentfulRichTextGatsbyReference>,
    fileName: string
  }}) => {
    const {
      id, title, text, fileName,
    } = data.node;
    fileNodes.push(
      <File onClick={open(id)}>
        <Box
          component="span"
          className="material-icons-sharp"
          sx={{
            fontSize: '5em',
            color: '#84ABC1',
          }}
        >
          text_snippet
        </Box>
        <Typography sx={{
          fontSize: '1.6em',
          color: '#84ABC1',
        }}
        >
          {fileName}
        </Typography>
      </File>,
    );
    textObject[id] = {
      title,
      body: text,
    };
  });

  const exit = () => {
    if (backAudio.current) {
      backAudio.current.pause();
      backAudio.current.currentTime = 0;
      backAudio.current.play();
    }
    setShow(false);
  };

  return (
    <Box sx={{
      position: 'absolute',
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
      backgroundColor: '#020F18',
      opacity: active ? '1' : '0',
      pointerEvents: active ? 'auto' : 'none',
      transition: 'opacity 1s',
      display: 'flex',

      '@media (max-width: 599px) and (orientation: portrait)': {
        flexDirection: 'column',
      },
    }}
    >
      <Box sx={{
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
      >
        <AvengersLogo />
      </Box>
      <Box sx={{
        backgroundColor: '#246E8D',
        width: '30px',
        height: '100%',

        '@media (max-width: 599px) and (orientation: portrait)': {
          height: '30px',
          width: '100%',
        },
      }}
      >
        <LogOff onClick={lock}>
          <Box
            component="span"
            className="material-icons-sharp"
            sx={{
              fontSize: '24px',
              color: '#84ABC1',
            }}
          >
            lock
          </Box>
        </LogOff>
      </Box>
      <Box sx={{
        height: '100%',
        display: 'inline-flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        position: 'relative',

        '@media (max-width: 599px) and (orientation: portrait)': {
          flexDirection: 'row',
          height: 'auto',
          fontSize: '0.8em',
        },
      }}
      >
        {fileNodes}
      </Box>
      <Box sx={{
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        transform: `scale(${show ? '1,1' : '0,0'})`,
        transition: 'transform 0.6s',
        display: 'flex',
      }}
      >
        <Box
          onClick={exit}
          sx={{ flex: '1' }}
        />
        <Panel
          sx={{
            width: '60%',
            margin: '20px 12px',
            opacity: '0.98',
            '@media (max-width: 599px)': {
              width: '90%',
            },
          }}
        >
          {focus ? (
            <Box sx={{
              padding: '10px',
              opacity: show ? '1' : '0',
              transition: 'opacity 1s',
            }}
            >
              <Typography variant="h3" sx={{ marginTop: '4px', color: 'secondary.main' }}>
                {textObject[focus].title}
              </Typography>
              <Box sx={{ fontSize: '1.6em', color: 'secondary.main' }}>{renderRichText(textObject[focus].body)}</Box>
            </Box>
          ) : ''}
          <CloseButton onClick={exit}>
            <Box
              component="span"
              className="material-icons-sharp"
              sx={{
                fontSize: '3em',
                color: '#84ABC1',
              }}
            >
              close
            </Box>
          </CloseButton>
        </Panel>
        <Box
          onClick={exit}
          sx={{ flex: '1' }}
        />
      </Box>
    </Box>
  );
};

export default Desktop;
