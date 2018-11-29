import React, { Component } from "react";
import { observer } from "mobx-react";
import { get } from "lodash";
import { Button, Classes } from "@blueprintjs/core";
import classNames from "classnames";

export default observer(
  class DataTable extends Component {
    constructor(props) {
      super(props);
      props.query && props.dataTableStore.fetchData(props.query);
    }

    renderRows() {
      const {
        dataTableStore: { entities, listRows },
        onDoubleClick,
        schema
      } = this.props;
      let fakeArr = ["", "", ""];
      return listRows.length > 0
        ? listRows.map((row, index) => (
            <tr key={index}>
              {schema.fields.map((col, i) => (
                <td
                  key={col.path + i}
                  onDoubleClick={e => {
                    onDoubleClick(row);
                  }}
                >
                  {get(row, col.path)}
                </td>
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
      let pageSizes = [10, 20, 50, 100];
      const { schema, tableName, children, dataTableStore } = this.props;
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
          <div className={"paging-toolbar-container"}>
            <Button
              minimal
              icon="refresh"
              disabled={false}
              onClick={() => {}}
            />
            <div
              title={"Set Page Size"}
              className={classNames(Classes.SELECT, Classes.MINIMAL)}
            >
              <select
                className="paging-page-size"
                onChange={(opt) => { dataTableStore.setRowsPerPage(opt.value);}}
                disabled={false}
                value={dataTableStore.rowsPerPage}
              >
                {[
                  <option key="page-size-placeholder" value={"fake"}>
                    Size
                  </option>,
                  pageSizes.map(size => {
                    return (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    );
                  })
                ]}
              </select>
            </div>
            <Button
              onClick={() => {
                dataTableStore.prevPage();
              }}
              disabled={false}
              minimal
              className="paging-arrow-left"
              icon="chevron-left"
            />
            <div>
              <div>
                <input
                  style={{ marginLeft: 5, width: 35, marginRight: 8 }}
                  value={dataTableStore.page}
                  disabled={false}
                  onChange={(val) => { dataTableStore.setPage(val)}}
                  className={Classes.INPUT}
                />
                of {dataTableStore.totalPages}{" "}
                {
                  //lastpage
                }
              </div>
            </div>
            <Button
              style={{ marginLeft: 5 }}
              disabled={false}
              icon="chevron-right"
              minimal
              className="paging-arrow-right"
              onClick={() => {
                dataTableStore.nextPage();
              }}
            />
          </div>
        </div>
      );
    }
  }
);
