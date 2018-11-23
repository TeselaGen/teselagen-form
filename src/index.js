import React, { Component } from "react";
import { formStore } from "./store/formGenerator";
import Container from "./components/container";
import { configure } from "mobx";
configure({ isolateGlobalState: true });

export default class Form extends Component {
  render() {
    const { form } = this.props;
    const newForm = formStore.create(form);
    return (
      <div>
        <Container formStore={newForm} form={form} />
      </div>
    );
  }
}
