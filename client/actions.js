import axios from 'axios';

let api = axios.create({
  baseURL: 'http://localhost:5000'
});

export const login = (form) => (dispatch, getState) => {
  let user = form || getState().form.login.values;
  return api.post('/login', user)
    .then((response) => {
      dispatch({type: 'SET_USER', user: response.data.user});
    }, (error) => {
      throw error.response.data.message;
    });
};

export const logout = () => {
  return api.post('/logout');
};

export const register = () => (dispatch, getState) => {
  let user = getState().form.registration.values;
  return api.post('/registration', user)
    .then(() => {
      dispatch(login(user))
    }, (error) => {
      throw error.response.data.message;
    })
};
