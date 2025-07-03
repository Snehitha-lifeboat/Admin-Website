// third party
import { combineReducers } from 'redux';

// project import
import customizationReducer from './customizationReducer1';

// ==============================|| REDUCER ||============================== //

const reducer1 = combineReducers({
  customization: customizationReducer
});

export default reducer1;