import * as types from "./types";
import { Map, List, fromJS } from "immutable";
import { Dispatch } from "redux";
import axios from "axios";

export function updatePackages(packages) {
  return {
    type: types.UPDATE_PACKAGES,
    packages
  }
}

function updatePackage(_package) {
  return {
    type: types.UPDATE_PACKAGE,
    package: _package
  }
}

export function loadLatestVersions() {
  return (dispatch: Dispatch<any>, getState) => {
    const {appState} = getState();
    let packages: List<Map<string, any>> = appState.get("packages");

    const registryUrl = "https://afternoon-falls-52669.herokuapp.com/";

    const promises: Array<any> = [];

    packages.forEach(current => {
      const url = registryUrl + current.get("name").replace("/", "%2f");

      promises.push(axios.get(url).then(data => {

        const packageData = fromJS(data.data);
        const latestVersion = packageData.getIn(["dist-tags", "latest"]);
        const projectHome = packageData.get("homepage");
        const bugUrl = packageData.getIn(["bugs", "url"]);
        const latestVersionDate = packageData.getIn(["time", latestVersion]);

        const newPackage = current.merge({
          latestVersion,
          latestVersionDate,
          projectHome,
          bugUrl,
          isLoaded: true
        });

        dispatch(updatePackage(newPackage));
      }).catch(error => {
        console.log("failed : " + current.get("name"));
      }));
    });

    return Promise.all(promises);
  }
}

export function onFilterChange(value: string, field: string) {
  return (dispatch: Dispatch<any>, getState) => {
    const {appState} = getState();
    const packages: List<Map<string,any>> = appState.get("packages");

    const newCols = appState.get("colsList").update(
      appState.get("colsList").findIndex(c => c.get("field") === field),
      col => col.set("filterValue", value)
    );

    dispatch({
      type: types.UPDATE_COLSLIST,
      newCols
    });
  }
}

export function onSortingChange(field: string) {
  return (dispatch: Dispatch<any>, getState) => {
    const {appState} = getState();

    let newCols = appState.get("colsList").map(col => {
      if (col.get("field") !== field && col.get("isSortable")) {
        return col.set("isSorting", false).set("isAscending", null);
      } else {
        return col;
      }
    });

    newCols = newCols.update(
      appState.get("colsList").findIndex(c => c.get("field") === field),
      (col) => {
        if (col.get("isSortable")) {
          if (!col.get("isSorting")) {
            return col.set("isSorting", true).set("isAscending", true);
          } else if (col.get("isAscending")) {
            return col.set("isAscending", false);
          } else {
            return col.set("isSorting", false).set("isAscending", null);
          }
        } else {
          return col
        }
      }
    );

    dispatch({
      type: types.UPDATE_COLSLIST,
      newCols
    });
  }
}