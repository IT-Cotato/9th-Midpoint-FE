import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/shared/global-style';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { theme } from './styles/shared/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
