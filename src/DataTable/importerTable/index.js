import React, { Component } from "react";
import { observer } from "mobx-react";
import { get, slice } from "lodash";
import SelectOption from "./selectOption";
import { Button, Classes } from "@blueprintjs/core";
import classNames from "classnames";



const headerStyle = {
  minWidth: "120px",
  maxWidth: "140px"
};

export default observer(
  class importerTable extends Component {
    constructor(props) {
      super(props);
    }

    renderRows() {
      const { rows, headers, dataImporterStore, onDoubleClick } = this.props;
      console.log(dataImporterStore);
      let fakeArr = ["", "", ""];
      return rows.length > 0
        ? slice(
            rows,
            dataImporterStore.initialIndex,
            dataImporterStore.initialIndex + dataImporterStore.rowsPerPage
          ).map((row, index) => (
            <tr key={index}>
              {headers.map((col, i) => (
                <td
                  key={col.name + i}
                  onDoubleClick={e => {
                    onDoubleClick ? onDoubleClick(row): ""
                  }}
                >
                  {get(row, col.name)}
                </td>
              ))}
            </tr>
          ))
        : fakeArr.map((row, index) => (
            <tr key={index}>
              {headers.map((col, i) => (
                <td key={col.name + i}>{row}</td>
              ))}
            </tr>
          ));
    }

    render() {
      let pageSizes = [10, 20, 50, 100];
      const {
        headers,
        tableName,
        children,
        dictionary,
        dataImporterStore
      } = this.props;
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
                {headers.map(col => (
                  <th style={headerStyle} key={col.name + "Class"}>
                    <SelectOption
                      dictionary={dictionary}
                      col={col}
                      updater={col.setClass}
                      target={"class"}
                    />
                  </th>
                ))}
              </tr>
              <tr>
                {headers.map(col => (
                  <th style={headerStyle} key={col.name + "SubClass"}>
                    <SelectOption
                      dictionary={col.options}
                      col={col}
                      updater={col.setSubClass}
                      target={"subClass"}
                    />
                  </th>
                ))}
              </tr>
              <tr>
                {headers.map((header, index) => (
                  <th style={headerStyle} key={index}>
                    {header.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{this.renderRows()}</tbody>
          </table>
          <div className={"paging-toolbar-container"} style={{marginTop: "10px",}}>
            <Button
              minimal
              icon="refresh"
              disabled={false}
              onClick={() => {}}
            />
            {/* <div
              title={"Set Page Size"}
              className={classNames(Classes.SELECT, Classes.MINIMAL)}
            >
              <select
                className="paging-page-size"
                onChange={opt => {
                  dataImporterStore.setRowsPerPage(opt.value);
                }}
                disabled={false}
                value={dataImporterStore.rowsPerPage}
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
            </div> */}
            <Button
              onClick={() => {
                dataImporterStore.prevPage();
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
                  value={dataImporterStore.page}
                  disabled={false}
                  onChange={val => {
                    dataImporterStore.setPage(val);
                  }}
                  className={Classes.INPUT}
                />
                of {dataImporterStore.totalPages}{" "}
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
                dataImporterStore.nextPage();
              }}
            />
          </div>
        </div>
      );
    }
  }
);
