// Live smoke test against real Indeed pages, per add-portal.md's Step 4
// contract ("never register a portal skill that has not returned real
// results"). Network-dependent; skip locally with `bun test -t '^(?!Live)'`
// if you're offline. Keeps volume to one search + one detail fetch.
import { describe, test, expect } from "bun:test";
import { runCLI } from "./helpers";

describe("Live Indeed search + detail", () => {
  test("search returns at least one real result with non-null id/title/url", async () => {
    const result = await runCLI([
      "search", "-c", "in", "-q", "devops engineer", "-l", "Pune", "--limit", "5",
    ]);
    expect(result.exitCode).toBe(0);
    const parsed = JSON.parse(result.stdout);
    expect(parsed.results.length).toBeGreaterThan(0);
    const first = parsed.results[0];
    expect(first.id).toBeTruthy();
    expect(first.title).toBeTruthy();
    expect(first.url).toContain("in.indeed.com/viewjob?jk=");
  }, 30000);

  test("detail on a real id returns a readable description", async () => {
    const search = await runCLI(["search", "-c", "in", "-q", "devops engineer", "-l", "Pune", "--limit", "1"]);
    const { results } = JSON.parse(search.stdout);
    expect(results.length).toBeGreaterThan(0);

    const result = await runCLI(["detail", results[0].id, "-c", "in", "--format", "plain"]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout.length).toBeGreaterThan(20);
    expect(result.stdout).not.toContain("(cid:");
    expect(result.stdout).not.toContain("<");
  }, 30000);
});
