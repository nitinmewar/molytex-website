import { test, expect, type Page } from "@playwright/test";

// Section heights (px) of each page's <main> children in the Figma "Final" frames at 1470px wide.
const FIGMA_SECTIONS: Record<string, number[]> = {
  // About hero lead is the client's MoleQule copy (3 lines), not Figma's one-liner.
  "/about": [372.23, 776.33, 557.45, 493.4, 809.32, 347.38],
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
  // Lazy images only load once scrolled near the viewport. Instant, because the site's smooth scrolling
  // otherwise cancels each step and the bottom of a long page is never reached.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForLoadState("networkidle");
  // On long pages, lazy images can still be in flight after networkidle; settle each (load or error).
  await page.evaluate(() =>
    Promise.all(
      [...document.images].map(
        (i) =>
          i.complete ||
          new Promise((r) => {
            i.addEventListener("load", r, { once: true });
            i.addEventListener("error", r, { once: true });
          }),
      ),
    ),
  );
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
  // [heading, id, bullet count, image count]
  const categories: [string, string, number, number][] = [
    ["Surgical Instruments", "surgical-instruments", 6, 1],
    ["3-Ply Surgical Masks", "three-ply-surgical-masks", 5, 1],
    ["Cautery Tip Cleaners", "cautery-tip-cleaners", 5, 1],
    ["Examination Gloves", "examination-gloves", 2, 1],
    ["Hand Sanitiser", "hand-sanitiser", 0, 1],
    ["LS Belts", "ls-belts", 0, 1],
    ["Knee Caps & Rehabilitation Aids", "knee-caps-rehabilitation-aids", 0, 2],
    ["Custom Packs - Surgical & Draping Kits", "custom-packs", 5, 1],
    ["Surgical Skin Marker Pens", "surgical-skin-marker-pens", 0, 1],
    ["Bed Bath Wipes", "bed-bath-wipes", 3, 1],
    ["Absorbent Cotton", "absorbent-cotton", 2, 1],
    ["Absorbent Gauze Thaan", "absorbent-gauze-thaan", 2, 1],
    ["Patient Identification Tags", "patient-identification-tags", 0, 1],
    ["Mother & Baby Soft Tags", "mother-baby-soft-tags", 0, 1],
  ];

  test("has fourteen numbered categories with loaded photos", async ({ page }) => {
    await loadFully(page, "/products");
    await expect(page.getByRole("heading", { level: 1, name: "Our Product Portfolio" })).toBeVisible();
    await expect(page.locator("section.prow")).toHaveCount(categories.length);
    for (const [i, [name, id, bullets, images]] of categories.entries()) {
      const row = page.locator(`section#${id}`);
      await expect(row.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
      await expect(row.getByText(String(i + 1).padStart(2, "0"), { exact: true })).toBeVisible();
      await expect(row.locator("li")).toHaveCount(bullets);
      await expect(row.locator(".prow-media img")).toHaveCount(images);
    }
    await expectImagesLoaded(page);
  });

  test("shows the client's copy word for word", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("section#cautery-tip-cleaners")).toContainText("Compatibility with cautery instruments");
    await expect(page.locator("section#absorbent-gauze-thaan")).toContainText("Two lengths – 18 mtr & 3 mtr");
    for (const id of ["ls-belts", "knee-caps-rehabilitation-aids"]) {
      await expect(page.locator(`section#${id} strong`)).toContainText(
        "Cost-effective institutional packaging available for hospitals, government procurement",
      );
    }
  });

  test("category bar links to every row", async ({ page }) => {
    await page.goto("/products");
    const nav = page.getByRole("navigation", { name: "Product categories" });
    for (const [name, id] of categories) {
      await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute("href", `#${id}`);
    }
  });

  test("row Contact Us opens the contact dialog", async ({ page }) => {
    await page.goto("/products");
    await page.locator("section#examination-gloves").getByRole("button", { name: "Contact Us" }).click();
    await expect(page.locator("dialog[open]")).toBeVisible();
  });

  test("footer lists six new categories and a link to all products", async ({ page }) => {
    await page.goto("/");
    const col = page.locator(".footer-col", { has: page.getByRole("heading", { name: "Product Categories" }) });
    for (const [name, id] of categories.slice(0, 6)) {
      await expect(col.getByRole("link", { name, exact: true })).toHaveAttribute("href", `/products#${id}`);
    }
    await expect(col.getByRole("link", { name: "View all products" })).toHaveAttribute("href", "/products");
    await expect(page.locator("footer")).not.toContainText("Medical Accessories");
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
    expect(hrefs).toEqual([
      "/certificates/iso-9001.pdf",
      "/certificates/iso-13485.pdf",
      "/certificates/cdsco-registration.pdf",
      "/certificates/dpiit-startup.pdf",
    ]);
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

  test("footer shows the office address and phone, with no placeholders", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toContainText("Plot No 21, KH No 375, Kanhaiya Madhopur, Lucknow");
    await expect(footer.getByRole("link", { name: "+91 95806 56456" })).toHaveAttribute("href", "tel:+919580656456");
    await expect(footer).not.toContainText("[");
  });

  test("footer links to the privacy policy", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: "Privacy Policy" }).click();
    await expect(page).toHaveURL(/\/privacy-policy$/);
  });
});

test.describe("Company and trademark text", () => {
  test("footer names MoleQule Products as owner of the Molytex mark", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toContainText("© 2026 MoleQule Products Pvt Ltd. All rights reserved.");
    await expect(footer).toContainText("Molytex is a trademark of MoleQule Products Pvt Ltd.");
    await expect(footer).toContainText("MoleQule Products Pvt LtdPlot No 21");
    await expect(footer).not.toContainText("Molytex Healthcare. All rights reserved");
  });

  test("footer links to the trademark notice", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: "Trademark Notice" }).click();
    await expect(page).toHaveURL(/\/trademark$/);
  });

  test("trademark page shows the full notice", async ({ page }) => {
    await loadFully(page, "/trademark");
    await expect(
      page.getByRole("heading", { level: 1, name: "Intellectual Property & Trademark Notice" }),
    ).toBeVisible();
    await expect(page.locator("main")).toContainText(
      "Unauthorised use of these marks is prohibited, subject to applicable law.",
    );
    await expect(page.locator("main")).toContainText(
      "All website content, product descriptions, graphics and other materials are protected",
    );
    await expectImagesLoaded(page);
  });

  test("about hero describes Molytex as a MoleQule brand", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator(".phero-lead")).toContainText(
      "Molytex is the medical and surgical products brand of MoleQule Products Pvt Ltd",
    );
  });
});
