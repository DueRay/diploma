import axios from 'axios';

let api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

export const login = (form) => (dispatch, getState) => {
  let user = form || getState().form.login.values;
  return api.post('/login', user)
    .then((response) => {
      dispatch({type: 'SET_USER', user: response.data.user});
      return dispatch(getConfig());
    }, (error) => {
      throw error.response.data.message;
    });
};

export const logout = () => (dispatch) => {
  return api.post('/logout')
    .then(() => dispatch({type: 'RESET_USER'}));
};

export const register = () => (dispatch, getState) => {
  let user = getState().form.registration.values;
  return api.post('/registration', user)
    .then(() => {
      return dispatch(login(user));
    }, (error) => {
      throw error.response.data.message;
    })
};

export const getConfig = () => (dispatch) => {
  return api.get('/config')
    .then((response) => {
      dispatch({type: 'SET_CONFIG', config: response.data});
    }, (error) => {
      throw error.response.data.message;
    });
};

export const getProfile = () => (dispatch) => {
  return api.get('/profile')
    .then((response) => {
      dispatch({type: 'SET_USER', user: response.data});
      return dispatch(getConfig());
    }, (error) => {
      throw error.response.data.message;
    });
};

export const setConfig = () => (dispatch, getState) => {
  let config = getState().form.config.values;
  config.translation_type = parseInt(config.translation_type, 10);
  return api.post('/config', config);
};

export const translate = () => (dispatch, getState) => {
  let form = getState().form.translate.values;
  return api.post('/translate', form)
    .then((response) => dispatch({type: 'SET_RESULT', text: response.data.text}),
      (error) => {
        throw error.response.data.message;
      })
};
