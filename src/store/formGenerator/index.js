import { types, flow } from "mobx-state-tree";
import { WizardStore } from "../wizard";
import axios from "axios";

const error = types.model("error", {
  status: types.optional(types.boolean, false),
  intent: types.optional(types.string, "DANGER"),
  errorMessage: types.optional(types.string, "Missign fields")
});

const array = types.model("array", {
  name: types.optional(types.string, ""),
  data: types.optional(types.array(types.frozen), [])
});

const object = types.model('object', {
  name: types.optional(types.string, ''),
  data: types.optional(types.frozen, {})
})

const action = types.model('action', {
  type: types.optional(types.string, ''), //push, delete, send, custom
  target: types.optional(types.string, ''), // custom array defined for the user
  fields: types.optional(types.array(types.frozen), []), //schema of the object pushed to the the array
})

const field = types
  .model("field", {
    index: types.number,
    action: types.optional(action, {}),
    placeholder: types.optional(types.string, ""),
    value: types.optional(types.string, ""),
    values: types.optional(types.array(types.string), []),
    options: types.optional(types.array(types.frozen), []),
    query: types.optional(types.frozen, {}),
    endPoint: types.optional(types.string, "/formQueries"),
    externalSource: types.optional(types.boolean, false),
    fetched: types.optional(types.boolean, false),
    isNumeric: types.optional(types.boolean, false),
    required: types.optional(types.boolean, false),
    type: types.string,
    name: types.string,
    disabled: types.optional(types.boolean, false),
    error: types.optional(types.boolean, false)
  })
  .actions(self => {
    const getOptions = flow(function*() {
      try {
        const resp = yield axios.post(
          localStorage.getItem("serverURI") + self.endPoint,
          { query: self.query }
        );
        self.options = resp.data.data.map(opt => ({
          value: opt[self.query.parameters.value],
          label: opt[self.query.parameters.label]
        }));
        self.fetched = true;
      } catch (error) {
        console.error(error);
      }
    });
    
    return {
      getOptions,
      setValue(value) {
        self.value = value;
        self.error = false;
      }
    };
  });

const element = types.model("elements", {
  page: types.number,
  objects: types.optional(types.array(object), []), //custom objects defined for the user
  arrays: types.optional(types.array(array), []), // custom arrays defined for the user
  fields: types.optional(types.array(field), []),
  title: types.optional(types.string, "")
}).actions(self=>{
  const push = (item) => {
    let obj = {}
    item.action.fields.map((field)=>{
      obj[Object.keys(field)[0]] = self.fields[Object.values(field)[0]].value;
    });
    self.arrays.map((arr)=> {
      if (arr.name === item.action.target){
        arr.data.push(obj);
      }
    })
  }

  return { push }
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
