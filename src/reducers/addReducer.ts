import * as types from "../actions/types";
import { Map, List, fromJS } from "immutable";

export const initialState: Map<string, any> = Map({
  packages: List(),
  colsList: fromJS([
    { field: "package", title: "Package", show: true, isFilterable: true, filterValue: "", isSortable: true, isSorting: false, isAscending: null, width: "35%" },
    { field: "current", title: "Current", show: true, isFilterable: true, filterValue: "", isSortable: true, isSorting: false, isAscending: null, width: "15%" },
    { field: "latest", title: "Latest", show: true, isFilterable: true, filterValue: "", isSortable: true, isSorting: false, isAscending: null, width: "15%" },
    { field: "elapsed", title: "Elapsed", show: true, width: "20%" }
  ])
});

export default function appReducer(state = initialState, action) {
  switch (action.type) {

    case types.UPDATE_PACKAGES:
      return state.set("packages", action.packages);

    case types.UPDATE_PACKAGE:
      const packageIndex = state.get("packages").findIndex(p => p.get("name") === action.package.get("name"));
      return state.setIn(["packages", packageIndex], action.package);

    case types.UPDATE_COLSLIST:
      return state.set("colsList", action.newCols);

    default:
      return state;
  }
}