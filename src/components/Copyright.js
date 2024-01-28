import React from 'react';
import { Typography, Link } from '@mui/material';

export function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      Copyright &copy;
      <Link color="inherit" href="mailto://Radmanesh@gmail.com">
        Arman Radmanesh {'<radmanesh@gmail.com>'} 
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
