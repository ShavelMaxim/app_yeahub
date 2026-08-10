import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from '@/app/App';
import { AuthBootstrap } from '@/app/providers/AuthBootstrap';
import { store } from '@/app/store';
import '@/app/styles/global.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element was not found');

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <AuthBootstrap>
        <App />
      </AuthBootstrap>
    </Provider>
  </StrictMode>,
);
