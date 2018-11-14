import React, { Component } from "react";
import { Intent, FormGroup, InputGroup } from "@blueprintjs/core";
import Select from "react-select";
import { observer } from "mobx-react";


export default observer(
  class componentName extends Component {

    renderField(){
      const { item, formStore } = this.props;
      switch (item.type) {
        case "inputField":
          return(
            <InputGroup
              placeholder={formStore.elements[formStore.wizard.page].fields[item.index].placeholder}
              value={formStore.elements[formStore.wizard.page].fields[item.index].value}
              onChange={e => {
                formStore.elements[formStore.wizard.page].fields[item.index].setValue(e.target.value)
              }}
            />
          )
        case 'selectField':
          formStore.elements[formStore.wizard.page].fields[item.index].setOptions();
          return(
            <Select
              disabled={false}
              placeholder={"Please choose."}
              options={formStore.elements[formStore.wizard.page].fields[item.index].options}
              value={formStore.elements[formStore.wizard.page].fields[item.index].value}
              onChange={memberSelected =>
                formStore.elements[formStore.wizard.page].fields[item.index].setValue(memberSelected.value)
              }
            />
          )
        default:
          break;
      }
    }

    render() {
      const { item, formStore } = this.props;
      return (
        <FormGroup
          disabled={formStore.elements[formStore.wizard.page].fields[item.index].disabled}
          helperText={"something" && ""}
          intent={Intent.PRIMARY}
          label={item.label}
          labelInfo={formStore.elements[formStore.wizard.page].fields[item.index].required && "(required)"}
        >
        {this.renderField()}
        </FormGroup>
      );
    }
  }
);
