// eslint-disable-next-line no-use-before-define
import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { keyframes } from '@emotion/react';
import Panel from './panel';
import ArcReactor from '../images/arcReactor.svg';
import Asgard from '../images/asgard.svg';
import Hydra from '../images/hydra.svg';
import Sanctum from '../images/sanctum.svg';
import Shield from '../images/shield.svg';
import PlainLink from './plainLink';

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

const ShieldIcon = styled(Shield)`
  fill: #84ABC1;
  width: auto;
  height: auto;
`;

const Button = styled('button')({
  flex: '1',
  width: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1%',
  margin: '1%',
  background: 'none',
});

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

const SubmitButton = styled(Button)({
  lineHeight: '50%',
  border: '0',
  cursor: 'pointer',
  '& > span': {
    color: '#84ABC1',
  },
  '@media (hover: hover)': {
    ':hover': {
      '& > span': {
        color: '#246E8D',
      },
    },
    ':active': {
      '& > span': {
        color: '#84ABC1',
      },
    },
  },
  '@media (hover: none)': {
    ':active': {
      '& > span': {
        color: '#246E8D',
      },
    },
  },
  ':disabled': {
    cursor: 'default',
    '& > span': {
      color: '#246E8D',
    },
  },
});

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

const Passcode = function ({
  code, setCode, checkSolution, active,
}: {
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
  const audio = useRef<null|HTMLAudioElement[]>(null);
  useEffect(() => {
    audio.current = [
      new Audio('/sounds/back_001.ogg'),
      new Audio('/sounds/forceField_000.ogg'),
      new Audio('/sounds/forceField_001.ogg'),
      new Audio('/sounds/forceField_002.ogg'),
      new Audio('/sounds/forceField_003.ogg'),
      new Audio('/sounds/forceField_004.ogg'),
    ];
  }, []);

  const makeSetCode = (value:number) => () => {
    const changeIndex = code.findIndex((element) => element === 0);
    if (changeIndex !== -1) {
      const newCode = [...code];
      newCode[changeIndex] = value;
      if (audio.current) {
        audio.current[value].pause();
        audio.current[value].currentTime = 0;
        audio.current[value].play();
      }
      setCode(newCode);
    }
  };

  const makeRemoveCode = (index: number) => () => {
    const newCode = [...code];
    newCode[index] = 0;
    if (audio.current) {
      audio.current[0].pause();
      audio.current[0].currentTime = 0;
      audio.current[0].play();
    }
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
    <Panel sx={{
      width: '100%',
      transform: `scale(${active ? '1,1' : '0,0'})`,
      transition: 'transform 1s',
    }}
    >
      <Typography sx={{
        color: 'secondary.main',
        marginTop: '10px',
        marginBottom: '10px',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: {
          xs: '2em',
          mobileSm: '3.2em',
          mobileLg: '5em',
          sm: '2em',
          md: '3.2em',
          lg: '4em',
          xl: '4.8em',
        },
      }}
      >
        ENTER PASSCODE
      </Typography>
      <Box sx={{
        display: 'flex',
        position: 'relative',
      }}
      >
        {codeComponents}
        <SubmitButton disabled={!disabled} onClick={check}>
          <Box
            className="material-icons-sharp"
            component="span"
            sx={{
              fontSize: {
                xs: '2em',
                mobileSm: '3.2em',
                mobileLg: '5em',
                sm: '3.2em',
                md: '5em',
                lg: '6.8em',
                xl: '10em',
              },
            }}
          >
            play_arrow
          </Box>
        </SubmitButton>
        <Typography
          key={key}
          sx={{
            position: 'absolute',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
            overflow: 'hidden',
            backgroundColor: 'error.main',
            color: 'secondary.main',
            fontWeight: '700',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: {
              xs: '2em',
              mobileSm: '3.2em',
              mobileLg: '5em',
              sm: '2em',
              md: '3.2em',
              lg: '4em',
              xl: '4.8em',
            },
            userSelect: 'none',
            animation: `1s 2 alternate ${appear} both`,
            opacity: key === 1 ? '0' : '1',
            pointerEvents: key === 1 ? 'none' : 'auto',
          }}
        >
          ACCESS DENIED
        </Typography>
      </Box>
      <Box sx={{
        display: 'flex',
      }}
      >
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
      </Box>
      <Box sx={{
        position: 'absolute',
        top: 'calc(100% + 16px)',
        left: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '1em',
      }}
      >
        <PlainLink to="/">
          <Typography sx={{
            color: 'secondary.main',
            fontSize: '1.2em',
            textDecoration: 'inherit',
          }}
          >
            About
          </Typography>
        </PlainLink>
      </Box>
    </Panel>
  );
};

export default Passcode;
