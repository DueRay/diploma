import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from 'reducers';

let middle = [thunkMiddleware];
if ('production' !== process.env.NODE_ENV) {
  middle.push(createLogger());
}

export let store = null;

export default (preLoadedState) => {
  store = createStore(
    rootReducer,
    preLoadedState,
    applyMiddleware(...middle)
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('reducers', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}
