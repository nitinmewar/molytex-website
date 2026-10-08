import { groq } from "next-sanity";

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`;

export const homePageQuery = groq`*[_type == "homePage"][0]{
  heroSlides[]{heading, subheading, support, cta, bgImage},
  metrics[]{label, value, suffix, prefix}
}`;

export const productCategoriesQuery = groq`*[_type == "productCategory"] | order(order asc){
  _id, name, slug, description, features, icon,
  "galleryImages": galleryImages[].asset->url
}`;

export const certificationsQuery = groq`*[_type == "certification"] | order(order asc){
  _id, title, certType, description, image
}`;

export const teamMembersQuery = groq`*[_type == "teamMember"] | order(order asc){
  _id, name, role, image, bio
}`;

export const aboutPageQuery = groq`*[_type == "aboutPage"][0]{
  mission, vision, coreValues, leadershipIntro
}`;

export const resourceArticlesQuery = groq`*[_type == "resourceArticle"] | order(_createdAt desc){
  _id, title, slug, category, content
}`;

export const downloadsQuery = groq`*[_type == "download"]{
  _id, title, category, description,
  "fileUrl": file.asset->url
}`;
