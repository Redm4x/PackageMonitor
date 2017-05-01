import * as React from "react";
import { connect } from "react-redux";
import { updatePackages, loadLatestVersions } from "../actions";
import { Map, List, fromJS } from "immutable";
import axios from "axios";
import { FormattedRelative } from "react-intl";

const semver = require('semver')

interface IAppProps {
  packages: List<Map<string, any>>;

  loadLatestVersions: () => any;
  updatePackages: (packages: List<Map<string, any>>) => any;
}

class Main extends React.Component<IAppProps, void> {

  constructor(props: IAppProps) {
    super(props);
  }

  onFileChange = (event) => {
    this.props.updatePackages(List([]));

    const reader = new FileReader();
    reader.onload = this.onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }

  onReaderLoad = (event) => {
    //console.log(event.target.result);
    const obj = JSON.parse(event.target.result);
    const packages = fromJS(obj.dependencies).map((val, key) => Map({
      name: key,
      currentVersion: val,
      isLoaded: false,
    })).toList();

    this.props.updatePackages(packages);

    setTimeout(() => {
      this.props.loadLatestVersions();
    }, 10);
  }

  render() {
    const {packages} = this.props;

    const shownPackages = packages.map(current => {
      const isLoaded = current.get("isLoaded");

      let latest = <i className="fa fa-spinner fa-spin fa-fw"></i>;

      if (isLoaded) {
        const currentVersion = current.get("currentVersion").replace("^", "");

        const color = semver.gt(current.get("latestVersion"), currentVersion) ? "red" : "black";
        latest = <span style={{ color }}>{current.get("latestVersion")}</span>
      }

      return (
        <tr key={current.get("name")}>
          <td>{current.get("name")}</td>
          <td>{current.get("currentVersion")}</td>
          <td>{latest}</td>
          <td>{isLoaded && <FormattedRelative value={current.get("latestVersionDate")} />}</td>
          <td className="infoCell">
            {current.get("projectHome") && <a href={current.get("projectHome")} target="_blank"><i className="fa fa-home fa-lg" aria-hidden="true"></i></a>}
            {current.get("bugUrl") && <a href={current.get("bugUrl")} target="_blank"><i className="fa fa-bug fa-lg" aria-hidden="true"></i></a>}
          </td>
        </tr>
      );
    }).toList();

    return (
      <div>
        <p>Please select your "package.json" file : </p>
        <br />
        <input type="file" onChange={this.onFileChange} />
        <br />

        {!shownPackages.isEmpty() && (
          <table className="table packagesTable">
            <thead>
              <tr>
                <th>Package</th>
                <th>Current</th>
                <th>Latest</th>
                <th>&nbsp;</th>
                <th>Infos</th>
              </tr>
            </thead>
            <tbody>
              {shownPackages}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {appState} = state;

  return {
    packages: appState.get("packages")
  }
}

export default connect(mapStateToProps, {
  updatePackages,
  loadLatestVersions
})(Main);