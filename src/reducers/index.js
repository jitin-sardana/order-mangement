import { combineReducers } from 'redux';
import orderManagementReducer from './orderManagementReducer';

const rootReducer = combineReducers({
  orderManagement: orderManagementReducer
})

export default rootReducer;