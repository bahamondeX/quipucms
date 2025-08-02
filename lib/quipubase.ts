import { Quipubase } from "quipubase"

export const quipubase = new Quipubase({
  baseURL: process.env.QUIPUBASE_URL || "https://quipubase.oscarbahamonde.com/v1",
  apiKey: process.env.QUIPUBASE_API_KEY || "[DEFAULT]",
  timeout: 30000,
})

// Collection schemas
export const pageSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    slug: { type: "string" },
    content: { type: "object" }, // Will store the page builder data
    status: { type: "string", enum: ["draft", "published", "archived"] },
    author: { type: "string" },
    created_at: { type: "string", format: "date-time" },
    updated_at: { type: "string", format: "date-time" },
    meta: {
      type: "object",
      properties: {
        description: { type: "string" },
        keywords: { type: "array", items: { type: "string" } },
        featured_image: { type: "string" },
      },
    },
  },
  required: ["title", "slug", "content", "status"],
}

export const templateSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    content: { type: "object" },
    thumbnail: { type: "string" },
    category: { type: "string" },
    created_at: { type: "string", format: "date-time" },
  },
  required: ["name", "content"],
}

export const mediaSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    filename: { type: "string" },
    url: { type: "string" },
    type: { type: "string" },
    size: { type: "number" },
    alt: { type: "string" },
    uploaded_at: { type: "string", format: "date-time" },
  },
  required: ["filename", "url", "type"],
}
