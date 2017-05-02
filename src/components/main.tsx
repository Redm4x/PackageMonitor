import * as React from "react";

import { Map, List, fromJS } from "immutable";
import axios from "axios";
import { FormattedRelative } from "react-intl";

const semver = require('semver')

interface IAppProps {

}

interface IAppState {
  packages: List<Map<string, any>>;
}

export default class Main extends React.Component<IAppProps, IAppState> {

  constructor(props: IAppProps) {
    super(props);

    this.state = {
      packages: List<Map<string, any>>()
    };
  }

  onFileChange = (event) => {
    this.setState({
      packages: List<Map<string, any>>()
    });

    var reader = new FileReader();
    reader.onload = this.onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }

  onReaderLoad = (event) => {
    //console.log(event.target.result);
    var obj = JSON.parse(event.target.result);

    const prodDependencies = fromJS(obj.dependencies).map((val, key) => Map({
      name: key,
      currentVersion: val,
      isLoaded: false,
      isDev: false,
    }));

    const devDependencies = fromJS(obj.devDependencies).map((val, key) => Map({
      name: key,
      currentVersion: val,
      isLoaded: false,
      isDev: true,
    }));

    this.setState({
      packages: prodDependencies.concat(devDependencies)
    });

    setTimeout(() => {
      this.loadLatestVersions();
    }, 10);
  }

  loadLatestVersions = () => {
    const registryUrl = "https://afternoon-falls-52669.herokuapp.com/";

    this.state.packages.forEach(current => {
      const url = registryUrl + current.get("name").replace("/", "%2f");

      axios.get(url).then(data => {
        const packageData = fromJS(data.data);
        const latestVersion = packageData.getIn(["dist-tags", "latest"]);
        const projectHome = packageData.get("homepage");
        const bugUrl = packageData.getIn(["bugs", "url"]);
        const latestVersionDate = packageData.getIn(["time", latestVersion]);

        let newPackages = this.state.packages.update(current.get("name"), p => p.merge({
          latestVersion,
          latestVersionDate,
          projectHome,
          bugUrl,
          isLoaded: true
        }));

        this.setState({
          packages: newPackages
        });
      }).catch(() => {
        console.log("failed : " + current.get("name"));
      });
    });
  }

  render() {
    const { } = this.props;

    let packages = this.state.packages.map(current => {
      const isLoaded = current.get("isLoaded");

      let latest = <i className="fa fa-spinner fa-spin fa-fw"></i>;
      
      if (isLoaded) {
        const currentVersion = current.get("currentVersion").replace("^", "");
        
        const color = semver.gt(current.get("latestVersion"), currentVersion) ? "red" : "black";
        latest = <span style={{
          color: color
        }}>{current.get("latestVersion")}</span>;
      }

      return <tr key={current.get("name")}>
        <td>{current.get("name")}</td>
        <td>{current.get("isDev") && <span className="label label-default">dev</span>}</td>
        <td>{current.get("currentVersion")}</td>
        <td>{latest}</td>
        <td>{isLoaded && <FormattedRelative value={current.get("latestVersionDate")} />}</td>
        <td className="infoCell">
          {current.get("projectHome") && <a href={current.get("projectHome")} target="_blank"><i className="fa fa-home fa-lg" aria-hidden="true"></i></a>}
          {current.get("bugUrl") && <a href={current.get("bugUrl")} target="_blank"><i className="fa fa-bug fa-lg" aria-hidden="true"></i></a>}
        </td>
      </tr>;
    }).toList();

    return (
      <div>
        <p>Please select your "package.json" file : </p>
        <br />
        <input type="file" onChange={this.onFileChange} />
        <br />
        {!packages.isEmpty() && (
          <table className="table packagesTable">
            <thead>
              <tr>
                <th>Package</th>
                <th>&nbsp;</th>
                <th>Current</th>
                <th>Latest</th>
                <th>&nbsp;</th>
                <th>Infos</th>
              </tr>
            </thead>
            <tbody>
              {packages}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}