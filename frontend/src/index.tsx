import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';

import 'index.css';
import App from 'App';
import Loading from 'components/Loading';

import store from 'services/store';

/* store to persist */
const persistedStore = persistStore(store);

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistedStore}>
      <App />
    </PersistGate>
  </Provider>
);
