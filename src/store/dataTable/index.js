import { types, flow } from "mobx-state-tree";
import axios from "axios";
import { slice } from "lodash";

export const dataTableStore = types
  .model("dataTableStore", {
    page: types.optional(types.number, 1),
    totalPages: types.optional(types.number, 0),
    entities: types.optional(types.array(types.frozen), []),
    sortBy: types.optional(types.string, ""),
    search: types.optional(types.string, ""),
    fetching: types.optional(types.boolean, true),
    externalSource: types.optional(types.boolean, false),
    endPoint: types.optional(types.string, "/dataTable"),
    initialIndex: types.optional(types.number, 0),
    rowsPerPage: types.optional(types.number, 10)
  })
  .actions(self => {
    const fetchData = flow(function*(data) {
      try {
        if (self.externalSource) {
          let resp = yield axios.post(
            localStorage.getItem("serverURI") + self.endPoint,
            {
              query: {
                entity: data.entity,
                colls: data.colls
              }
            }
          );
					self.entities = resp.data.data;
          self.totalPages = parseInt(resp.data.data.length / self.rowsPerPage);
          self.fetching = false;
        }
      } catch (error) {
        console.error(error);
      }
    });
    return {
      fetchData,
      setPage(newPage){
        if(newPage > 1 && newPage <= self.totalPages){
          self.page = newPage;
        }
      },
      setRowsPerPage(value){
        self.rowsPerPage = value;
      },
			nextPage(){
				if(self.totalPages > self.page) {
					self.page++;
					self.initialIndex = self.initialIndex + self.rowsPerPage
				}
			},
			prevPage() {
				if(self.page > 1){
					self.page--;
					self.initialIndex = self.initialIndex - self.rowsPerPage
				}
			}
		};
  })
  .views(self => ({
    get listRows() {
      return slice(
        self.entities,
        self.initialIndex,
        self.initialIndex + self.rowsPerPage
      );
    }
  }));
