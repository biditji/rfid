import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, createProduct, fetchAllOrders, fetchProductsResult, uploadImage } from "./api";

type Call = { url: string; init?: RequestInit };

function mockFetch(respond: (url: URL) => Response) {
  const calls: Call[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL, init?: RequestInit) => {
      calls.push({ url: String(input), init });
      return respond(new URL(String(input)));
    })
  );
  return calls;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchProductsResult", () => {
  it("walks every page so products past the backend's page size aren't dropped", async () => {
    const calls = mockFetch((url) => {
      const page = Number(url.searchParams.get("page"));
      return json({ products: [{ _id: `p${page}` }], page, pages: 3, total: 3 });
    });

    const { products, ok } = await fetchProductsResult();

    expect(ok).toBe(true);
    expect(products.map((p) => p._id)).toEqual(["p1", "p2", "p3"]);
    expect(calls).toHaveLength(3);
  });

  it("asks only for enabled products when reading for the storefront", async () => {
    const calls = mockFetch(() => json({ products: [], page: 1, pages: 1, total: 0 }));
    await fetchProductsResult({ activeOnly: true, limit: 13 });
    const url = new URL(calls[0].url);
    expect(url.searchParams.get("status")).toBe("true");
    expect(url.searchParams.get("limit")).toBe("13");
  });

  it("reports failure instead of pretending the catalog is empty", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetch(() => json({ message: "nope" }, 400));
    expect(await fetchProductsResult()).toEqual({ products: [], ok: false });
  });
});

describe("public reads from the browser (the admin panel)", () => {
  // `isServer` is fixed when the module loads, so load a fresh copy with a
  // `window` present to get the browser behaviour.
  async function loadAsBrowser() {
    vi.resetModules();
    vi.stubGlobal("window", {});
    return import("./api");
  }

  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("repeats a blocked direct call through the same-origin proxy", async () => {
    const { fetchCategoriesResult } = await loadAsBrowser();
    const calls: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) => {
        calls.push(input);
        // What a CORS block looks like to page script.
        if (input.startsWith("https://")) throw new TypeError("Failed to fetch");
        return json([{ _id: "c1", name: "Readers" }]);
      })
    );

    const { categories, ok } = await fetchCategoriesResult();

    expect(ok).toBe(true);
    expect(categories).toHaveLength(1);
    expect(calls[0]).toMatch(/^https:\/\/.+\/api\/categories$/);
    expect(calls[1]).toBe("/api/backend/categories");
  });

  it("doesn't go to the proxy when the backend simply took too long", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { fetchProductsResult: fetchAsBrowser } = await loadAsBrowser();
    const calls: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) => {
        calls.push(input);
        throw new DOMException("The operation timed out.", "TimeoutError");
      })
    );

    expect(await fetchAsBrowser()).toEqual({ products: [], ok: false });
    expect(calls.every((url) => url.startsWith("https://"))).toBe(true);
  });

  it("waits out a cold backend instead of giving up after the storefront's 10s", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout");
    const { fetchCategoriesResult } = await loadAsBrowser();
    mockFetch(() => json([]));

    await fetchCategoriesResult();

    expect(timeout).toHaveBeenCalledWith(100_000);
  });

  it("keeps the server's short budget and never uses the proxy", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const timeout = vi.spyOn(AbortSignal, "timeout");
    const calls: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string) => {
        calls.push(input);
        throw new TypeError("fetch failed");
      })
    );

    // The statically imported module was loaded without a `window`: the server.
    expect(await fetchProductsResult()).toEqual({ products: [], ok: false });
    expect(timeout).toHaveBeenCalledWith(10_000);
    expect(calls.some((url) => url.includes("/api/backend"))).toBe(false);
  });
});

describe("authenticated requests", () => {
  it("walks every page of an admin list", async () => {
    mockFetch((url) => {
      const page = Number(url.searchParams.get("page"));
      return json({ orders: [{ _id: `o${page}` }], page, pages: 2, total: 2 });
    });
    expect((await fetchAllOrders()).map((o: { _id: string }) => o._id)).toEqual(["o1", "o2"]);
  });

  it("surfaces the backend's own error message", async () => {
    mockFetch(() => json({ message: "SKU already exists" }, 400));
    await expect(createProduct({})).rejects.toMatchObject({
      name: "ApiError",
      message: "SKU already exists",
      status: 400,
    });
  });

  it("falls back to a readable message when the error body isn't JSON", async () => {
    mockFetch(() => new Response("<html>Bad Gateway</html>", { status: 502 }));
    const error = await createProduct({}).catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe("Failed to create product");
  });

  it("keeps the upload error message instead of swallowing it", async () => {
    mockFetch(() => json({ message: "Images only!" }, 400));
    await expect(uploadImage(new File(["x"], "a.txt"))).rejects.toThrow("Images only!");
  });

  it("never attaches credentials itself", async () => {
    const calls = mockFetch(() => json({}));
    await createProduct({ name: "x" });
    expect(new Headers(calls[0].init?.headers).get("authorization")).toBeNull();
  });
});
