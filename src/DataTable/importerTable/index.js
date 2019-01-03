import React, { Component } from "react";
import { observer } from "mobx-react";
import { get, slice } from "lodash";
import SelectOption from "./selectOption";
import { Button, Classes, Menu, MenuDivider } from "@blueprintjs/core";
import { Column, Table, Cell, ColumnHeaderCell } from "@blueprintjs/table";
import classNames from "classnames";
const headerStyle = {
  width: "90%",
  margin: "7px"
};

export default observer(
  class importerTable extends Component {
    constructor(props) {
      super(props);
    }

    getCellRenderer(key) {
      const { rows, dataImporterStore } = this.props;
      const list = slice(
        rows,
        dataImporterStore.initialIndex,
        dataImporterStore.initialIndex + dataImporterStore.rowsPerPage
      );
      return row =>
        list.length >= row ? (
          <Cell key={row}>
            {key.class === "descriptorType" ? (
              <a target="_Blank" href={key.link.urlTemplate + get(list[row], key.name)}>
                {get(list[row], key.name)}
              </a>
            ) : (
              get(list[row], key.name)
            )}
          </Cell>
        ) : (
          <Cell />
        );
    }

    getContextMenu(header) {
      const { dictionary } = this.props;
      return (
        <Menu className={Classes.ELEVATION_1}>
          <SelectOption
            dictionary={dictionary}
            col={header}
            updater={header.setClass}
            target={"class"}
          />
          <MenuDivider />
          <SelectOption
            dictionary={header.options}
            col={header}
            updater={header.setSubClass}
            target={"subClass"}
          />
        </Menu>
      );
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
      console.log(headers);
      return (
        <div className="data-table-container">
          <div className={"data-table-header"}>
            <div className={"data-table-title-and-buttons"}>
              <span className={"data-table-title"}>{tableName || ""}</span>
              {children}
            </div>
          </div>
          <Table
            style={{ width: "fit-content !important" }}
            numRows={dataImporterStore.rowsPerPage}
            enableFocusedCell={true}
            selectionModes={
              "NONE" //enableColumnInteractionBar={true} //bodyContextMenuRenderer={target => this.getContextMenu()}
            }
          >
            {headers.map(header => (
              <Column
                key={header.index}
                name={header.name}
                cellRenderer={this.getCellRenderer(header)}
                columnHeaderCellRenderer={(row, index) => (
                  <ColumnHeaderCell
                    key={index}
                    // menuIcon={"cog"}
                    // menuRenderer={() => this.getContextMenu(header)}
                    isActive={true}
                  >
                    <div>
                      <select
                        style={headerStyle}
                        onChange={e => {
                          header.setClass(e.target.value);
                        }}
                      >
                        <option hidden>{"Select option"}</option>
                        {dictionary.map(opt => (
                          <option value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <select
                        style={headerStyle}
                        onChange={e => header.setSubClass(e.target.value)}
                      >
                        <option hidden>{"Select option"}</option>
                        {header.options.map(opt => (
                          <option value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <b style={headerStyle}>{header.name}</b>
                    </div>
                  </ColumnHeaderCell>
                )}
              />
            ))}
          </Table>
          <div
            className={"paging-toolbar-container"}
            style={{ marginTop: "10px" }}
          >
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
                onChange={opt => {
                  dataImporterStore.setRowsPerPage(parseInt(opt.target.value));
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
            </div>
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
