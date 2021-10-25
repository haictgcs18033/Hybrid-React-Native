import { combineReducers, createStore,applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import { rentalReducer } from './rentalReducer'
const rootReducer = combineReducers({
  rentalReducer
})
export const store = createStore(rootReducer,applyMiddleware(reduxThunk))