import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

const authorized = (state=false, action) => {
  switch (action.type) {
    case 'SET_USER':
      return true;
    case 'RESET_USER':
      return false;
    default:
      return state;
  }
};

const user = (state={}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.user;
    case 'RESET_USER':
      return {};
    default:
      return state;
  }
};

const result = (state='', action) => {
  switch (action.type) {
    case 'SET_RESULT':
      return action.text;
    case 'RESET_USER':
      return '';
    default:
      return state;
  }
};

const reducers = combineReducers({
  authorized,
  user,
  result,
  form: formReducer,
});

export default reducers;
