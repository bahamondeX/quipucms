"use client"

import { useEffect } from "react"
import { useGlobalState } from "./global-state"
import { quipubase } from "./quipubase"
import type { BuilderComponent } from "@/app/builder/page"

export const useComponentSync = (pageId: string) => {
  const { components, addComponent, updateComponent, removeComponent, subscribeToCollection, publishToCollection } =
    useGlobalState()

  // Initialize page collection and sync
  useEffect(() => {
    const initializePageSync = async () => {
      try {
        // Create or get page collection with specific ID
        const pageCollectionId = `page-${pageId}`
        let pageCollection

        try {
          const collections = await quipubase.collections.list()
          pageCollection = collections.find((c) => c.id === pageCollectionId)

          if (!pageCollection) {
            pageCollection = await quipubase.collections.create({
              id: pageCollectionId,
              json_schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  pageId: { type: "string" },
                  components: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        type: { type: "string" },
                        content: { type: "string" },
                        properties: { type: "object" },
                        children: { type: "array" },
                      },
                    },
                  },
                  updated_at: { type: "string", format: "date-time" },
                  updated_by: { type: "string" },
                },
                required: ["id", "pageId", "components"],
              },
            })
          }

          // Subscribe to page updates
          await subscribeToCollection(pageCollection.id)
        } catch (collectionError) {
          console.warn("Could not create/access page collection:", collectionError)
        }

        // Load existing page data with error handling
        try {
          const existingData = await quipubase.query.retrieve({
            key: `page-${pageId}`,
            query: `SELECT * FROM pages WHERE id = '${pageId}'`,
          })

          if (existingData.data.length > 0) {
            const pageData = existingData.data[0]
            if (pageData.components) {
              pageData.components.forEach((comp: BuilderComponent) => {
                addComponent(comp)
              })
            }
          }
        } catch (queryError) {
          console.warn("Could not load existing page data:", queryError)
        }
      } catch (error) {
        console.error("Failed to initialize page sync:", error)
      }
    }

    initializePageSync()
  }, [pageId, subscribeToCollection, addComponent])

  // Save components to blob storage
  const savePageToBlob = async (components: BuilderComponent[]) => {
    try {
      const pageData = {
        id: pageId,
        components,
        updated_at: new Date().toISOString(),
        version: Date.now(),
      }

      const blob = new Blob([JSON.stringify(pageData, null, 2)], {
        type: "application/json",
      })

      await quipubase.blobs.create({
        path: `pages/${pageId}.json`,
        file: blob,
        bucket: "quipu-store",
      })

      console.log("Page saved to blob storage")
    } catch (error) {
      console.error("Failed to save page to blob:", error)
    }
  }

  // Sync component changes
  const syncComponentChange = async (action: "create" | "update" | "delete", component: BuilderComponent) => {
    try {
      await publishToCollection("page-updates", {
        action,
        pageId,
        component,
        timestamp: new Date().toISOString(),
        userId: "current-user", // Replace with actual user ID
      })

      // Also save to blob storage
      await savePageToBlob(components)
    } catch (error) {
      console.error("Failed to sync component change:", error)
    }
  }

  // Index components for search
  const indexComponentForSearch = async (component: BuilderComponent) => {
    try {
      const searchContent = `${component.type} ${component.content || ""} ${JSON.stringify(component.properties)}`

      await quipubase.vector.upsert({
        namespace: "components",
        input: [searchContent],
        model: "gemini-embedding-001",
      })

      console.log("Component indexed for search")
    } catch (error) {
      console.error("Failed to index component:", error)
    }
  }

  return {
    syncComponentChange,
    savePageToBlob,
    indexComponentForSearch,
  }
}
