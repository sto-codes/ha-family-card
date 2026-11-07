import { describe, expect, it } from "vitest";
import {
  ageDays,
  formatDate,
  idsUrl,
  listUrl,
  normalizeConfig,
  sameTags,
  splitService,
  toggleTag,
} from "./paperless";

describe("normalizeConfig", () => {
  it("fills defaults and trims the url", () => {
    const c = normalizeConfig({ type: "x", url: "http://p:8000/", token: "t", tag: 15 });
    expect(c.url).toBe("http://p:8000");
    expect(c.tags).toEqual([15]);
    expect(c.paid_tag).toBe(15);
    expect(c.service).toBe("rest_command.paperless_tags_setzen");
    expect(c.refresh).toBe(300);
  });
  it("rejects missing fields", () => {
    expect(() => normalizeConfig({ token: "t", tag: 1 })).toThrow(/url/);
    expect(() => normalizeConfig({ url: "u", tag: 1 })).toThrow(/token/);
    expect(() => normalizeConfig({ url: "u", token: "t" })).toThrow(/tag/);
  });
  it("keeps the refresh above 30 s", () => {
    expect(normalizeConfig({ url: "u", token: "t", tag: 1, refresh: 5 }).refresh).toBe(30);
  });
});

describe("urls", () => {
  it("lists by tag, oldest first", () => {
    expect(listUrl("http://p", 15)).toBe(
      "http://p/api/documents/?tags__id__all=15&ordering=created&page_size=50&fields=id,title,correspondent,created,tags",
    );
  });
  it("dedupes ids", () => {
    expect(idsUrl("http://p", "tags", [3, 3, 4])).toBe(
      "http://p/api/tags/?id__in=3,4&page_size=100",
    );
  });
});

describe("toggleTag", () => {
  it("adds and removes", () => {
    expect(toggleTag([13, 15], 15)).toEqual([13]);
    expect(toggleTag([13], 18)).toEqual([13, 18]);
  });
});

describe("splitService", () => {
  it("splits domain and service", () => {
    expect(splitService("rest_command.paperless_tags_setzen")).toEqual([
      "rest_command",
      "paperless_tags_setzen",
    ]);
    expect(() => splitService("kaputt")).toThrow();
  });
});

describe("dates", () => {
  it("formats German", () => {
    expect(formatDate("2026-10-28")).toBe("28.10.2026");
    expect(formatDate("")).toBe("");
  });
  it("counts days", () => {
    expect(ageDays("2026-11-01", new Date(2026, 10, 7, 12))).toBe(6);
    expect(ageDays("kaputt", new Date())).toBe(0);
  });
});

describe("sameTags", () => {
  it("ignores order", () => {
    expect(sameTags([1, 2], [2, 1])).toBe(true);
    expect(sameTags([1], [1, 2])).toBe(false);
  });
});
