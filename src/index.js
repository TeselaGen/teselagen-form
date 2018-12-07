import React, { Component } from "react";
import { formStore } from "./store/formGenerator";
import { dataTableStore } from "./store/dataTable";
import { dataImporterStore } from "./store/dataImporter";
import Container from "./components/container";
import Table from "./DataTable/Table";
import ImporterTable from "./DataTable/importerTable";
import { configure } from "mobx";

configure({ isolateGlobalState: true });

export class Form extends Component {
  render() {
    const { form } = this.props;
    const newForm = formStore.create(form);
    return <Container formStore={newForm} form={form} />;
  }
}

export class DataTable extends Component {
  render() {
    const { externalSource, entities = [] } = this.props;
    const dataTable = dataTableStore.create({
      externalSource: externalSource,
      entities: entities
    });
    return <Table {...this.props} dataTableStore={dataTable} />;
  }
}

export class ImporterDataTable extends Component {
  render() {
    const dataImporter = dataImporterStore.create({
      totalPages: Math.ceil(this.props.rows.length / 5)
    });
    return <ImporterTable {...this.props} dataImporterStore={dataImporter} />;
  }
}
