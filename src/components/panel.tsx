import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, styled } from '@mui/material';

const borderWidth = 3;
const cornerOffset = (3 / Math.cos(Math.PI / 8)) * Math.sin(Math.PI / 8); // (Math.sqrt(2) / 2);
const paddingWidth = 8;

class Corners {
  x:number;

  y:number;

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }

  center() {
    return `${this.x},${this.y}`;
  }

  left(distance:number) {
    return `${this.x - distance},${this.y}`;
  }

  right(distance:number) {
    return `${this.x + distance},${this.y}`;
  }

  up(distance:number) {
    return `${this.x},${this.y - distance}`;
  }

  down(distance:number) {
    return `${this.x},${this.y + distance}`;
  }
}

const topLeft = new Corners(0, 0);
const topRight = new Corners(0, 8);
const bottomRight = new Corners(8, 8);
const bottomLeft = new Corners(8, 0);

const SvgCorner = styled('svg')(({ verticalSide, horizontalSide }:{ verticalSide: string, horizontalSide: string }) => ({
  width: `${paddingWidth}px`,
  height: `${paddingWidth}px`,
  position: 'absolute',
  [verticalSide]: '-8px',
  [horizontalSide]: '-8px',
}));
function Corner({ verticalSide, horizontalSide }:{
  verticalSide: 'top' | 'bottom'
  horizontalSide: 'left' | 'right'
}) {
  const theme = useTheme();
  let backgroundPoints;
  if (verticalSide === 'top' && horizontalSide === 'left') {
    backgroundPoints = `0,${paddingWidth} ${paddingWidth},0 ${paddingWidth},${paddingWidth}`;
  } else if (verticalSide === 'top' && horizontalSide === 'right') {
    backgroundPoints = `0,0 ${paddingWidth},${paddingWidth} 0,${paddingWidth}`;
  } else if (verticalSide === 'bottom' && horizontalSide === 'right') {
    backgroundPoints = `0,${paddingWidth} ${paddingWidth},0 0,0`;
  } else { // verticalSide === 'bottom' && horizontalSide === 'left'
    backgroundPoints = `0,0 ${paddingWidth},${paddingWidth} ${paddingWidth},0`;
  }
  let points;
  if (verticalSide === 'top' && horizontalSide === 'left') {
    points = `${bottomLeft.center()} ${bottomLeft.up(cornerOffset)} ${topRight.left(cornerOffset)} ${topRight.center()} ${topRight.down(borderWidth)} ${bottomLeft.right(borderWidth)}`;
  } else if (verticalSide === 'top' && horizontalSide === 'right') {
    points = `${topLeft.center()} ${topLeft.right(cornerOffset)} ${bottomRight.up(cornerOffset)} ${bottomRight.center()} ${bottomRight.left(borderWidth)} ${topLeft.down(borderWidth)}`;
  } else if (verticalSide === 'bottom' && horizontalSide === 'right') {
    points = `${topRight.center()} ${topRight.down(cornerOffset)} ${bottomLeft.right(cornerOffset)} ${bottomLeft.center()} ${bottomLeft.up(borderWidth)} ${topRight.left(borderWidth)}`;
  } else { // verticalSide === 'bottom' && horizontalSide === 'left'
    points = `${bottomRight.center()} ${bottomRight.left(cornerOffset)} ${topLeft.down(cornerOffset)} ${topLeft.center()} ${topLeft.right(borderWidth)} ${bottomRight.up(borderWidth)}`;
  }
  return (
    <SvgCorner
      viewBox={`0 0 ${paddingWidth} ${paddingWidth}`}
      verticalSide={verticalSide}
      horizontalSide={horizontalSide}
    >
      <polygon
        points={backgroundPoints}
        fill={theme.palette.primary.main}
        strokeWidth="0"
      />
      <polygon
        points={points}
        fill={theme.palette.secondary.main}
        strokeWidth="0"
      />
    </SvgCorner>
  );
}

const Padding = styled('div')<{ area: string }>(({ area, theme }) => ({
  width: area === 'top' || area === 'bottom' ? '100%' : `${paddingWidth}px`,
  height: area === 'top' || area === 'bottom' ? `${paddingWidth}px` : '100%',
  position: 'absolute',
  backgroundColor: theme.palette.primary.main,
  [area]: `-${paddingWidth}px`,
  [`border-${area}`]: `${borderWidth}px solid ${theme.palette.secondary.main}`,
  ...area === 'left' || area === 'right' ? { top: '0' } : {},
}));

const Panel = function (
  {
    children, scroll, sx,
  }: {
    children: React.ReactNode,
    sx?:Record<string, string|Record<string, string>>,
    scroll?: boolean,
  },
) {
  return (
    <Box
      sx={{
        position: 'relative',
        margin: '8px',
        backgroundColor: 'primary.main',
        ...sx,
      }}
    >
      <Padding area="top" />
      <Padding area="right" />
      <Padding area="bottom" />
      <Padding area="left" />
      <Corner verticalSide="top" horizontalSide="left" />
      <Corner verticalSide="top" horizontalSide="right" />
      <Corner verticalSide="bottom" horizontalSide="right" />
      <Corner verticalSide="bottom" horizontalSide="left" />
      <Box
        sx={{
          height: '100%',
          width: '100%',
          overflowY: scroll ? 'scroll' : 'auto',
          maxHeight: '100%',
          /* width */
          '&::-webkit-scrollbar': { width: '3px' },
          /* Track */
          '&::-webkit-scrollbar-track': { backgroundColor: 'primary.main' },
          /* Handle */
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'secondary.main' },
          /* Handle on hover */
          '&::-webkit-scrollbar-thumb:hover': { backgroundColor: 'secondary.dark' },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Panel;
