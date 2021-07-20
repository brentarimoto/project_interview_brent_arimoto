import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import loggerMiddleware from "redux-logger";
import thunkMiddleware from "redux-thunk";

import user from "./user";
import conversations from "./conversations";
import activeConversation from "./activeConversation";
import latestReadMessage from "./latestReadMessage";

const CLEAR_ON_LOGOUT = "CLEAR_ON_LOGOUT";

export const clearOnLogout = () => {
  return {
    type: CLEAR_ON_LOGOUT
  };
};

const appReducer = combineReducers({
  user,
  conversations,
  activeConversation,
  latestReadMessage,
});
const rootReducer = (state, action) => {
  if (action.type === CLEAR_ON_LOGOUT) {
    // set state to initial state
    state = undefined;
  }
  return appReducer(state, action);
};

let enhancer;

if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(thunkMiddleware);
} else {
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunkMiddleware, loggerMiddleware));
}

export default createStore(rootReducer, enhancer);
