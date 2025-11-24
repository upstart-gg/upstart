type ClassCategory =
  | "spacing"
  | "sizing"
  | "color"
  | "typography"
  | "layout"
  | "flexbox"
  | "grid"
  | "border"
  | "effects"
  | "filters"
  | "transitions"
  | "transforms"
  | "interactivity"
  | "unknown";

interface ParsedClass {
  original: string;
  category: ClassCategory;
  property: string;
  value: string | null;
  modifier?: string; // hover:, focus:, md:, etc.
  isNegative?: boolean;
}

interface CategorizedClasses {
  classes: ParsedClass[];
  byCategory: Record<ClassCategory, ParsedClass[]>;
}

/**
 * Parses a Tailwind CSS class string and categorizes each class
 * @param classString - Space-separated string of Tailwind classes
 * @returns Categorized classes with metadata
 */
export function parseTailwindClasses(classString: string): CategorizedClasses {
  const classes = classString.trim().split(/\s+/).filter(Boolean);
  const parsed: ParsedClass[] = [];
  const byCategory: Record<ClassCategory, ParsedClass[]> = {
    spacing: [],
    sizing: [],
    color: [],
    typography: [],
    layout: [],
    flexbox: [],
    grid: [],
    border: [],
    effects: [],
    filters: [],
    transitions: [],
    transforms: [],
    interactivity: [],
    unknown: [],
  };

  for (const className of classes) {
    const parsedClass = parseClass(className);
    parsed.push(parsedClass);
    byCategory[parsedClass.category].push(parsedClass);
  }

  return { classes: parsed, byCategory };
}

function parseClass(className: string): ParsedClass {
  // Extract modifiers (hover:, focus:, md:, etc.)
  const modifierMatch = className.match(/^([\w-]+:)+/);
  const modifier = modifierMatch ? modifierMatch[0].slice(0, -1) : undefined;
  const baseClass = modifier ? className.slice(modifier.length + 1) : className;

  // Check for negative values
  const isNegative = baseClass.startsWith("-");
  const cleanClass = isNegative ? baseClass.slice(1) : baseClass;

  // Try to extract property and value
  const match = cleanClass.match(/^([a-z]+)-(.+)$/);

  if (!match) {
    // Classes without dash (like flex, block, hidden)
    return {
      original: className,
      category: categorizeProperty(cleanClass),
      property: cleanClass,
      value: null,
      modifier,
      isNegative,
    };
  }

  const [, property, value] = match;
  const category = categorizeProperty(property);

  return {
    original: className,
    category,
    property,
    value,
    modifier,
    isNegative,
  };
}

function categorizeProperty(property: string): ClassCategory {
  // Spacing
  if (
    [
      "p",
      "px",
      "py",
      "pt",
      "pb",
      "pl",
      "pr",
      "m",
      "mx",
      "my",
      "mt",
      "mb",
      "ml",
      "mr",
      "space",
      "gap",
    ].includes(property)
  ) {
    return "spacing";
  }

  // Sizing
  if (["w", "h", "min-w", "min-h", "max-w", "max-h", "size"].includes(property)) {
    return "sizing";
  }

  // Colors
  if (
    ["bg", "text", "border", "ring", "fill", "stroke", "outline"].some((prefix) =>
      property.startsWith(prefix),
    )
  ) {
    return "color";
  }

  // Typography
  if (
    [
      "font",
      "text",
      "leading",
      "tracking",
      "decoration",
      "italic",
      "underline",
      "line-through",
      "uppercase",
      "lowercase",
      "capitalize",
      "normal-case",
      "truncate",
      "break",
      "whitespace",
    ].includes(property)
  ) {
    return "typography";
  }

  // Layout
  if (
    [
      "block",
      "inline",
      "flex",
      "grid",
      "hidden",
      "table",
      "flow",
      "container",
      "static",
      "fixed",
      "absolute",
      "relative",
      "sticky",
      "top",
      "right",
      "bottom",
      "left",
      "inset",
      "z",
      "float",
      "clear",
      "overflow",
      "overscroll",
    ].includes(property)
  ) {
    return "layout";
  }

  // Flexbox
  if (
    ["flex", "justify", "items", "content", "self", "grow", "shrink", "basis", "order"].includes(property)
  ) {
    return "flexbox";
  }

  // Grid
  if (["grid", "col", "row", "auto-cols", "auto-rows", "gap"].includes(property)) {
    return "grid";
  }

  // Border
  if (["border", "rounded", "ring", "divide"].includes(property)) {
    return "border";
  }

  // Effects
  if (["shadow", "opacity", "mix", "bg-blend", "backdrop"].includes(property)) {
    return "effects";
  }

  // Filters
  if (
    [
      "blur",
      "brightness",
      "contrast",
      "grayscale",
      "hue",
      "invert",
      "saturate",
      "sepia",
      "drop-shadow",
      "backdrop-blur",
      "backdrop-brightness",
      "backdrop-contrast",
      "backdrop-grayscale",
      "backdrop-hue",
      "backdrop-invert",
      "backdrop-opacity",
      "backdrop-saturate",
      "backdrop-sepia",
    ].includes(property)
  ) {
    return "filters";
  }

  // Transitions
  if (["transition", "duration", "ease", "delay", "animate"].includes(property)) {
    return "transitions";
  }

  // Transforms
  if (["scale", "rotate", "translate", "skew", "origin"].includes(property)) {
    return "transforms";
  }

  // Interactivity
  if (
    [
      "cursor",
      "pointer-events",
      "resize",
      "select",
      "appearance",
      "accent",
      "caret",
      "scroll",
      "snap",
      "touch",
    ].includes(property)
  ) {
    return "interactivity";
  }

  return "unknown";
}

// Example usage:
// const example = parseTailwindClasses(
//   "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200",
// );
