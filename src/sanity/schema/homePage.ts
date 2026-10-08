import { defineType, defineField } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroSlides",
      title: "Hero Slides",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "heading", title: "Heading", type: "string" }),
            defineField({ name: "subheading", title: "Subheading", type: "string" }),
            defineField({ name: "support", title: "Supporting Text", type: "string" }),
            defineField({ name: "cta", title: "CTA Text", type: "string" }),
            defineField({ name: "bgImage", title: "Background Image", type: "image" }),
          ],
        },
      ],
    }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "value", title: "Value", type: "number" }),
            defineField({ name: "suffix", title: "Suffix", type: "string" }),
            defineField({ name: "prefix", title: "Prefix", type: "string" }),
          ],
        },
      ],
    }),
  ],
});
