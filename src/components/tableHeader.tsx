import * as React from "react";
import * as classNames from "classnames";
import { FilterInput } from "./filterInput";
//import { FilterSelect } from "./filterSelect";
//import { FilterDateRange } from "./filterDateRange";
import { Map, List } from "immutable";

interface IAppProps {
  hasSorting: boolean;
  hasFiltering: boolean;
  customHeaderClass?: string;
  actionWidth?: string;
  colsList: List<Map<string, any>>;

  onFilterChange?: (value: string, field: string, option?: string) => any;
  onSortingChange?: (field: string) => any;
}

export enum FilterTypes {
  text,
  select,
  date
}

export class TableHeader extends React.Component<IAppProps, void> {
  public static defaultProps: IAppProps = {
    actionWidth: "15%",
    colsList: null,
    hasSorting: false,
    hasFiltering: false,
  };

  constructor(props: IAppProps) {
    super(props);
  }

  componentWillMount() {
    if (this.props.hasSorting && !this.props.onSortingChange) {
      console.error("OnSortingChange must be defined");
    }
    if (this.props.hasFiltering && !this.props.onFilterChange) {
      console.error("OnFilterChange must be defined");
    }
  }

  getTitleHeaders = () => {
    const { colsList, onSortingChange, hasSorting, customHeaderClass } = this.props;

    return colsList.map((col, i) => {
      if (hasSorting && col.get("isSortable")) {
        const headerClasses = classNames(customHeaderClass, {
          "hidden": !col.get("show"),
          "sortable": col.get("isSortable"),
          "sort-desc": col.get("isAscending") === false,
          "sort-asc": col.get("isAscending")
        });

        const customColClasses = col.get("customClasses");

        const colClasses = classNames([headerClasses, customColClasses]);

        return (
          <th width={col.get("width") || null} key={col.get("field") || i} className={colClasses} onClick={() => onSortingChange(col.get("field"))}>
            <div>
              <span className={col.get("isSortable") ? "sort-indicator" : ""}>{col.get("title")}</span>
            </div>
          </th>
        )
      } else {
        const headerClasses = classNames(customHeaderClass, {
          "hidden": !col.get("show")
        });

        const customColClasses = col.get("customClasses");

        const colClasses = classNames([headerClasses, customColClasses]);

        return (
          <th width={col.get("width") || null} key={col.get("field") || i} className={colClasses}>
            <div>
              <span>{col.get("title")}</span>
            </div>
          </th>
        )
      }
    });
  }

  getFilterHeader = () => {
    const { colsList, hasFiltering, onFilterChange } = this.props;

    return colsList.map((col, i) => {
      if (hasFiltering && col.get("show")) {
        const filterType = col.get("filterType", 0);

        if (col.get("isFilterable") && filterType >= 0) {

          switch (filterType) {

            case FilterTypes.text:
              return (
                <th key={col.get("field") || i} className={!col.get("show") ? "hidden" : ""}>
                  <FilterInput field={col.get("field")}
                    value={col.get("filterValue")}
                    onFilterChange={onFilterChange}>
                  </FilterInput>
                </th>
              );

            //case FilterTypes.select:
            //  return (
            //    <th key={col.get("field") || i}>
            //      <FilterSelect field={col.get("field")} value={col.get("filterValue")} onFilterChange={onFilterChange} options={col.get("options")} />
            //    </th>
            //  );

            //case FilterTypes.date:
            //  return (
            //    <th key={col.get("field") || i}>
            //      <FilterDateRange
            //        field={col.get("field")}
            //        startDate={col.get("startDate")}
            //        endDate={col.get("endDate")}
            //        onFilterChange={onFilterChange} />
            //    </th >
            //  );

            default:
              return;
          }
        } else {
          return <th key={col.get("field") || i}></th>;
        }
      } else {
        return null;
      }
    });
  }

  public render() {
    const { colsList, onFilterChange, onSortingChange, hasSorting, hasFiltering, actionWidth } = this.props;

    let titleHeaders = this.getTitleHeaders();

    let filterHeaders = this.getFilterHeader();
    let filterRow = hasFiltering && (
      <tr className="tds-table-filters">
        {filterHeaders}
        {actionWidth !== "0" && <th></th>}
      </tr>
    );

    return (
      <thead>
        <tr>
          {titleHeaders}
          {actionWidth !== "0" && <th width={actionWidth} ></th>}
        </tr>
        {filterRow}
      </thead>
    )
  }
}