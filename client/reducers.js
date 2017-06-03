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

const reducers = combineReducers({
  authorized,
  form: formReducer,
});

export default reducers;
