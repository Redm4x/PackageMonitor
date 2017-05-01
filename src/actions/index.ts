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
      promises.push(axios.get(registryUrl + current.get("name")).then(data => {

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