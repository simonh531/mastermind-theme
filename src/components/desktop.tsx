// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
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
`;

const Taskbar = styled.div`
  background-color: #246E8D;
  width: 30px;
  height: 100%;
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
  flex: 1;
  display: flex;
  align-items: flex-start;
  position: relative;
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

const text:Record<string, {title: string, body: string}> = {
  test1: {
    title: 'Lorem ipsum',
    body: 'Dolor sit amet',
  },
  test2: {
    title: 'Consectetur',
    body: 'Adipiscing elit',
  },
};

const Desktop = function ({ active, lock }: {
  active: boolean,
  lock: () => void,
}) {
  const [focus, setFocus] = useState('');
  const [show, setShow] = useState(false);

  const open = (file:string) => () => {
    setFocus(file);
    setShow(true);
  };

  return (
    <Container active={active}>
      <LogoContainer>
        <AvengersLogo />
      </LogoContainer>
      <Taskbar>
        <LogOff onClick={lock}>
          <LogOffIcon className="material-icons">lock</LogOffIcon>
        </LogOff>
      </Taskbar>
      <Files>
        <File onClick={open('test1')}>
          <FileIcon className="material-icons">text_snippet</FileIcon>
          <FileTitle>
            Test 1
          </FileTitle>
        </File>
        <File onClick={open('test2')}>
          <FileIcon className="material-icons">text_snippet</FileIcon>
          <FileTitle>
            Test 2
          </FileTitle>
        </File>
        <WindowContainer active={show}>
          <ExitSpace onClick={() => setShow(false)} />
          <StyledPanel backgroundColor="#030D15">
            {focus ? (
              <TextContainer active={show}>
                <TextTitle>{text[focus].title}</TextTitle>
                <TextBody>{text[focus].body}</TextBody>
              </TextContainer>
            ) : ''}
            <CloseButton onClick={() => setShow(false)}>
              <CloseIcon className="material-icons">close</CloseIcon>
            </CloseButton>
          </StyledPanel>
          <ExitSpace onClick={() => setShow(false)} />
        </WindowContainer>
      </Files>
    </Container>
  );
};

export default Desktop;
