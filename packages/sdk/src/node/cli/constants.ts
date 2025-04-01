export const CLI_PROJECT_NAME = "upstart-cli";
export const CLI_LOGIN_POLL_INTERVAL = 5000; // seconds
export const CLI_LOGIN_CLIENT_ID =
  process.env.PUBLIC_UPSTART_OAUTH_CLIENT_ID ?? "50000000-0000-0000-0000-000000000001";

export const API_BASE_URL = process.env.PUBLIC_UPSTART_API_BASE_URL ?? "https://api.upstart.gg";
export const EDITOR_BASE_URL = process.env.PUBLIC_UPSTART_EDITOR_BASE_URL ?? "https://upstart.gg";
export const DEFAULT_UPLOAD_MAX_CONCURRENCY = 10;

export const OAUTH_ENDPOINT_DEVICE_CODE = "oauth/devicecode";
export const OAUTH_ENDPOINT_TOKEN = "oauth/token";
export const OAUTH_ENDPOINT_USER_INFO = "oauth/userinfo";

export const API_ENDPOINT_REGISTER_TEMPLATE = "v1/templates";
