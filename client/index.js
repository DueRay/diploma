import './styles/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import App from 'components/App';
import configureStore from './stores';
import { getProfile } from 'actions';

let initState = {
  authorized: false
};

let store = configureStore(initState);

const render = (Component) => {
  ReactDOM.render(<AppContainer>
      <Provider store={store}>
        <Component/>
      </Provider>
    </AppContainer>,
    document.getElementById('app')
  );
};

store.dispatch(getProfile())
  .then(() => render(App), () => render(App));

if (module.hot) {
  module.hot.accept('./components/App', () => {
    render(App)
  });
}
