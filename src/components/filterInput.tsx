import * as React from "react";

interface IAppProps {
  field: string;
  value: string;
  placeholder?: string;
  onFilterChange: (value: string, field: string) => any;
}

export class FilterInput extends React.Component<IAppProps, void> {
  constructor(props: IAppProps) {
    super(props);
  }

  handleOnChange = (event: React.FormEvent<any>) => {
    const inputValue = (event.target as any).value

    this.props.onFilterChange(inputValue, this.props.field);
  }

  handleFilterClear = () => {
    this.props.onFilterChange("", this.props.field);
  }

  public render() {
    const {field, placeholder, value} = this.props;

    let clearIcon = value !== "" && <i className="fa fa-times clear-search" onClick={this.handleFilterClear}></i>;

    return (
      <div className="has-feedback">
        <input type="text"
          value={value}
          onChange={this.handleOnChange}
          className="form-control input-filter"
          placeholder={placeholder} />
        {clearIcon}
      </div>
    )
  }
}