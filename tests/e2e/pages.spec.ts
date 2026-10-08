import { test, expect, type Page } from "@playwright/test";

// Section heights (px) of each page's <main> children in the Figma "Final" frames at 1470px wide.
const FIGMA_SECTIONS: Record<string, number[]> = {
  "/about": [344, 776.33, 557.45, 493.4, 809.32, 347.38],
  "/products": [395.21, 64, 567, 567, 567, 567, 567, 567, 344.87],
  "/certifications": [401.46, 358.46, 809.32, 629.58, 361.17],
  // Copy differs from Figma (molytexproducts.com URLs, spaces after "ID;" and "us;") but still wraps to 39 lines.
  "/privacy-policy": [401.46, 1475.47],
};

async function sectionHeights(page: Page) {
  return page.$$eval("main > *", (els) => els.map((el) => el.getBoundingClientRect().height));
}

async function expectImagesLoaded(page: Page) {
  const broken = await page.$$eval("main img", (imgs) =>
    (imgs as HTMLImageElement[]).filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
  );
  expect(broken).toEqual([]);
}

async function loadFully(page: Page, path: string) {
  await page.goto(path);
  // Lazy images only load once scrolled near the viewport.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
}

test.describe("Figma geometry at 1470px", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "chromium", "desktop frame only"));
  test.use({ viewport: { width: 1470, height: 900 } });

  for (const [path, expected] of Object.entries(FIGMA_SECTIONS)) {
    test(`${path} sections match Figma heights`, async ({ page }) => {
      await loadFully(page, path);
      const actual = await sectionHeights(page);
      expect(actual.length, `section count on ${path}`).toBe(expected.length);
      actual.forEach((h, i) =>
        expect(Math.abs(h - expected[i]), `section ${i} on ${path}: ${h} vs ${expected[i]}`).toBeLessThanOrEqual(2),
      );
    });
  }
});

test.describe("About page", () => {
  test("renders the Figma sections in order without the Team section", async ({ page }) => {
    await loadFully(page, "/about");
    await expect(page.getByRole("heading", { level: 1, name: "About Molytex Healthcare" })).toBeVisible();
    const h2s = await page.locator("main h2").allTextContents();
    expect(h2s).toEqual([
      "Healthcare-focused, built on reliability and trust",
      "Mission & Vision",
      "Our Core Values",
      "Quality you can stand behind",
      "Partner with Molytex Healthcare",
    ]);
    await expect(page.getByText("The people behind Molytex")).toHaveCount(0);
    await expectImagesLoaded(page);
  });

  test("Get in Touch opens the contact dialog", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("button", { name: "Get in Touch" }).click();
    await expect(page.locator("dialog[open]")).toBeVisible();
  });
});

test.describe("Products page", () => {
  const categories = [
    ["Surgical Consumables", "surgical-consumables"],
    ["Orthopedic Products", "orthopedic-products"],
    ["Rehabilitation Aids", "rehabilitation-aids"],
    ["Hospital Disposables", "hospital-disposables"],
    ["Infection Control", "infection-control"],
    ["Medical Accessories", "medical-accessories"],
  ];

  test("has six numbered categories with loaded photos", async ({ page }) => {
    await loadFully(page, "/products");
    await expect(page.getByRole("heading", { level: 1, name: "Our Product Portfolio" })).toBeVisible();
    for (const [i, [name, id]] of categories.entries()) {
      const row = page.locator(`section#${id}`);
      await expect(row.getByRole("heading", { level: 2, name })).toBeVisible();
      await expect(row.getByText(`0${i + 1}`, { exact: true })).toBeVisible();
      await expect(row.locator("li")).toHaveCount(3);
    }
    await expectImagesLoaded(page);
  });

  test("category bar links to every row", async ({ page }) => {
    await page.goto("/products");
    const nav = page.getByRole("navigation", { name: "Product categories" });
    for (const [name, id] of categories) {
      await expect(nav.getByRole("link", { name })).toHaveAttribute("href", `#${id}`);
    }
  });

  test("row Contact Us opens the contact dialog", async ({ page }) => {
    await page.goto("/products");
    await page.locator("section#infection-control").getByRole("button", { name: "Contact Us" }).click();
    await expect(page.locator("dialog[open]")).toBeVisible();
  });
});

test.describe("Certifications page", () => {
  test("renders the Figma sections in order", async ({ page }) => {
    await loadFully(page, "/certifications");
    await expect(page.getByRole("heading", { level: 1, name: "Certifications & Quality" })).toBeVisible();
    const h2s = await page.locator("main h2").allTextContents();
    expect(h2s).toEqual([
      "Quality is not an afterthought",
      "Quality you can stand behind",
      "How we maintain standards",
      "Questions About Our Quality Standards?",
    ]);
    for (const pillar of ["Documentation", "Auditing", "Continuous Improvement"]) {
      await expect(page.getByRole("heading", { level: 3, name: pillar })).toBeVisible();
    }
    await expectImagesLoaded(page);
  });

  test("every View certificate link serves a PDF", async ({ page, request }) => {
    await page.goto("/certifications");
    const hrefs = await page.getByRole("link", { name: /view certificate/i }).evaluateAll((els) =>
      els.map((el) => el.getAttribute("href")),
    );
    // CDSCO has no public certificate PDF yet, so its card shows no link.
    expect(hrefs).toHaveLength(3);
    const cdsco = page.locator("article", { hasText: "CDSCO Registration Certificate" });
    await expect(cdsco.getByRole("link")).toHaveCount(0);
    for (const href of hrefs) {
      const res = await request.get(href!);
      expect(res.status(), href!).toBe(200);
      expect(res.headers()["content-type"], href!).toContain("application/pdf");
    }
  });

  test("CTA buttons open contact and link to products", async ({ page }) => {
    await page.goto("/certifications");
    await expect(page.getByRole("link", { name: "Explore Products" })).toHaveAttribute("href", "/products");
    await page.getByRole("button", { name: "Get In Touch" }).click();
    await expect(page.locator("dialog[open]")).toBeVisible();
  });
});

test.describe("Privacy policy page", () => {
  test("shows banner, title, all sections and a mail link", async ({ page }) => {
    await loadFully(page, "/privacy-policy");
    await expect(page.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeVisible();
    for (const h of ["Collection", "Use", "Disclosure", "Access", "General"]) {
      await expect(page.getByRole("heading", { level: 2, name: h, exact: true })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: "info@molytexproducts.com" }).first()).toHaveAttribute(
      "href",
      "mailto:info@molytexproducts.com",
    );
    await expect(page.getByText("https://www.molytexproducts.com/").first()).toBeVisible();
    await expect(page.locator("body")).not.toContainText("molytexhealthcare");
    await expect(page.locator("body")).not.toContainText("molytex.com");
    await expectImagesLoaded(page);
  });

  test("footer links to the privacy policy", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: "Privacy Policy" }).click();
    await expect(page).toHaveURL(/\/privacy-policy$/);
  });
});
