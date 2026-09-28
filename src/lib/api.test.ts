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
