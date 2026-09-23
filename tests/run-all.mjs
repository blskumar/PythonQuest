import { run } from "node:test";
import { spec } from "node:test/reporters";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testFiles = [
  path.join(__dirname, "data-schema.test.mjs"),
  path.join(__dirname, "components.test.mjs"),
  path.join(__dirname, "api-username.test.mjs"),
  path.join(__dirname, "supabase-schema.test.mjs"),
  path.join(__dirname, "curriculum-and-gamification.test.mjs"),
  path.join(__dirname, "experience-and-progression.test.mjs"),
  path.join(__dirname, "home-auth-nav.test.mjs"),
];

console.log("=================================================");
console.log("🐍 Python Quest MVP Automated Test Runner");
console.log("=================================================");
console.log(`Running ${testFiles.length} test suites with Node.js test runner...\n`);

let passedCount = 0;
let failedCount = 0;
const startTime = Date.now();

const testStream = run({ files: testFiles });

testStream.on("test:pass", () => {
  passedCount++;
});

testStream.on("test:fail", () => {
  failedCount++;
});

testStream.compose(new spec()).pipe(process.stdout);

testStream.on("end", () => {
  const durationMs = Date.now() - startTime;
  console.log("\n=================================================");
  console.log("📊 Test Execution Summary");
  console.log("=================================================");
  console.log(`Suites executed : ${testFiles.length}`);
  console.log(`Passed tests    : ${passedCount}`);
  console.log(`Failed tests    : ${failedCount}`);
  console.log(`Total duration  : ${durationMs} ms`);
  console.log("=================================================");

  if (failedCount > 0) {
    console.error("❌ Some tests failed!");
    process.exit(1);
  } else {
    console.log("✅ All tests passed cleanly!");
    process.exit(0);
  }
});
