import * as React from "react";
import { List, Map } from "immutable";
import { FormattedRelative } from "react-intl";

const semver = require('semver')

interface IAppProps {
  currentPackage: Map<string, any>;
}

export class PackageRow extends React.Component<IAppProps, void> {

  constructor(props: IAppProps) {
    super(props);
  }

  render() {
    const {currentPackage} = this.props;
    const isLoaded = currentPackage.get("isLoaded");

    let latest = <i className="fa fa-spinner fa-spin fa-fw"></i>;

    if (isLoaded) {
      const currentVersion = currentPackage.get("currentVersion").replace("^", "");

      const color = semver.gt(currentPackage.get("latestVersion"), currentVersion) ? "red" : "black";
      latest = <span style={{ color }}>{currentPackage.get("latestVersion")}</span>
    }

    return (
      <tr>
        <td>{currentPackage.get("name")}</td>
        <td>{currentPackage.get("isDev") && <span className="label label-default">dev</span>}</td>
        <td>{currentPackage.get("currentVersion")}</td>
        <td>{latest}</td>
        <td>{isLoaded && <FormattedRelative value={currentPackage.get("latestVersionDate")} />}</td>
        <td className="infoCell">
          {currentPackage.get("projectHome") && <a href={currentPackage.get("projectHome")} target="_blank"><i className="fa fa-home fa-lg" aria-hidden="true"></i></a>}
          {currentPackage.get("bugUrl") && <a href={currentPackage.get("bugUrl")} target="_blank"><i className="fa fa-bug fa-lg" aria-hidden="true"></i></a>}
        </td>
      </tr>
    );
  }
}