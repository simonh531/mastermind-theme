// eslint-disable-next-line no-use-before-define
import React, { useState, useRef, useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import {
  renderRichText, RenderRichTextData, ContentfulRichTextGatsbyReference,
} from 'gatsby-source-contentful/rich-text';
import styled from 'styled-components';
import Panel from './panel';
import Avengers from '../images/The_Avengers_logo.svg';

const Container = styled.div<{active: boolean}>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #020F18;
  opacity: ${({ active }) => (active ? 1 : 0)};
  pointer-events: ${({ active }) => (active ? 'auto' : 'none')};
  transition: opacity 1s;
  display: flex;

  @media (max-width: 768px) and (orientation: portrait) {
    flex-direction: column;
  }
`;

const LogoContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const AvengersLogo = styled(Avengers)`
  fill: #246E8D;
  width: 50%;
  height: auto;
  
  @media (max-width: 768px) and (orientation: portrait) {
    width: 80%;
  }
`;

const Taskbar = styled.div`
  background-color: #246E8D;
  width: 30px;
  height: 100%;

  @media (max-width: 768px) and (orientation: portrait) {
    height: 30px;
    width: 100%;
  }
`;

const LogOff = styled.button`
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

const LogOffIcon = styled.span`
  font-size: 24px;
  color: #84ABC1;
`;

const Files = styled.div`
  height: 100%;
  display: inline-flex;
  flex-direction: column;
  flex-wrap: wrap;
  position: relative;

  @media (max-width: 768px) and (orientation: portrait) {
    flex-direction: row;
    height: auto;
    font-size: 0.8em;
  }
`;

const File = styled.button`
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

const FileTitle = styled.div`
  font-size: 1.6em;
  color: #84ABC1;
`;

const FileIcon = styled.span`
  font-size: 5em;
  color: #84ABC1;
`;

const WindowContainer = styled.div<{active: boolean}>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: scale(${({ active }) => (active ? '1,1' : '0,0')});
  transition: transform 0.6s;
  display: flex;
`;

const ExitSpace = styled.div`
  flex: 1;
`;

const StyledPanel = styled(Panel)`
  width: 40%;
  margin: 20px 12px;
  opacity: 0.98;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const TextContainer = styled.div<{active: boolean}>`
  padding: 10px;
  opacity: ${({ active }) => (active ? 1 : 0)};
  transition: opacity 1s;
`;

const TextTitle = styled.h1`
  margin-top: 4px;
`;

const TextBody = styled.div`
  font-size: 1.6em;
`;

const CloseButton = styled.button`
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  position: absolute;
  top: -4px;
  right: -4px;

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

const CloseIcon = styled.span`
  font-size: 3em;
  color: #84ABC1;
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
        <FileIcon className="material-icons-sharp">text_snippet</FileIcon>
        <FileTitle>
          {fileName}
        </FileTitle>
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
    <Container active={active}>
      <LogoContainer>
        <AvengersLogo />
      </LogoContainer>
      <Taskbar>
        <LogOff onClick={lock}>
          <LogOffIcon className="material-icons-sharp">lock</LogOffIcon>
        </LogOff>
      </Taskbar>
      <Files>
        {fileNodes}
      </Files>
      <WindowContainer active={show}>
        <ExitSpace onClick={exit} />
        <StyledPanel backgroundColor="#030D15">
          {focus ? (
            <TextContainer active={show}>
              <TextTitle>{textObject[focus].title}</TextTitle>
              <TextBody>{renderRichText(textObject[focus].body)}</TextBody>
            </TextContainer>
          ) : ''}
          <CloseButton onClick={exit}>
            <CloseIcon className="material-icons-sharp">close</CloseIcon>
          </CloseButton>
        </StyledPanel>
        <ExitSpace onClick={exit} />
      </WindowContainer>
    </Container>
  );
};

export default Desktop;
