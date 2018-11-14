import { types, flow } from "mobx-state-tree";
import { WizardStore } from "../wizard";


const field = types
  .model("field", {
    index: types.number,
    placeholder: types.optional(types.string, ""),
    value: types.optional(types.string, ""),
    values: types.optional(types.array(types.string), []),
    options: types.optional(types.array(types.frozen), []),
   // query: types.optional(types.frozen, {}),
    isNumeric: types.optional(types.boolean, false),
    required: types.optional(types.boolean, false),
    type: types.string,
    name: types.string,
    disabled: types.optional(types.boolean, false),
   // GetQuery: types.optional(types.frozen, {})
  })
  .actions(self => {
    const setOptions = flow(function*() {
      try {
        let options = yield self.GetQuery(
          [
            self.query.entity,
            self.query.parameters.value + " " + self.query.parameters.label
          ],
          { isPlural: true }
        );
        self.options = options.map(row => ({
          value: row[self.query.parameters.value],
          label: row[self.query.parameters.label]
        }));
      } catch (error) {
        console.error(error);
      }
    });
    return {
      //setOptions,
      setValue(value) {
        self.value = value;
      }
    };
  });

const element = types.model("elements", {
  page: types.number,
  fields: types.optional(types.array(field), []),
  title: types.optional(types.string, "")
});

export const formStore = types
  .model("formStore", {
    formName: types.string,
    elements: types.optional(types.array(element), []),
    isWizard: types.optional(types.boolean, false),
    wizard: types.optional(WizardStore, { page: 0, pages: 1 })
  })
  .actions(self => ({
    setElements(array) {
      return array.map(item => self.fields.push(item));
    },
    nextPage(currentPage) {
      let reqiredList = self.elements[currentPage].fields.filter(
        field => field.required
      );
      let completeList = reqiredList.filter(
        field => field.type !== 'selectField' ? field.value === "" : field.values === []
      );
      if (completeList.length === 0) {
        console.log("next page");
        self.wizard.next();
      } else {
        console.log("cant go");
      }
    }
  }));
