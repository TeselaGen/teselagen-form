import { types } from "mobx-state-tree";

export const WizardStore = types
  .model("WizardStore", {
    page: types.optional(types.number,0),
    pages: types.optional(types.number,0),
  })
  .views(self => ({
    get currentPage() {
      return self.page;
    }
  }))
  .actions(self => ({
    next() {
      if ((self.pages - 1) > self.page) {
        self.page++;
      }
    },
    prev() {
      if (self.page >= 0) {
        self.page--;
      }
    },
    setPage(newPage){
      self.page = newPage
    }
  }));
