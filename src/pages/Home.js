import { Typography } from '@mui/material';
import React , { useEffect, useState} from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  return(
    <Typography variant="h4" color="text.secondary" align="center"> User Profile </Typography>
  )
}
