// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import styled from 'styled-components';

const borderWidth = 1;
const paddingWidth = 16 - borderWidth;
const diagonal = Math.sqrt(paddingWidth * paddingWidth * 2);

const Content = styled.div<{ backgroundColor: string }>`
  position: relative;
  background-color: ${({ backgroundColor }) => backgroundColor};
  filter:
    /* drop-shadow(-${borderWidth}px -${borderWidth}px #84ABC1)   */
    drop-shadow(${borderWidth}px -${borderWidth}px #84ABC1) 
    drop-shadow(${borderWidth}px ${borderWidth}px #84ABC1) 
    drop-shadow(-${borderWidth}px ${borderWidth}px #84ABC1);
    
    /* drop-shadow(-${borderWidth}px -${borderWidth}px #84ABC1) drop-shadow(0 -${borderWidth}px #84ABC1) 
    drop-shadow(${borderWidth}px -${borderWidth}px #84ABC1) drop-shadow(${borderWidth}px 0 #84ABC1)
    drop-shadow(${borderWidth}px ${borderWidth}px #84ABC1) drop-shadow(0 ${borderWidth}px #84ABC1) 
    drop-shadow(-${borderWidth}px ${borderWidth}px #84ABC1) drop-shadow(-${borderWidth}px 0 #84ABC1); */
`;

const Padding = styled.div<{ area: string, backgroundColor: string }>`
  width: ${({ area }) => (area === 'top' || area === 'bottom' ? '100%' : `${paddingWidth}px`)};
  height: ${({ area }) => (area === 'top' || area === 'bottom' ? `${paddingWidth}px` : '100%')};
  position: absolute;
  ${({ area }) => `${area}: -${paddingWidth}px`};
  ${({ area }) => (area === 'left' || area === 'right' ? 'top: 0;' : '')}
  ${({ backgroundColor }) => backgroundColor};
`;

const Corner = styled.div<{ verticalArea: string, horizontalArea: string, backgroundColor: string }>`
  width: ${paddingWidth}px;
  height: ${diagonal}px;
  transform-origin: ${({ horizontalArea }) => horizontalArea} center;
  transform: rotate(${({ verticalArea, horizontalArea }) => ((
    (verticalArea === 'top' && horizontalArea === 'left')
    || (verticalArea === 'bottom' && horizontalArea === 'right')
  ) ? '' : '-')}45deg);
  position: absolute;
  ${({ verticalArea }) => `${verticalArea}: -${(paddingWidth + diagonal) / 2}px`};
  ${({ horizontalArea }) => `${horizontalArea}: -${(paddingWidth) / 2}px`};
  background-color: ${({ backgroundColor }) => backgroundColor}; 
`;

const Panel = function (
  { children, backgroundColor }: { children: React.ReactNode, backgroundColor:string },
) {
  return (
    <Content backgroundColor={backgroundColor}>
      {children}
      <Padding area="top" backgroundColor={backgroundColor} />
      <Padding area="right" backgroundColor={backgroundColor} />
      <Padding area="bottom" backgroundColor={backgroundColor} />
      <Padding area="left" backgroundColor={backgroundColor} />
      <Corner verticalArea="top" horizontalArea="left" backgroundColor={backgroundColor} />
      <Corner verticalArea="top" horizontalArea="right" backgroundColor={backgroundColor} />
      <Corner verticalArea="bottom" horizontalArea="right" backgroundColor={backgroundColor} />
      <Corner verticalArea="bottom" horizontalArea="left" backgroundColor={backgroundColor} />
    </Content>
  );
};

export default Panel;
