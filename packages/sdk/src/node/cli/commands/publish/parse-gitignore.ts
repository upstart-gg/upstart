/*!
 * parse-gitignore <https://github.com/jonschlinkert/parse-gitignore>
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 *
 * Converted to typescript by Matthias E. <matthias@upstart.gg>
 */

import * as fs from "node:fs";

// eslint-disable-next-line no-control-regex
const INVALID_PATH_CHARS_REGEX = /[<>"|?*\n\r\t\f\x00-\x1F]/;
const GLOBSTAR_REGEX = /(?:^|\/)[*]{2}($|\/)/;
const MAX_PATH_LENGTH = 260 - 12;

interface ParseOptions {
  path?: string;
  dedupe?: boolean;
  unique?: boolean;
  ignore?: string[];
  unignore?: string[];
  format?: boolean;
  formatSection?: (section: Section) => string;
}

interface Section {
  name: string;
  comment?: string;
  patterns: string[];
}

interface ParsedGitignore {
  sections: Section[];
  patterns: string[];
  path?: string;
  input: Buffer;
  format: (opts?: ParseOptions) => string;
  dedupe: (opts?: ParseOptions) => ParsedGitignore;
  globs: (opts?: ParseOptions) => GlobResult[];
}

interface GlobResult {
  type: "ignore" | "unignore";
  path: string | null;
  patterns: string[];
  index: number;
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object" && !Array.isArray(v);

const isValidPath = (input: unknown): input is string =>
  typeof input === "string" && input.length <= MAX_PATH_LENGTH && !INVALID_PATH_CHARS_REGEX.test(input);

const split = (str: string): string[] => str.split(/\r\n?|\n/);
const isComment = (str: string): boolean => str.startsWith("#");
const isParsed = (input: unknown): input is ParsedGitignore =>
  isObject(input) && Array.isArray(input.patterns) && Array.isArray(input.sections);

const patterns = (input: string): string[] =>
  split(input)
    .map((l) => l.trim())
    .filter((line) => line !== "" && !isComment(line));

const parse = (input: string | ParsedGitignore, options: ParseOptions = {}): ParsedGitignore => {
  let filepath = options.path;

  if (isParsed(input)) return input;
  if (isValidPath(input) && fs.existsSync(input)) {
    filepath = input;
    input = fs.readFileSync(input, "utf8");
  }

  const lines = split(input);
  const names = new Map<string, Section>();

  let parsed: ParsedGitignore = { sections: [], patterns: [] } as unknown as ParsedGitignore;
  let section: Section = { name: "default", patterns: [] };
  let prev: Section | null = null;

  for (const line of lines) {
    const value = line.trim();

    if (value.startsWith("#")) {
      const [, name] = /^#+\s*(.*)\s*$/.exec(value) || [];

      if (prev) {
        names.delete(prev.name);
        prev.comment = prev.comment ? `${prev.comment}\n${value}` : value;
        prev.name = name ? `${prev.name.trim()}\n${name.trim()}` : prev.name.trim();
        names.set(prev.name.toLowerCase().trim(), prev);
        continue;
      }

      section = { name: name?.trim() || "", comment: value, patterns: [] };
      names.set(section.name.toLowerCase(), section);
      parsed.sections.push(section);
      prev = section;
      continue;
    }

    if (value !== "") {
      section.patterns.push(value);
      parsed.patterns.push(value);
    }

    prev = null;
  }

  if (options.dedupe === true || options.unique === true) {
    parsed = dedupe(parsed, { ...options, format: false });
  }

  parsed.path = filepath;
  parsed.input = Buffer.from(input);
  parsed.format = (opts?: ParseOptions) => format(parsed, { ...options, ...opts });
  parsed.dedupe = (opts?: ParseOptions) => dedupe(parsed, { ...options, ...opts });
  parsed.globs = (opts?: ParseOptions) => globs(parsed, { path: filepath, ...options, ...opts });
  return parsed;
};

const parseFile = (filepath: string, options?: ParseOptions): ParsedGitignore =>
  parse(fs.readFileSync(filepath, "utf8"), options);

const dedupe = (input: string | ParsedGitignore, options: ParseOptions): ParsedGitignore => {
  const parsed = parse(input, { ...options, dedupe: false });

  const names = new Map<string, Section>();
  const res: ParsedGitignore = { sections: [], patterns: [] } as unknown as ParsedGitignore;
  let current: Section;

  // first, combine duplicate sections
  for (const section of parsed.sections) {
    const { name = "", comment, patterns } = section;
    const key = name.trim().toLowerCase();

    for (const pattern of patterns) {
      if (!res.patterns.includes(pattern)) {
        res.patterns.push(pattern);
      }
    }

    if (name && names.has(key)) {
      current = names.get(key)!;
      current.patterns = [...current.patterns, ...patterns];
    } else {
      current = { name, comment, patterns };
      res.sections.push(current);
      names.set(key, current);
    }
  }

  // next, de-dupe patterns in each section
  for (const section of res.sections) {
    section.patterns = [...new Set(section.patterns)];
  }

  return res;
};

const glob = (pattern: string): string => {
  // Return if a glob pattern has already been specified for sub-directories
  if (GLOBSTAR_REGEX.test(pattern)) {
    return pattern;
  }

  // If there is a separator at the beginning or middle (or both) of the pattern,
  // then the pattern is relative to the directory level of the particular .gitignore
  // file itself. Otherwise the pattern may also match at any level below the
  // .gitignore level. relative paths only
  let relative = false;
  if (pattern.startsWith("/")) {
    pattern = pattern.slice(1);
    relative = true;
  } else if (pattern.slice(1, pattern.length - 1).includes("/")) {
    relative = true;
  }

  // If there is a separator at the end of the pattern then the pattern will only match directories.
  pattern += pattern.endsWith("/") ? "**/" : "/**";

  // If not relative, the pattern can match any files and directories.
  return relative ? pattern : `**/${pattern}`;
};

const globs = (input: string | ParsedGitignore, options: ParseOptions = {}): GlobResult[] => {
  const parsed = parse(input, options);
  const result: GlobResult[] = [];
  let index = 0;

  const globPatterns = parsed.patterns
    .concat(options.ignore || [])
    .concat((options.unignore || []).map((p) => (!p.startsWith("!") ? `!${p}` : p)));

  const push = (prefix: string, pattern: string) => {
    const prev = result[result.length - 1];
    const type = prefix ? "unignore" : "ignore";

    if (prev && prev.type === type) {
      if (!prev.patterns.includes(pattern)) {
        prev.patterns.push(pattern);
      }
    } else {
      result.push({ type, path: options.path || null, patterns: [pattern], index });
      index++;
    }
  };

  for (let pattern of globPatterns) {
    let prefix = "";

    // An optional prefix "!" which negates the pattern; any matching file excluded by
    // a previous pattern will become included again
    if (pattern.startsWith("!")) {
      pattern = pattern.slice(1);
      prefix = "!";
    }

    // add the raw pattern to the results
    push(prefix, pattern.startsWith("/") ? pattern.slice(1) : pattern);

    // add the glob pattern to the results
    push(prefix, glob(pattern));
  }

  return result;
};

/**
 * Formats a .gitignore section
 */
const formatSection = (section: Section = { name: "", patterns: [] }): string => {
  const output = [section.comment || ""];

  if (section.patterns?.length) {
    output.push(section.patterns.join("\n"));
    output.push("");
  }

  return output.join("\n");
};

/**
 * Format a .gitignore file from the given input or object from `.parse()`.
 * @param {String | ParsedGitignore} input File path or contents.
 * @param {ParseOptions} options
 * @return {String} Returns formatted string.
 * @api public
 */
const format = (input: string | ParsedGitignore, options: ParseOptions = {}): string => {
  const parsed = parse(input, options);

  const fn = options.formatSection || formatSection;
  const sections = parsed.sections || parsed;
  const output: string[] = [];

  for (const section of ([] as Section[]).concat(sections)) {
    output.push(fn(section));
  }

  return output.join("\n");
};

export {
  parse,
  parseFile,
  dedupe,
  format,
  globs,
  formatSection,
  patterns,
  type ParseOptions,
  type Section,
  type ParsedGitignore,
  type GlobResult,
};

export default parse;
