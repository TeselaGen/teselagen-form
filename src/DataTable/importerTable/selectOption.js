import React, { Component } from "react";
import { Select } from "@blueprintjs/select";
import { MenuItem, Button } from "@blueprintjs/core";

export default class selectOption extends Component {
  render() {
    const { dictionary, col, updater, target } = this.props;
    return (
      <Select
        items={dictionary}
        filterable={false}
        noResults={<MenuItem disabled={true} text="No results." />}
        activeItem={col[target]}
        itemRenderer={item => (
          <MenuItem
            key={item.value}
            onClick={() => {
              updater(item);
              this.forceUpdate();
            }}
            text={item.label}
          />
        )}
      >
        <Button
          rightIcon="caret-down"
          text={col[target].label || "No selection"}
        />
      </Select>
    );
  }
}
