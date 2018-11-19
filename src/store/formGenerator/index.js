import { types, flow } from "mobx-state-tree";
import { WizardStore } from "../wizard";

const error = types.model("error", {
  status: types.optional(types.boolean, false),
  intent: types.optional(types.string, "DANGER"),
  errorMessage: types.optional(types.string, "Missign fields")
});

const field = types
  .model("field", {
    index: types.number,
    placeholder: types.optional(types.string, ""),
    value: types.optional(types.string, ""),
    values: types.optional(types.array(types.string), []),
    options: types.optional(types.array(types.frozen), []),
    query: types.optional(types.frozen, {}),
    isNumeric: types.optional(types.boolean, false),
    required: types.optional(types.boolean, false),
    type: types.string,
    name: types.string,
    disabled: types.optional(types.boolean, false),
    error: types.optional(types.boolean, false)
  })
  .actions(self => {
    return {
      setValue(value) {
        self.value = value;
        self.error = false;
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
    wizard: types.optional(WizardStore, { page: 0, pages: 1 }),
    error: types.optional(error, {})
  })
  .actions(self => ({
    setElements(array) {
      return array.map(item => self.fields.push(item));
    },
    nextPage(currentPage) {
      let reqiredList = self.elements[currentPage].fields.filter(
        field => field.required
      );
      let completeList = reqiredList.filter(field =>
        field.type !== "selectField" ? field.value === "" : field.values === []
      );
      reqiredList.map(field => {
        if (
          (field.type === "selectField" && field.values === []) ||
          (field.type !== "selectField" && field.value === "")
        ) {
          console.log(field);
          self.elements[currentPage].fields[field.index].error = true;
        }
      });
      if (completeList.length === 0) {
        console.log("next page");
        self.error.status = false;
        self.wizard.next();
      } else {
        self.error.status = true;
        console.log("cant go");
      }
    }
  }));
