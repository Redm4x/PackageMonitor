import * as React from "react";
import { List, Map } from "immutable";
import { TableHeader } from "./tableHeader";
import { PackageRow } from "./packageRow";

interface IAppProps {
  packages: List<Map<string, any>>;
  colsList: List<Map<string, any>>;

  onFilterChange: (value: string, field: string) => any;
  onSortingChange: (field: string) => any;
}

export class PackageList extends React.Component<IAppProps, void> {

  constructor(props: IAppProps) {
    super(props);
  }



  render() {
    const {packages, colsList, onFilterChange, onSortingChange} = this.props;

    const shownPackages = packages.map(current => {
      return <PackageRow currentPackage={current} key={current.get("name")} />
    }).toList();

    return (
      <table className="table packagesTable">
        <TableHeader colsList={colsList}
          onFilterChange={onFilterChange}
          onSortingChange={onSortingChange}
          hasFiltering={true}
          hasSorting={true}>
        </TableHeader>

        <tbody>
          {shownPackages}
        </tbody>
      </table>
    );
  }
}