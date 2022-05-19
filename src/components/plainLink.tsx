import { styled } from '@mui/material';
import { Link } from 'gatsby';

export default styled(Link)<{ noHover?: boolean }>(({ noHover }) => ({
  color: 'inherit',
  textDecoration: 'none ',
  ...noHover ? {} : {
    '&:hover': { textDecoration: 'underline' },
  },
}));
