import { ThemeProvider } from 'styled-components';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.tsx';
import { theme } from './styles/shared/theme.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
