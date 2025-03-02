import { useEffect, useState, type ComponentProps } from "react";

export function ClientOnly({ children }: Pick<ComponentProps<"div">, "children">) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return !mounted ? null : children;
}
