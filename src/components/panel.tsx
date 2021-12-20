// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import styled from 'styled-components';

const borderWidth = 3;
const paddingWidth = 8;
const diagonal = Math.sqrt(paddingWidth * paddingWidth * 2);

const Container = styled.div<{ backgroundColor: string }>`
  position: relative;
  margin: 8px;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const Padding = styled.div<{ area: string, backgroundColor: string }>`
  width: ${({ area }) => (area === 'top' || area === 'bottom' ? '100%' : `${paddingWidth}px`)};
  height: ${({ area }) => (area === 'top' || area === 'bottom' ? `${paddingWidth}px` : '100%')};
  position: absolute;
  ${({ area }) => `${area}: -${paddingWidth}px`};
  ${({ area }) => (area === 'left' || area === 'right' ? 'top: 0;' : '')}
  ${({ area }) => `border-${area}: ${borderWidth}px solid #84ABC1;`}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const Corner = styled.div<{ verticalArea: string, horizontalArea: string, backgroundColor: string }>`
  width: ${paddingWidth}px;
  height: ${diagonal}px;
  ${({ horizontalArea }) => `border-${horizontalArea}: ${borderWidth}px solid #84ABC1;`}
  transform-origin: ${({ horizontalArea }) => horizontalArea} center;
  transform: rotate(${({ verticalArea, horizontalArea }) => ((
    (verticalArea === 'top' && horizontalArea === 'left')
    || (verticalArea === 'bottom' && horizontalArea === 'right')
  ) ? '' : '-')}45deg);
  position: absolute;
  ${({ verticalArea }) => `${verticalArea}: -${(paddingWidth + diagonal) / 2}px`};
  ${({ horizontalArea }) => `${horizontalArea}: -${(paddingWidth) / 2}px`};
  background-color: transparent;
  /* background-color: ${({ backgroundColor }) => backgroundColor};  */
`;

const Triangle = styled.div<{ verticalArea: string, horizontalArea: string, color: string }>`
  width: 0;
  height: 0;
  background-clip: padding-box;
  border-top: ${borderWidth}px solid ${({ verticalArea, color }) => (verticalArea === 'bottom' ? color : 'transparent')};
  border-right: ${borderWidth}px solid ${({ horizontalArea, color }) => (horizontalArea === 'left' ? color : 'transparent')};
  border-bottom: ${borderWidth}px solid ${({ verticalArea, color }) => (verticalArea === 'top' ? color : 'transparent')};
  border-left: ${borderWidth}px solid ${({ horizontalArea, color }) => (horizontalArea === 'right' ? color : 'transparent')};
  position: absolute;
  ${({ verticalArea }) => `${verticalArea}:${-borderWidth * 2}px`};
  ${({ horizontalArea }) => `${horizontalArea}:${-borderWidth * 2}px`};
`;

const Content = styled.div<{ backgroundColor: string, scroll: undefined | boolean }>`
  overflow-y: ${({ scroll }) => (scroll ? 'scroll' : 'auto')};
  max-height: 100%;

  /* width */
  &::-webkit-scrollbar {
    width: 3px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: ${({ backgroundColor }) => backgroundColor}; 
  }
  
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #84ABC1; 
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #246E8D; 
  }
`;

const Panel = function (
  {
    children, backgroundColor, className, scroll,
  }: {
    children: React.ReactNode, backgroundColor:string, className?: string, scroll?: boolean
  },
) {
  return (
    <Container backgroundColor={backgroundColor} className={className}>
      <Triangle verticalArea="top" horizontalArea="left" color={backgroundColor} />
      <Triangle verticalArea="top" horizontalArea="right" color={backgroundColor} />
      <Triangle verticalArea="bottom" horizontalArea="right" color={backgroundColor} />
      <Triangle verticalArea="bottom" horizontalArea="left" color={backgroundColor} />
      <Padding area="top" backgroundColor={backgroundColor} />
      <Padding area="right" backgroundColor={backgroundColor} />
      <Padding area="bottom" backgroundColor={backgroundColor} />
      <Padding area="left" backgroundColor={backgroundColor} />
      <Corner verticalArea="top" horizontalArea="left" backgroundColor={backgroundColor} />
      <Corner verticalArea="top" horizontalArea="right" backgroundColor={backgroundColor} />
      <Corner verticalArea="bottom" horizontalArea="right" backgroundColor={backgroundColor} />
      <Corner verticalArea="bottom" horizontalArea="left" backgroundColor={backgroundColor} />
      <Content backgroundColor={backgroundColor} scroll={scroll}>
        {children}
      </Content>
    </Container>
  );
};

export default Panel;
