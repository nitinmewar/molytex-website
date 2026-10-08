import { defineType, defineField } from "sanity";

export const resourceArticle = defineType({
  name: "resourceArticle",
  title: "Resource Article",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["procurement", "infection-control", "safety", "standards", "supply-chain"],
      },
    }),
    defineField({ name: "content", title: "Content", type: "array", of: [{ type: "block" }] }),
  ],
});
