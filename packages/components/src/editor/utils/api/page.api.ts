import { patch } from "./base-api";

type UpdatePageParams = {
  id: string;
  siteId: string;
};

export function updatePage(payload: Record<string, unknown>, info: UpdatePageParams) {
  return patch(`/sites/${info.siteId}/pages/${info.id}/versions/latest`, payload)
    .then((res) => {
      console.log("Page version saved");
      console.log(res);
    })
    .catch((err) => {
      console.error("Error while updating page version");
      console.log(err);
    });
}
