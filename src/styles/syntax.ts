export const defaultColor = '#246E8D';
const secondaryColor = '#2b2b2b';
const commentColor = '#d4d0ab';
const punctuationColor = '#fefefe';
const propertyColor = '#ffa07a';
const booleanColor = '#84ABC1';
const selectorColor = '#3BB1CC';
const functionColor = '#D6224C';

export const extras = {
  'code[class*="language-"]': {
    color: defaultColor,
    background: 'none',
    fontFamily: 'Roboto Mono',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1',
    fontSize: '0.8em',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: defaultColor,
    background: 'none',
    fontFamily: 'Roboto Mono',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1',
    fontSize: '0.8em',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    margin: '0',
    padding: '0 1em',
    overflow: 'hidden',
  },
  ':not(pre) > code[class*="language-"]': {
    background: secondaryColor,
    padding: '0.1em',
    borderRadius: '0.3em',
    whiteSpace: 'normal',
  },
};

interface SyntaxElement {
  color?: string
  fontWeight?: string
  fontStyle?: string
  cursor?: string
}

export const syntax:Record<string, SyntaxElement> = {
  comment: {
    color: commentColor,
  },
  prolog: {
    color: commentColor,
  },
  doctype: {
    color: commentColor,
  },
  cdata: {
    color: commentColor,
  },
  punctuation: {
    color: punctuationColor,
  },
  property: {
    color: propertyColor,
  },
  tag: {
    color: propertyColor,
  },
  constant: {
    color: propertyColor,
  },
  symbol: {
    color: propertyColor,
  },
  deleted: {
    color: propertyColor,
  },
  boolean: {
    color: booleanColor,
  },
  number: {
    color: booleanColor,
  },
  selector: {
    color: selectorColor,
  },
  'attr-name': {
    color: selectorColor,
  },
  string: {
    color: selectorColor,
  },
  char: {
    color: selectorColor,
  },
  builtin: {
    color: selectorColor,
  },
  inserted: {
    color: selectorColor,
  },
  operator: {
    color: booleanColor,
  },
  entity: {
    color: booleanColor,
    cursor: 'help',
  },
  url: {
    color: booleanColor,
  },
  '.language-css .token.string': {
    color: booleanColor,
  },
  '.style .token.string': {
    color: booleanColor,
  },
  variable: {
    color: booleanColor,
  },
  atrule: {
    color: functionColor,
  },
  'attr-value': {
    color: functionColor,
  },
  function: {
    color: functionColor,
  },
  keyword: {
    color: booleanColor,
  },
  regex: {
    color: functionColor,
  },
  important: {
    color: functionColor,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
};
