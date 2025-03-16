import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Import pages
import HomePage from './pages/HomePage';
import QueryListPage from './pages/QueryListPage.js';
import QueryDetailPage from './pages/QueryDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Import components
import MainLayout from './components/layouts/MainLayout';

// Custom theme
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e0f5ff',
      100: '#b8e2ff',
      200: '#8dcfff',
      300: '#61bcff',
      400: '#36a9ff',
      500: '#1c90e6', // Primary color
      600: '#0071cc',
      700: '#0052a3',
      800: '#00357a',
      900: '#001952',
    },
    paper: {
      50: '#f8fafc',
      100: '#f1f5f9',
    }
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/queries" element={<QueryListPage />} />
            <Route path="/queries/:id" element={<QueryDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </ChakraProvider>
  );
}

export default App;