import { Image } from '@mui/icons-material';
import { Typography } from '@mui/material';
import React from 'react';
export default function Resume() {
  return (
    <>
      <Typography variant="h4" color="text.secondary" align="center" > Resume </Typography>
      <Image src='/cv1.png'  />
      <Image src='/cv2.png'  />
      <Image src='/cv3.png'  />
    </>
  );
}