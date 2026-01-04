import { describe, expect, it } from "vitest";

import { getFormattedDate, millisToMinutesAndSeconds } from "./index";

describe("getFormattedDate", () => {
  it("formats a timestamp to human-readable date", () => {
    // Use a date that won't shift days across timezones (noon UTC)
    const timestamp = Date.UTC(2024, 0, 15, 12, 0, 0);
    expect(getFormattedDate(timestamp)).toBe("January 15, 2024");
  });

  it("formats an ISO date string", () => {
    // Use noon UTC to avoid timezone day shifts
    expect(getFormattedDate("2024-01-15T12:00:00.000Z")).toBe(
      "January 15, 2024"
    );
  });

  it("handles different months correctly", () => {
    expect(getFormattedDate("2024-06-15T12:00:00.000Z")).toBe("June 15, 2024");
    expect(getFormattedDate("2024-12-25T12:00:00.000Z")).toBe(
      "December 25, 2024"
    );
  });

  it("formats dates at the end of the year", () => {
    expect(getFormattedDate("2024-12-31T12:00:00.000Z")).toBe(
      "December 31, 2024"
    );
  });

  it("formats dates at the beginning of the year", () => {
    expect(getFormattedDate("2024-01-01T12:00:00.000Z")).toBe(
      "January 1, 2024"
    );
  });
});

describe("millisToMinutesAndSeconds", () => {
  it("formats milliseconds to MM:SS format", () => {
    expect(millisToMinutesAndSeconds(180_000)).toBe("3:00");
    expect(millisToMinutesAndSeconds(185_000)).toBe("3:05");
    expect(millisToMinutesAndSeconds(245_000)).toBe("4:05");
  });

  it("pads seconds with leading zero when under 10", () => {
    expect(millisToMinutesAndSeconds(65_000)).toBe("1:05");
    expect(millisToMinutesAndSeconds(61_000)).toBe("1:01");
  });

  it("handles zero", () => {
    expect(millisToMinutesAndSeconds(0)).toBe("0:00");
  });

  it("handles songs over 10 minutes", () => {
    expect(millisToMinutesAndSeconds(600_000)).toBe("10:00");
    expect(millisToMinutesAndSeconds(754_000)).toBe("12:34");
  });

  it("handles typical song durations", () => {
    expect(millisToMinutesAndSeconds(210_000)).toBe("3:30");
    expect(millisToMinutesAndSeconds(255_000)).toBe("4:15");
  });
});
