import * as React from "react";
import { getPackageList } from "../selectors/packages";
import { connect } from "react-redux";
import { Map, List, fromJS } from "immutable";
import { updatePackages, loadLatestVersions, onSortingChange, onFilterChange } from "../actions";
import { PackageList } from "../components/packageList";

interface IAppProps {
  hasAFile: boolean;
  colsList: List<Map<string, any>>;
  packages: List<Map<string, any>>;

  loadLatestVersions: () => any;
  updatePackages: (packages: List<Map<string, any>>) => any;
  onFilterChange: (value: string, field: string) => any;
  onSortingChange: (field: string) => any;
}

class Main extends React.Component<IAppProps, void> {

  constructor(props: IAppProps) {
    super(props);
  }

  onFileChange = (event) => {
    this.props.updatePackages(List([]));

    if (event.target.files && !event.target.files.length) return;
    
    const reader = new FileReader();
    reader.onload = this.onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }

  onReaderLoad = (event) => {
    //console.log(event.target.result);
    const obj = JSON.parse(event.target.result);
    const prodDependencies = fromJS(obj.dependencies).map((val, key) => Map({
      name: key,
      currentVersion: val,
      isLoaded: false,
      isDev: false,
    }))
      .toList()
      .sortBy(p => p.get("name"));

    const devDependencies = fromJS(obj.devDependencies).map((val, key) => Map({
      name: key,
      currentVersion: val,
      isLoaded: false,
      isDev: true,
    }));

    const packages = prodDependencies.concat(devDependencies);

    this.props.updatePackages(packages);

    setTimeout(() => {
      this.props.loadLatestVersions();
    }, 10);
  }

  render() {
    const {packages, colsList, onSortingChange, onFilterChange, hasAFile} = this.props;

    return (
      <div>
        <p>Please select your "package.json" file : </p>
        <br />
        <input type="file" onChange={this.onFileChange} />
        <br />

        {hasAFile && (
          <PackageList packages={packages}
            colsList={colsList}
            onSortingChange={onSortingChange}
            onFilterChange={onFilterChange} />
        )}

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {appState} = state;

  return {
    packages: getPackageList(state),
    colsList: appState.get("colsList"),
    hasAFile: appState.get("packages").size > 0
  }
}

export default connect(mapStateToProps, {
  updatePackages,
  loadLatestVersions,
  onSortingChange,
  onFilterChange
})(Main);