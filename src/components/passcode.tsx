// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Panel from './panel';
import ArcReactor from '../images/arcReactor.svg';
import Asgard from '../images/asgard.svg';
import Hydra from '../images/hydra.svg';
import Sanctum from '../images/sanctum.svg';
import Shield from '../images/shield.svg';

const StyledPanel = styled(Panel)<{active: boolean}>`
  width: 100%;
  transform: scale(${({ active }) => (active ? '1,1' : '0,0')});
  transition: transform 1s;
`;

const Title = styled.h1`
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 500;
  text-align: center;
  font-size: 3.6em;
`;

const CodeLine = styled.div`
  display: flex;
  position: relative;
`;

const ButtonLine = styled.div`
  display: flex;
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

const Button = styled.button`
  flex: 1;
  width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1%;  
  margin: 1%;
  background: none;
`;

const EmptyCodeButton = styled(Button)`
  border: 0;
  border-bottom: 2px solid #246E8D;

  :after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;

const CodeButton = styled(EmptyCodeButton)`
  cursor: pointer;

  & > svg {
    :hover {
      fill: #246E8D
    }
  }
`;

const SubmitButton = styled(Button)`
  line-height: 50%;
  border: 0;
  cursor: pointer;
  & > span {
    color: #84ABC1;
  }

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
  :disabled {
    cursor: default;
    & > span {
      color: #246E8D;
    }
  }
`;

const SubmitIcon = styled.span`
  font-size: 6em;
`;

const IconButton = styled(Button)<{ disabled: boolean }>`
  border: 2px solid #246E8D;
  border-radius: 4px;
  cursor: pointer;

  @media (hover: hover) {
    :hover {
      background-color: #246E8D;
    }

    :active {
      background: none;
    }
  }
  @media (hover: none) {
    :active {
      background-color: #246E8D;
    }
  }
  :disabled {
    background: none;
    cursor: default;
  }
`;

const appear = keyframes`
  0% {
    transform: scaleY(0);
  }
  10% {
    transform: scaleY(1);
  }
`;

const Banner = styled.div<{initial: boolean}>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  background-color: #D6224C;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4em;
  user-select: none;
  animation: 1s 2 alternate ${appear} both;
  opacity: ${({ initial }) => (initial ? '0' : '1')};
  pointer-events: ${({ initial }) => (initial ? 'none' : 'auto')};
`;

const Passcode = function ({
  className, code, setCode, checkSolution, active,
}: {
  className?: string,
  code: number[],
  setCode: React.Dispatch<React.SetStateAction<number[]>>,
  checkSolution: () => boolean,
  active: boolean,
}) {
  const [key, setKey] = useState(1);
  const check = () => {
    if (!checkSolution()) {
      setKey(Math.random());
    }
  };
  const disabled = !!code.reduce((prevValue, value) => Math.min(prevValue, value));

  const audio = [
    new Audio('/sounds/back_001.ogg'),
    new Audio('/sounds/forceField_000.ogg'),
    new Audio('/sounds/forceField_001.ogg'),
    new Audio('/sounds/forceField_002.ogg'),
    new Audio('/sounds/forceField_003.ogg'),
    new Audio('/sounds/forceField_004.ogg'),
  ];

  const makeSetCode = (value:number) => () => {
    const changeIndex = code.findIndex((element) => element === 0);
    if (changeIndex !== -1) {
      const newCode = [...code];
      newCode[changeIndex] = value;
      audio[value].play();
      setCode(newCode);
    }
  };

  const makeRemoveCode = (index: number) => () => {
    const newCode = [...code];
    newCode[index] = 0;
    audio[0].play();
    setCode(newCode);
  };

  const codeComponents = code.map((value, index) => {
    switch (value) {
      case 1:
        return (
          <CodeButton
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClick={makeRemoveCode(index)}
          >
            <ArcReactorIcon />
          </CodeButton>
        );
      case 2:
        return (
          <CodeButton
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClick={makeRemoveCode(index)}
          >
            <AsgardIcon />
          </CodeButton>
        );
      case 3:
        return (
          <CodeButton
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClick={makeRemoveCode(index)}
          >
            <HydraIcon />
          </CodeButton>
        );
      case 4:
        return (
          <CodeButton
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClick={makeRemoveCode(index)}
          >
            <SanctumIcon />
          </CodeButton>
        );
      case 5:
        return (
          <CodeButton
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            onClick={makeRemoveCode(index)}
          >
            <ShieldIcon />
          </CodeButton>
        );
      default:
        // eslint-disable-next-line react/no-array-index-key
        return <EmptyCodeButton key={index} />;
    }
  });
  return (
    <StyledPanel backgroundColor="#020F18" className={className} active={active}>
      <Title>ENTER PASSCODE</Title>
      <CodeLine>
        {codeComponents}
        <SubmitButton disabled={!disabled} onClick={check}>
          <SubmitIcon className="material-icons-sharp">
            play_arrow
          </SubmitIcon>
        </SubmitButton>
        <Banner key={key} initial={key === 1}>
          ACCESS DENIED
        </Banner>
      </CodeLine>
      <ButtonLine>
        <IconButton disabled={disabled} onClick={makeSetCode(1)}>
          <ArcReactorIcon />
        </IconButton>
        <IconButton disabled={disabled} onClick={makeSetCode(2)}>
          <AsgardIcon />
        </IconButton>
        <IconButton disabled={disabled} onClick={makeSetCode(3)}>
          <HydraIcon />
        </IconButton>
        <IconButton disabled={disabled} onClick={makeSetCode(4)}>
          <SanctumIcon />
        </IconButton>
        <IconButton disabled={disabled} onClick={makeSetCode(5)}>
          <ShieldIcon />
        </IconButton>
      </ButtonLine>
    </StyledPanel>
  );
};

export default Passcode;
