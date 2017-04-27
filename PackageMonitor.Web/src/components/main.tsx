import * as React from "react";

import { Map, List, fromJS } from "immutable";
import axios from "axios";

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

    this.setState({
      packages: fromJS(obj.dependencies).map((val, key) => Map({
        name: key,
        currentVersion: val,
      }))
    });

    setTimeout(() => {
      this.loadLatestVersions();
    }, 10);
  }

  loadLatestVersions = () => {
    const apiUrl = "https://vv7manmgt0.execute-api.us-east-1.amazonaws.com/prod/testMethod";

    const body = this.state.packages.toJS();
    
    axios.post(apiUrl, body).then((data) => {
      let latestVersions = fromJS(data.data);
      let newPackages = this.state.packages.map((p, key) => p.set("latestVersion", latestVersions.get(key))).toList();

      this.setState({
        packages: newPackages
      });
    }).catch(() => {
      console.log("failed");
    });
  }

  render() {
    const { } = this.props;

    let packages = this.state.packages.map(current => {
      let latest = <i className="fa fa-spinner fa-spin fa-fw"></i>;

      if (current.get("latestVersion")) {
        const currentVersion = current.get("currentVersion").replace("^", "");

        //console.log(current.get("name") + " : " + current.get("currentVersion") + " | " + current.get("latestVersion"));
        const color = semver.gt(current.get("latestVersion"), currentVersion) ? "red" : "black";
        latest = <span style={{
          color: color
        }}>{current.get("latestVersion")}</span>;
      }

      return <tr key={current.get("name")}>
        <td>{current.get("name")}</td>
        <td>{current.get("currentVersion")}</td>
        <td>{latest}</td>
      </tr>;
    }).toList();

    return (
      <div>
        <p>Please select your "package.json" file : </p>
        <br/>
        <input type="file" onChange={this.onFileChange} />
        <br />
        {!packages.isEmpty() && (
          <table className="table" style={{ width: "500px" }}>
            <thead>
              <tr>
                <td>Package</td>
                <td>Current</td>
                <td>Latest</td>
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