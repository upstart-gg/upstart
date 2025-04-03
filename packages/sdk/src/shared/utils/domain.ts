import { customAlphabet } from "nanoid";

export function getUpstartDomainNameForEnv(env: "production" | "preview" | "development" | "test") {
  switch (env) {
    case "production":
      return "upstart.do";
    case "preview":
      return "upstarted.online";
    default:
      return "upstart.test";
  }
}

export const subdomainGenerator = customAlphabet("abcdefghjkmnopqrstuvwxyz23456789", 8);

export function getRandomHostnameForEnv(env: "production" | "preview" | "development" | "test") {
  const domain = getUpstartDomainNameForEnv(env);
  return `${subdomainGenerator()}.${domain}`;
}
