import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import DragDropLayout from './components/templates/DragDropLayout';

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DragDropLayout />
    </ThemeProvider>
  );
};

export default App;
