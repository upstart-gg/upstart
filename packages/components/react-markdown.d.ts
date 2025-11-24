// react-markdown.d.ts
import "react-markdown";

declare module "react-markdown" {
  interface Components {
    choices?: React.ComponentType<"div">;
    choice?: React.ComponentType<"button">;
  }
}
