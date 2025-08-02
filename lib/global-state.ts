"use client"

import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import type { BuilderComponent } from "@/app/builder/page"
import { quipubase } from "./quipubase"

interface ComponentSearchResult {
  id: string
  name: string
  description: string
  category: string
  content: any
  score: number
}

interface StreamState {
  // Component management
  components: BuilderComponent[]
  availableComponents: ComponentSearchResult[]

  // Search state
  searchResults: ComponentSearchResult[]
  isSearching: boolean

  // Data catalog
  dataCatalog: Record<string, any>

  // Actions
  addComponent: (component: BuilderComponent) => void
  updateComponent: (id: string, updates: Partial<BuilderComponent>) => void
  removeComponent: (id: string) => void

  // Search actions
  searchComponents: (query: string) => Promise<void>
  clearSearch: () => void

  // Data catalog actions
  updateDataCatalog: (schema: Record<string, any>) => void
}

export const useGlobalState = create<StreamState>()(
  subscribeWithSelector((set, get) => ({
    components: [],
    availableComponents: [],
    searchResults: [],
    isSearching: false,
    dataCatalog: {},

    addComponent: (component: BuilderComponent) => {
      set((state) => ({
        components: [...state.components, component],
      }))
    },

    updateComponent: (id: string, updates: Partial<BuilderComponent>) => {
      set((state) => ({
        components: state.components.map((comp) => (comp.id === id ? { ...comp, ...updates } : comp)),
      }))
    },

    removeComponent: (id: string) => {
      set((state) => ({
        components: state.components.filter((comp) => comp.id !== id),
      }))
    },

    searchComponents: async (query: string) => {
      if (!query.trim()) {
        set({ searchResults: [], isSearching: false })
        return
      }

      set({ isSearching: true })

      try {
        // Use vector search for semantic component search
        const results = await quipubase.vector.query({
          namespace: "components",
          input: query,
          top_k: 10,
          model: "gemini-embedding-001",
        })

        const searchResults: ComponentSearchResult[] = results.data.map((item) => ({
          id: item.id,
          name: item.metadata?.type || "Component",
          description: item.content || "No description",
          category: "Component",
          content: item.metadata || {},
          score: item.score,
        }))

        set({ searchResults, isSearching: false })
      } catch (error) {
        console.error("Vector search failed:", error)
        set({ searchResults: [], isSearching: false })
      }
    },

    clearSearch: () => {
      set({ searchResults: [], isSearching: false })
    },

    updateDataCatalog: (schema: Record<string, any>) => {
      set((state) => ({
        dataCatalog: { ...state.dataCatalog, ...schema },
      }))
    },
  })),
)

// Initialize global state without collections
export const initializeGlobalState = async () => {
  // Only run in browser
  if (typeof window === "undefined") {
    return
  }

  const state = useGlobalState.getState()

  try {
    console.log("Initializing global state...")

    // Test basic Quipubase connectivity with a simple operation
    try {
      // Try to list blobs to test connectivity
      await quipubase.blobs.list({
        path: "test/",
        bucket: "quipu-store",
      })
      console.log("Quipubase connection verified")
    } catch (connectError) {
      console.warn("Quipubase connection test failed:", connectError)
      // Continue anyway - the app can work without backend
    }

    // Update data catalog with basic info
    state.updateDataCatalog({
      blobs: {
        pages: "Page data stored in blob storage",
        components: "Individual component data",
      },
      vector: {
        components: "Component search index",
      },
    })

    console.log("Global state initialized successfully")
  } catch (error) {
    console.error("Failed to initialize global state:", error)
    // Don't throw the error, just log it so the app can continue
  }
}
