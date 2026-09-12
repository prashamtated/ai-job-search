import { describe, test, expect } from "bun:test";
import { parseJobCards, parseJobDetail } from "../src/helpers";

function searchCard(id: string, title: string, company: string, location: string): string {
  return `<td class="resultContent"><h3 class="jobTitle"><a id="job_${id}" data-jk="${id}" href="/rc/clk?jk=${id}">
    <span title="${title}" id="jobTitle-${id}">${title}</span></a></h3>
    <div class="company_location"><span data-testid="company-name">${company}</span>
    <div data-testid="text-location">${location}</div></div></td>`;
}

describe("parseJobCards", () => {
  test("extracts id, title, company, location from a card", () => {
    const html = searchCard("abc123def0", "DevOps Engineer", "Acme Corp", "Pune, Maharashtra");
    const cards = parseJobCards(html, "in");
    expect(cards).toHaveLength(1);
    expect(cards[0].id).toBe("abc123def0");
    expect(cards[0].title).toBe("DevOps Engineer");
    expect(cards[0].company).toBe("Acme Corp");
    expect(cards[0].location).toBe("Pune, Maharashtra");
    expect(cards[0].url).toBe("https://in.indeed.com/viewjob?jk=abc123def0");
  });

  test("one malformed card does not break parsing of the rest", () => {
    const good1 = searchCard("aaaa111111", "Cloud Engineer", "Foo Inc", "Dubai");
    const malformed = `<td class="resultContent"><h3 class="jobTitle"><a data-jk="bbbb222222"></a></h3></td>`; // no title span
    const good2 = searchCard("cccc333333", "SRE", "Bar Ltd", "Abu Dhabi");
    const cards = parseJobCards(good1 + malformed + good2, "ae");
    expect(cards.map((c) => c.id)).toEqual(["aaaa111111", "cccc333333"]);
  });

  test("extracts an absolute date from the inline createDate blob when present", () => {
    const id = "dddd444444";
    const card = searchCard(id, "Platform Engineer", "Baz", "Pune");
    const blob = `<script>window._initialData={"jobmap":[{"company":"Baz","createDate":1725000000000,"jobkey":"${id}"}]}</script>`;
    const cards = parseJobCards(card + blob, "in");
    expect(cards[0].date).toBe("2024-08-30");
  });

  test("date is null, never guessed, when createDate cannot be found", () => {
    const cards = parseJobCards(searchCard("eeee555555", "QA Engineer", "Qux", "Pune"), "in");
    expect(cards[0].date).toBeNull();
  });
});

describe("parseJobDetail", () => {
  function detailHtml(overrides: Record<string, unknown> = {}): string {
    const ld = {
      "@context": "http://schema.org",
      "@type": "JobPosting",
      datePosted: "2026-09-03T15:21:57.743Z",
      description: "<div><p>Build things.</p><ul><li>Kubernetes</li></ul></div>",
      employmentType: ["FULL_TIME"],
      hiringOrganization: { "@type": "Organization", name: "Siemens" },
      jobLocation: { "@type": "Place", address: { addressLocality: "Pune", addressRegion: "MH", addressCountry: "IN" } },
      title: "DevOps Engineer",
      validThrough: "2027-01-10T13:59:31.230Z",
      ...overrides,
    };
    return `<html><head></head><body><script type="application/ld+json">${JSON.stringify(ld)}</script></body></html>`;
  }

  test("extracts title, company, location, description, dates from JSON-LD", () => {
    const job = parseJobDetail(detailHtml(), "94d2771a7ab59509", "in");
    expect(job).not.toBeNull();
    expect(job!.title).toBe("DevOps Engineer");
    expect(job!.company).toBe("Siemens");
    expect(job!.location).toBe("Pune, MH, IN");
    expect(job!.description).toContain("Build things.");
    expect(job!.description).toContain("Kubernetes");
    expect(job!.date).toBe("2026-09-03");
    expect(job!.deadline).toBe("2027-01-10");
    expect(job!.isActive).toBe(true);
  });

  test("returns null when no JSON-LD JobPosting block is present", () => {
    const job = parseJobDetail("<html><body>no data here</body></html>", "xyz", "in");
    expect(job).toBeNull();
  });

  test("flags a posting as inactive when the expiry phrase is present", () => {
    const html = detailHtml() + "<div>This job posting has expired.</div>";
    const job = parseJobDetail(html, "94d2771a7ab59509", "in");
    expect(job!.isActive).toBe(false);
  });
});
