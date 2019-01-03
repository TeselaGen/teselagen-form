import { types } from "mobx-state-tree";
import { slice } from 'lodash'

export const dataImporterStore = types
  .model("dataImporterStore", {
    page: types.optional(types.number, 1),
    totalPages: types.optional(types.number, 0),
    entities: types.optional(types.array(types.frozen), []),
    sortBy: types.optional(types.string, ""),
    search: types.optional(types.string, ""),
    rowsPerPage: types.optional(types.number, 5),
    fetching: types.optional(types.boolean, true),
    initialIndex: types.optional(types.number, 0),
  })
  .views(self => ({
    get listRows() {
      return slice(
        self.rows,
        self.initialIndex,
        self.initialIndex + self.rowsPerPage
      );
    }
  }))
  .actions(self => {
    return {
      setEntities(rows){
        self.entities = rows
      },
      setPage(newPage) {
        if (newPage > 1 && newPage <= self.totalPages) {
          self.page = newPage;
        }
      },
      setRowsPerPage(value) {
        self.rowsPerPage = value;
      },
      nextPage() {
        if (self.totalPages > self.page) {
          self.page++;
          self.initialIndex = self.initialIndex + self.rowsPerPage;
        }
      },
      prevPage() {
        if (self.page > 1) {
          self.page--;
          self.initialIndex = self.initialIndex - self.rowsPerPage;
        }
      }
    };
  })
