import { combineReducers } from "redux";
import appReducer from "../reducers/addReducer";

export const rootReducer = combineReducers({
  appState: appReducer
});

export default rootReducer;