import * as types from "../actions/types";
import { Map, List } from "immutable";

export const initialState: Map<string, any> = Map({
  packages: List()
});

export default function appReducer(state = initialState, action) {
  switch (action.type) {

    case types.UPDATE_PACKAGES:
      return state.set("packages", action.packages);

    case types.UPDATE_PACKAGE:
      const packageIndex = state.get("packages").findIndex(p => p.get("name") === action.package.get("name"));
      return state.setIn(["packages", packageIndex], action.package);

    case types.ON_FILTER_CHANGE:
      return state; // TODO

    default:
      return state;
  }
}