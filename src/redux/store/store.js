import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'redux/reducers';

const middleware = applyMiddleware(thunk);

const store = createStore(rootReducer, compose(middleware));

export default store;