import React, { Component } from "react";
import { observer } from "mobx-react";
import { get } from "lodash";

export default observer(
  class simpleTable extends Component {
    renderRows() {
      const { entities = [], schema } = this.props;
      let fakeArr = ["", "", ""];
      return entities.length > 0
        ? entities.map((row, index) => (
            <tr key={index}>
              {schema.fields.map((col, i) => (
                <td key={col.path + i}>{get(row, col.path)}</td>
              ))}
            </tr>
          ))
        : fakeArr.map((row, index) => (
            <tr key={index}>
              {schema.fields.map((col, i) => (
                <td key={col.path + i}>{row}</td>
              ))}
            </tr>
          ));
    }

    render() {
      const { schema, tableName, children } = this.props;
      return (
        <div className="data-table-container">
          <div className={"data-table-header"}>
            <div className={"data-table-title-and-buttons"}>
              <span className={"data-table-title"}>{tableName || ""}</span>
              {children}
            </div>
          </div>
          <table
            style={{ width: "100%" }}
            className="bp3-html-table bp3-condensed bp3-html-table-striped bp3-html-table-bordered bp3-interactive bp3-small"
          >
            <thead>
              <tr>
                {schema.fields.map((header, index) => (
                  <th key={index}>{header.displayName}</th>
                ))}
              </tr>
            </thead>
            <tbody>{this.renderRows()}</tbody>
          </table>
        </div>
      );
    }
  }
);
