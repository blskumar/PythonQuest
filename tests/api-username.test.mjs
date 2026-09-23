import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const routePath = path.join(rootDir, "apps", "web", "app", "api", "username", "route.ts");

const usernamePattern = /^[A-Za-z0-9]{1,16}$/;

// Handler logic replicating apps/web/app/api/username/route.ts with dependency injection for Supabase client
async function handleUsernameCheck(requestUrl, mockRpc) {
  const value = new URL(requestUrl).searchParams.get("value")?.trim() ?? "";
  if (!usernamePattern.test(value)) {
    return {
      status: 400,
      json: { error: "invalid_username" },
    };
  }

  const { data, error } = await mockRpc("is_username_available", { candidate: value });
  if (error) {
    return {
      status: 503,
      json: { error: "availability_check_unavailable" },
    };
  }
  return {
    status: 200,
    json: { available: Boolean(data) },
  };
}

describe("API Route: /api/username (route.ts)", () => {
  it("route.ts file exists and contains expected pattern and RPC call", () => {
    assert.ok(fs.existsSync(routePath), "route.ts must exist");
    const src = fs.readFileSync(routePath, "utf-8");
    assert.match(src, /\/\^\[A-Za-z0-9\]\{1,16\}\$\//, "must define 1-16 alphanumeric username regex");
    assert.match(src, /is_username_available/, "must invoke is_username_available RPC");
    assert.match(src, /status:\s*400/, "must return status 400 for invalid username");
    assert.match(src, /status:\s*503/, "must return status 503 for RPC error");
  });

  describe("Username Pattern Validation (/^[A-Za-z0-9]{1,16}$/)", () => {
    const validUsernames = [
      "a",
      "Z",
      "9",
      "user",
      "Alice",
      "pythonista",
      "PyQuest42",
      "abcdefghijklmnop", // exactly 16 characters
      "1234567890123456", // 16 digits
    ];

    validUsernames.forEach((name) => {
      it(`accepts valid username: "${name}" (${name.length} chars)`, () => {
        assert.equal(usernamePattern.test(name), true);
      });
    });

    const invalidUsernames = [
      { val: "", reason: "empty string" },
      { val: " ", reason: "single space" },
      { val: "   ", reason: "multiple spaces" },
      { val: "abcdefghijklmnopq", reason: "17 characters (exceeds max 16)" },
      { val: "a_b", reason: "contains underscore" },
      { val: "a-b", reason: "contains hyphen" },
      { val: "a.b", reason: "contains dot" },
      { val: "user@domain", reason: "contains at-sign" },
      { val: "user!", reason: "contains exclamation" },
      { val: "user#1", reason: "contains hash" },
      { val: "python 1", reason: "contains space" },
      { val: "snake🐍", reason: "contains emoji" },
      { val: "héctor", reason: "contains non-ASCII accent" },
    ];

    invalidUsernames.forEach(({ val, reason }) => {
      it(`rejects invalid username "${val}": ${reason}`, () => {
        assert.equal(usernamePattern.test(val), false);
      });
    });
  });

  describe("GET Request Handler Logic", () => {
    it("returns 400 with invalid_username error when query param is missing", async () => {
      const mockRpc = async () => ({ data: true, error: null });
      const res = await handleUsernameCheck("http://localhost:3000/api/username", mockRpc);
      assert.equal(res.status, 400);
      assert.deepEqual(res.json, { error: "invalid_username" });
    });

    it("returns 400 with invalid_username error when query param is empty", async () => {
      const mockRpc = async () => ({ data: true, error: null });
      const res = await handleUsernameCheck("http://localhost:3000/api/username?value=", mockRpc);
      assert.equal(res.status, 400);
      assert.deepEqual(res.json, { error: "invalid_username" });
    });

    it("returns 400 with invalid_username error when username contains invalid characters", async () => {
      const mockRpc = async () => ({ data: true, error: null });
      const res = await handleUsernameCheck("http://localhost:3000/api/username?value=bad_user!", mockRpc);
      assert.equal(res.status, 400);
      assert.deepEqual(res.json, { error: "invalid_username" });
    });

    it("returns 400 with invalid_username error when username exceeds 16 chars", async () => {
      const mockRpc = async () => ({ data: true, error: null });
      const res = await handleUsernameCheck(
        "http://localhost:3000/api/username?value=thisusernameistoolongforapp",
        mockRpc
      );
      assert.equal(res.status, 400);
      assert.deepEqual(res.json, { error: "invalid_username" });
    });

    it("returns 200 with { available: true } when username is available", async () => {
      let rpcCalledWith = null;
      const mockRpc = async (fnName, params) => {
        rpcCalledWith = { fnName, params };
        return { data: true, error: null };
      };

      const res = await handleUsernameCheck("http://localhost:3000/api/username?value=newcoder", mockRpc);
      assert.equal(res.status, 200);
      assert.deepEqual(res.json, { available: true });
      assert.deepEqual(rpcCalledWith, {
        fnName: "is_username_available",
        params: { candidate: "newcoder" },
      });
    });

    it("returns 200 with { available: false } when username is already taken", async () => {
      const mockRpc = async () => ({ data: false, error: null });
      const res = await handleUsernameCheck("http://localhost:3000/api/username?value=takenuser", mockRpc);
      assert.equal(res.status, 200);
      assert.deepEqual(res.json, { available: false });
    });

    it("trims whitespace from query parameter before validation and RPC check", async () => {
      let rpcCandidate = null;
      const mockRpc = async (fnName, params) => {
        rpcCandidate = params.candidate;
        return { data: true, error: null };
      };

      const res = await handleUsernameCheck("http://localhost:3000/api/username?value=%20%20alice%20%20", mockRpc);
      assert.equal(res.status, 200);
      assert.deepEqual(res.json, { available: true });
      assert.equal(rpcCandidate, "alice");
    });

    it("returns 503 with availability_check_unavailable error when database RPC fails", async () => {
      const mockRpc = async () => ({
        data: null,
        error: { message: "database connection timeout", code: "PGRST000" },
      });

      const res = await handleUsernameCheck("http://localhost:3000/api/username?value=explorer", mockRpc);
      assert.equal(res.status, 503);
      assert.deepEqual(res.json, { error: "availability_check_unavailable" });
    });
  });
});
