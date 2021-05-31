import loginReducer from './loginReducer';
import anonymousReducer from './anonymousReducer';
import loadingReducer from './loadingReducer';
import {combineReducers} from 'redux';

const combinedReducers = combineReducers({
    isLoggedIn: loginReducer,
    isAnonymous: anonymousReducer,
    isLoading: loadingReducer,
})

export default combinedReducers