import React, { Component } from "react";
import {
  Intent,
  FormGroup,
  InputGroup,
  Button,
  Classes
} from "@blueprintjs/core";
import Select from "react-select";
import DataTable from "../DataTable";
import { observer } from "mobx-react";

export default observer(
  class componentName extends Component {
    renderField() {
      const { item, formStore } = this.props;
      switch (item.type) {
        case "dataTable":
          return (
            <DataTable
              schema={item.schema}
              entities={
                formStore.elements[formStore.wizard.page].arrays[0].data
              }
            />
          );
        case "button":
          return (
            <Button
              icon={
                formStore.elements[formStore.wizard.page].fields[item.index]
                  .icon || ""
              }
              rightIcon={
                formStore.elements[formStore.wizard.page].fields[item.index]
                  .rightIcon || ""
              }
              text={item.text}
              onClick={() => {
                formStore.elements[formStore.wizard.page][item.action.type](
                  item
                );
              }}
              intent={Intent[item.intent || "PRIMARY"]}
              classes={Classes[item.classes || "minimal"]}
            />
          );
        case "inputField":
          return (
            <InputGroup
              placeholder={
                formStore.elements[formStore.wizard.page].fields[item.index]
                  .placeholder
              }
              intent={
                formStore.elements[formStore.wizard.page].fields[item.index]
                  .error
                  ? Intent.DANGER
                  : Intent.PRIMARY
              }
              value={
                formStore.elements[formStore.wizard.page].fields[item.index]
                  .value
              }
              onChange={e => {
                formStore.elements[formStore.wizard.page].fields[
                  item.index
                ].setValue(e.target.value);
              }}
            />
          );
        case "selectField":
          if (
            formStore.elements[formStore.wizard.page].fields[item.index]
              .externalSource &&
            !formStore.elements[formStore.wizard.page].fields[item.index]
              .fetched
          ) {
            formStore.elements[formStore.wizard.page].fields[
              item.index
            ].getOptions();
          }
          return (
            <Select
              disabled={false}
              placeholder={"Please choose."}
              intent={
                formStore.elements[formStore.wizard.page].fields[item.index]
                  .error
                  ? Intent.DANGER
                  : Intent.PRIMARY
              }
              options={
                formStore.elements[formStore.wizard.page].fields[item.index]
                  .options
              }
              value={
                formStore.elements[formStore.wizard.page].fields[item.index]
                  .value
              }
              onChange={memberSelected =>
                formStore.elements[formStore.wizard.page].fields[
                  item.index
                ].setValue(memberSelected.value)
              }
            />
          );
        default:
          break;
      }
    }

    render() {
      const { item, formStore } = this.props;
      return (
        <FormGroup
          key={item.index}
          disabled={
            formStore.elements[formStore.wizard.page].fields[item.index]
              .disabled
          }
          helperText={"something" && ""}
          label={item.label}
          labelInfo={
            formStore.elements[formStore.wizard.page].fields[item.index]
              .required && "(required)"
          }
        >
          {this.renderField()}
        </FormGroup>
      );
    }
  }
);
