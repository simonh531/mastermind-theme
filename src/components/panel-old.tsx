// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import styled from 'styled-components';

const borderWidth = 6;
const paddingWidth = 16 - borderWidth;

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${borderWidth}px ${paddingWidth}px auto ${paddingWidth}px ${borderWidth}px;
  grid-template-rows: ${borderWidth}px ${paddingWidth}px auto ${paddingWidth}px ${borderWidth}px;
  grid-template-areas:
    "top-left-corner top-left-corner top-edge top-right-corner top-right-corner"
    "top-left-corner top-left-corner top-space top-right-corner top-right-corner"
    "left-edge left-space content right-space right-edge"
    "bottom-left-corner bottom-left-corner bottom-space bottom-right-corner bottom-right-corner"
    "bottom-left-corner bottom-left-corner bottom-edge bottom-right-corner bottom-right-corner";
`;

const Border = styled.div<{ area: string}>`
  width: 100%;
  height: 100%;
  background-color: #84ABC1;
  grid-area: ${({ area }) => area}-edge;
`;

const Content = styled.div<{ backgroundColor: string }>`
  grid-area: content;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const TriangleContainer = styled(Container)<{ verticalArea: string, horizontalArea: string }>`
  grid-area: ${({ verticalArea, horizontalArea }) => `${verticalArea}-${horizontalArea}`}-corner;
`;

const Triangle = styled.div<{ verticalArea: string, horizontalArea: string, color: string, size: string }>`
  width: 0;
  height: 0;
  background-clip: padding-box;
  border-top: ${({ size }) => size}px solid ${({ verticalArea, color }) => (verticalArea === 'bottom' ? color : 'transparent')};
  border-right: ${({ size }) => size}px solid ${({ horizontalArea, color }) => (horizontalArea === 'left' ? color : 'transparent')};
  border-bottom: ${({ size }) => size}px solid ${({ verticalArea, color }) => (verticalArea === 'top' ? color : 'transparent')};
  border-left: ${({ size }) => size}px solid ${({ horizontalArea, color }) => (horizontalArea === 'right' ? color : 'transparent')};
  position: absolute;
  ${({ verticalArea }) => (verticalArea === 'top' ? 'bottom' : 'top')}: 0;
  ${({ horizontalArea }) => (horizontalArea === 'left' ? 'right' : 'left')}: 0;
`;

const Corner = function (
  { verticalArea, horizontalArea, backgroundColor }: {
    verticalArea: string, horizontalArea: string, backgroundColor: string
  },
) {
  return (
    <TriangleContainer verticalArea={verticalArea} horizontalArea={horizontalArea}>
      <Triangle verticalArea={verticalArea} horizontalArea={horizontalArea} color="#84ABC1" size="8" />
      <Triangle verticalArea={verticalArea} horizontalArea={horizontalArea} color={backgroundColor} size={`${(16 - Math.sqrt(2) * borderWidth) / 2}`} />
    </TriangleContainer>
  );
};

const PaddingContainer = styled(Container)<{ area: string, backgroundColor: string }>`
  grid-area: ${({ area }) => area}-space;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const Padding = function (
  { area, backgroundColor }: { area: string, backgroundColor: string },
) {
  const size = (((Math.sqrt(2) - 1) * borderWidth) / 2).toPrecision(8);
  return (
    <PaddingContainer area={area} backgroundColor={backgroundColor}>
      <Triangle
        verticalArea={area === 'bottom' || area === 'left' ? 'top' : 'bottom'}
        horizontalArea={area === 'right' || area === 'bottom' ? 'left' : 'right'}
        color="#84ABC1"
        size={size}
      />
      <Triangle
        verticalArea={area === 'bottom' || area === 'right' ? 'top' : 'bottom'}
        horizontalArea={area === 'right' || area === 'top' ? 'left' : 'right'}
        color="#84ABC1"
        size={size}
      />
    </PaddingContainer>
  );
};

const Panel = function (
  { children, backgroundColor }: { children: React.ReactNode, backgroundColor:string },
) {
  return (
    <Grid>
      <Content backgroundColor={backgroundColor}>
        {children}
      </Content>
      <Corner verticalArea="top" horizontalArea="left" backgroundColor={backgroundColor} />
      <Padding area="top" backgroundColor={backgroundColor} />
      <Border area="top" />
      <Corner verticalArea="top" horizontalArea="right" backgroundColor={backgroundColor} />
      <Padding area="right" backgroundColor={backgroundColor} />
      <Border area="right" />
      <Corner verticalArea="bottom" horizontalArea="right" backgroundColor={backgroundColor} />
      <Padding area="bottom" backgroundColor={backgroundColor} />
      <Border area="bottom" />
      <Corner verticalArea="bottom" horizontalArea="left" backgroundColor={backgroundColor} />
      <Padding area="left" backgroundColor={backgroundColor} />
      <Border area="left" />
    </Grid>
  );
};

export default Panel;
