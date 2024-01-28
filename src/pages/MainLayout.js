import React from 'react';
import { AppBar, Toolbar, Typography, Container, Link } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Copyright } from '../components/Copyright';
const MainLayout = () => {
  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h3">Arman Radmanesh <Typography variant="subtitle1"> <Link href="mailto:Radmanesh@gmail.com">Radmanesh@gmail.com</Link> </Typography></Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 , mb : 2}}>
        <Outlet />
      </Container>

      <footer>
        <Copyright />
      </footer>
    </React.Fragment>
  );
};

export default MainLayout;