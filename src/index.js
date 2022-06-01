import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { authSettings } from './AppSettings';
import history from './Services/history';
import App from './Components/App';

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo
      ? appState.returnTo
      : window.location.pathname,
  );
};

const providerConfig = {
  domain: authSettings.domain || process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: authSettings.client_id || process.env.REACT_APP_AUTH0.CLIENT_ID,
  audience: authSettings.audience,
  redirectUri: authSettings.redirect_uri,
  onRedirectCallback,
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Auth0Provider {...providerConfig}>
    <App />
  </Auth0Provider>,
);
