// src/App.tsx
import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Box } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container>
          <Box
            display="flex"
            flexDirection="column"
            minHeight="calc(100vh - 64px)" // Adjust this value based on your Header and Footer heights
            justifyContent="center"
            paddingY={2} // Vertical padding
          >
            <Routes>

              <Route path="/" element={<Home />} />

            </Routes>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
};
export default App;
