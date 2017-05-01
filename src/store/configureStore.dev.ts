import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducers/rootReducer";

export default function configureStore(preloadedState?) {
  const store = createStore(
    rootReducer,
    preloadedState,
    compose(
      applyMiddleware(thunkMiddleware),
      (window as any).devToolsExtension ? (window as any).devToolsExtension() : f => f
    )
  );

  //if (module.hot) {
  //  // Enable WebPack hot module replacement for reducers
  //  module.hot.accept('../rootReducer', () => {
  //    const nextRootReducer = require("../rootReducer").default;
  //    store.replaceReducer(nextRootReducer);
  //  });
  //}

  return store
}