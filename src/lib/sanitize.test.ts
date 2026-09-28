import { describe, expect, it } from "vitest";
import { sanitizeProductHtml } from "./sanitize";

describe("sanitizeProductHtml", () => {
  it("keeps the formatting the admin editor produces", () => {
    // Taken from a real product description.
    const quill =
      '<h5><strong>Features</strong></h5><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>' +
      '<span style="color: rgb(34, 34, 34); background-color: rgb(255, 255, 255);">Long read range</span></li></ol><p>Text<br></p>';
    const clean = sanitizeProductHtml(quill);
    expect(clean).toContain("<h5><strong>Features</strong></h5>");
    expect(clean).toContain('<li data-list="bullet">');
    expect(clean).toContain('<span class="ql-ui"></span>');
    expect(clean).toContain('style="color:rgb(34, 34, 34);background-color:rgb(255, 255, 255)"');
    expect(clean).not.toContain("contenteditable");
  });

  it("removes scripts and inline event handlers", () => {
    const clean = sanitizeProductHtml(
      '<p onclick="steal()">Hi</p><script>steal()</script><img src="x" onerror="steal()">'
    );
    expect(clean).not.toMatch(/script|onclick|onerror|steal/);
    expect(clean).toContain("<p>Hi</p>");
  });

  it("neutralises javascript: links and hardens real ones", () => {
    expect(sanitizeProductHtml('<a href="javascript:alert(1)">x</a>')).not.toContain("javascript:");
    expect(sanitizeProductHtml('<a href="https://example.com" target="_blank">x</a>')).toBe(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">x</a>'
    );
  });

  it("drops styles that could load resources or break layout", () => {
    const clean = sanitizeProductHtml(
      '<span style="background-image: url(https://evil.example/t.png); position: fixed; color: red">x</span>'
    );
    expect(clean).toBe('<span style="color:red">x</span>');
  });

  it("strips iframes, forms and other embeds entirely", () => {
    expect(sanitizeProductHtml('<iframe src="https://evil.example"></iframe><form><input></form>ok')).toBe("ok");
  });

  it("allows pasted data: images but not data: links", () => {
    expect(sanitizeProductHtml('<img src="data:image/png;base64,AAAA">')).toContain("data:image/png");
    expect(sanitizeProductHtml('<a href="data:text/html,<script>x</script>">x</a>')).not.toContain("data:");
  });

  it("handles an empty description", () => {
    expect(sanitizeProductHtml(undefined)).toBe("");
    expect(sanitizeProductHtml("")).toBe("");
  });
});
