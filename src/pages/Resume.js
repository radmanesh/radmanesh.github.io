import { Image } from '@mui/icons-material';
import { Typography } from '@mui/material';
import React from 'react';
import PDFContainer from '../components/PDFContainer';
export default function Resume() {
  return (
    <>
      <Typography variant="h4" color="text.secondary" align="center" > Resume </Typography>
      <PDFContainer fileUrl="/cv.pdf" />
      {/* <Image src='/cv1.png'  />
      <Image src='/cv2.png' /> */}
    </>
  );
}