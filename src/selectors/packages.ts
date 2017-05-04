import { createSelector } from "reselect";
import { Map, List } from "immutable";

const getColsList = state => state.appState.get("colsList");
const getPackages = state => state.appState.get("packages");

export const getPackageList = createSelector(
  getColsList, getPackages,
  (colsList: List<Map<string, any>>, packages: List<Map<string, any>>) => {
    if (packages.size > 0) {
      let _packages = packages.filter(p => {
        const packageFilterValue: string = colsList.getIn([colsList.findIndex(c => c.get("field") === "package"), "filterValue"]);
        const currentFilterValue: string = colsList.getIn([colsList.findIndex(c => c.get("field") === "current"), "filterValue"]);
        const latestFilterValue: string = colsList.getIn([colsList.findIndex(c => c.get("field") === "latest"), "filterValue"]);

        const currentVersion: string = p.get("currentVersion", "")

        return p.get("name", "").indexOf(packageFilterValue) !== -1 &&
          currentVersion.indexOf(currentFilterValue) !== -1 &&
          p.get("latestVersion", "").indexOf(latestFilterValue) !== -1;
      }).toList();

      const sortedCol = colsList.find(col => col.get("isSortable") && col.get("isSorting"));;
      const sortedColField = sortedCol && sortedCol.get("field");

      if (sortedColField) {
        switch (sortedColField) {
          case "package":
            if (colsList.getIn([colsList.findIndex(c => c.get("field") === "package"), "isAscending"])) {
              _packages = _packages.sortBy(p => p.get("name", "")).toList();
            } else {
              _packages = _packages.sort((a, b) => b.get("name", "").localeCompare(a.get("name"))).toList();
            }
            break;
          case "current":
            if (colsList.getIn([colsList.findIndex(c => c.get("field") === "current"), "isAscending"])) {
              _packages = _packages.sortBy(p => p.get("currentVersion", "")).toList();
            } else {
              _packages = _packages.sort((a, b) => b.get("currentVersion", "").localeCompare(a.get("currentVersion"))).toList();
            }
            break;
          case "latest":
            if (colsList.getIn([colsList.findIndex(c => c.get("field") === "latest"), "isAscending"])) {
              _packages = _packages.sortBy(p => p.get("latestVersion", "")).toList();
            } else {
              _packages = _packages.sort((a, b) => b.get("latestVersion", "").localeCompare(a.get("latestVersion"))).toList();
            }
            break;

          default:
            break;
        }
      }

      return _packages;
    } else {
      return List();
    }
  }
);