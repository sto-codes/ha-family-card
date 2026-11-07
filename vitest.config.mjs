import { defineConfig } from "vitest/config";

// Run the date math in a zone with daylight-saving switches, so DST bugs show up
// the same way on every machine and in CI (the workers inherit this variable).
process.env.TZ = "Europe/Berlin";

export default defineConfig({});
