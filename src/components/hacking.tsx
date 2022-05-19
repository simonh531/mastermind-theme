import React, {
  useState, useEffect, useRef,
} from 'react';
import { Box, styled } from '@mui/material';
import { useStaticQuery, graphql } from 'gatsby';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import {
  Application, Sprite, Texture,
} from 'pixi.js';
import { syntax, defaultColor } from '../styles/syntax';
import Panel from './panel';

const fontSize = 20;

const regexType = /"token (.+?)"/;
const regexStyle = /<span class=("token.+?")>/g;

const HiddenCanvas = styled('canvas')({
  display: 'none',
});

const Canvas = styled('canvas')({
  width: '1000px',
  height: '1000px',
});

const Hacking = function ({ active } : {
  active: boolean,
}) {
  const queryResult = useStaticQuery(graphql`
    query HackerCode {
      allContentfulHackerCodeCodeTextNode {
        edges {
          node {
            code
          }
        }
      }
    }
  `);
  const { edges } = queryResult.allContentfulHackerCodeCodeTextNode;
  const [fontsReady, setFontsReady] = useState(false);
  const [ready, setReady] = useState(false);
  const spritesRef = useRef<Sprite[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application|null>(null);
  const hiddenCanvasRef = useRef<(HTMLCanvasElement|null)[]>([]);

  useEffect(() => {
    async function awaitFontsReady() {
      await document.fonts.ready;
      setFontsReady(true);
    }
    awaitFontsReady();
  }, []);

  useEffect(() => {
    if (fontsReady && hiddenCanvasRef.current.length === edges.length && document.fonts.check('1em Roboto Mono')) {
      edges.forEach(({ node: { code } }:{ node: { code: string }}, index:number) => {
        const hiddenCanvas = hiddenCanvasRef.current[index];
        if (hiddenCanvas && !spritesRef.current[index]) {
          const ctx = hiddenCanvas.getContext('2d');
          if (ctx) {
            ctx.canvas.width = 2000;
            ctx.canvas.height = code.split('\n').length * (fontSize + 4);
            ctx.textBaseline = 'hanging';
            ctx.font = `${fontSize}px Roboto Mono`;
            const codeSlices = highlight(code, languages.tsx, 'tsx').split(regexStyle);
            let lineX = 0;
            let lineY = 0;
            codeSlices.forEach((codeSlice) => {
              const type = regexType.exec(codeSlice);
              if (type && type[1]) {
                const syntaxType = syntax[type[1]];
                if (syntaxType && syntaxType.color) {
                  ctx.fillStyle = syntaxType.color;
                } else {
                  ctx.fillStyle = defaultColor;
                }
              } else {
                const replaceAmp = codeSlice.replaceAll('&amp;', '&');
                const replaceLt = replaceAmp.replaceAll('&lt;', '<');
                const codeLines = replaceLt.split(('\n'));
                const firstLine = codeLines.shift() || '';
                const firstLineSpanCheck = firstLine.split('</span>');
                firstLineSpanCheck.forEach((linePart, jndex) => {
                  if (jndex > 0) {
                    ctx.fillStyle = defaultColor;
                  }
                  ctx.fillText(linePart, lineX, lineY);
                  lineX += ctx.measureText(linePart).width;
                });
                codeLines.forEach((line) => {
                  lineY += (fontSize + 4);
                  lineX = 0;
                  const lineSpanCheck = line.split('</span>');
                  lineSpanCheck.forEach((linePart, jndex) => {
                    if (jndex > 0) {
                      ctx.fillStyle = defaultColor;
                    }
                    ctx.fillText(linePart, lineX, lineY);
                    lineX += ctx.measureText(linePart).width;
                  });
                });
              }
            });
            const sprite = new Sprite(Texture.from(hiddenCanvas));
            spritesRef.current[index] = sprite;
          }
        }
      });
      if (spritesRef.current.length === edges.length) {
        setReady(true);
      }
    }
  }, [hiddenCanvasRef.current.length, fontsReady]);

  useEffect(() => {
    if (ready && canvasRef.current && !appRef.current) {
      const app = new Application({
        view: canvasRef.current,
        backgroundAlpha: 0,
        width: 2000,
        height: 2000,
      });
      spritesRef.current.forEach((sprite) => {
        // eslint-disable-next-line no-param-reassign
        sprite.x = 2000;
        app.stage.addChild(sprite);
      });
      let activeSprite = Math.floor(Math.random() * spritesRef.current.length);
      let nextSprite = Math.floor(Math.random() * (spritesRef.current.length - 1));
      if (nextSprite >= activeSprite) {
        nextSprite += 1;
      }
      spritesRef.current[activeSprite].x = 0;
      spritesRef.current[nextSprite].x = 0;
      spritesRef.current[nextSprite].y = spritesRef.current[activeSprite].height;

      app.ticker.add((delta) => {
        spritesRef.current[activeSprite].y -= delta * 20;
        spritesRef.current[nextSprite].y -= delta * 20;
        if (spritesRef.current[nextSprite].y < 0) {
          spritesRef.current[activeSprite].y = 0;
          spritesRef.current[activeSprite].x = 2000;
          activeSprite = nextSprite;
          nextSprite = Math.floor(Math.random() * (spritesRef.current.length - 1));
          if (nextSprite >= activeSprite) {
            nextSprite += 1;
          }
          spritesRef.current[nextSprite].x = 0;
          spritesRef.current[nextSprite].y = spritesRef.current[activeSprite].height;
        }
      });
      appRef.current = app;
    }
  }, [canvasRef.current, ready]);

  if (!fontsReady) {
    return null;
  }
  return (
    <Panel
      sx={{
        width: 'calc(100% - 16px)',
        height: 'calc(100% - 16px)',
        transform: `scale(${active ? '1,1' : '0,0'})`,
        transition: 'transform 1s',
        fontFamily: 'Roboto Mono',
      }}
    >
      <Box sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
      >
        <Canvas ref={canvasRef} />
        {edges.map(
          (_:never, index:number) => (
            // eslint-disable-next-line react/no-array-index-key
            <HiddenCanvas key={index} ref={(ref) => { hiddenCanvasRef.current[index] = ref; }} />
          ),
        )}
      </Box>
    </Panel>
  );
};

export default Hacking;
