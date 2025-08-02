"use client"

import { quipubase } from "./quipubase"
import type { BuilderComponent } from "@/app/builder/page"

export class ComponentStreamManager {
  private static instance: ComponentStreamManager | null = null
  private pageId: string
  private componentData = new Map<string, BuilderComponent>()
  private isInitialized = false

  constructor(pageId: string) {
    this.pageId = pageId
  }

  static getInstance(pageId: string): ComponentStreamManager {
    if (!ComponentStreamManager.instance) {
      ComponentStreamManager.instance = new ComponentStreamManager(pageId)
    }
    return ComponentStreamManager.instance
  }

  // Initialize with basic connectivity test
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Simple connectivity test - just try to list something
      await quipubase.blobs.list({
        path: "test/",
        bucket: "quipu-store",
      })
      this.isInitialized = true
      console.log("ComponentStreamManager initialized successfully")
    } catch (error) {
      console.warn("Quipubase not available, using local storage only:", error)
      this.isInitialized = false
    }
  }

  // Store component with simplified approach
  async onComponentAdded(component: BuilderComponent): Promise<void> {
    try {
      console.log(`Adding component: ${component.id} of type: ${component.type}`)

      // Always store in local cache first
      this.componentData.set(component.id, component)

      // Try to save to remote storage if available
      if (this.isInitialized) {
        await this.saveComponentSafely(component)
      } else {
        console.log("Remote storage not available, component stored locally only")
      }

      console.log(`Component ${component.id} added successfully`)
    } catch (error) {
      console.error(`Failed to add component ${component.id}:`, error)
      // Don't throw - keep the component in local cache
    }
  }

  // Simplified and safe component saving
  private async saveComponentSafely(component: BuilderComponent): Promise<void> {
    try {
      // Create a minimal, clean component data structure
      const cleanComponent = {
        id: component.id,
        type: component.type,
        content: component.content || "",
        properties: this.cleanProperties(component.properties || {}),
        pageId: this.pageId,
        timestamp: Date.now(),
      }

      // Convert to JSON string
      const jsonString = JSON.stringify(cleanComponent, null, 2)

      // Try localStorage first as fallback (only in browser)
      if (typeof window !== "undefined" && window.localStorage) {
        try {
          localStorage.setItem(`component_${this.pageId}_${component.id}`, jsonString)
          console.log(`Component ${component.id} saved to localStorage`)
        } catch (localError) {
          console.warn("localStorage not available:", localError)
        }
      }

      // Try remote storage with multiple approaches
      await this.tryRemoteStorage(component.id, jsonString)
    } catch (error) {
      console.error(`Failed to save component ${component.id} safely:`, error)
      // Don't throw - component is still in memory
    }
  }

  // Try different remote storage methods
  private async tryRemoteStorage(componentId: string, jsonString: string): Promise<void> {
    const methods = [
      () => this.tryBlobStorage(componentId, jsonString),
      () => this.tryVectorStorage(componentId, jsonString),
      () => this.tryQueryStorage(componentId, jsonString),
    ]

    for (const method of methods) {
      try {
        await method()
        console.log(`Component ${componentId} saved remotely`)
        return // Success, exit early
      } catch (error) {
        console.warn(`Storage method failed for ${componentId}:`, error)
        continue // Try next method
      }
    }

    console.warn(`All remote storage methods failed for ${componentId}`)
  }

  // Try blob storage
  private async tryBlobStorage(componentId: string, jsonString: string): Promise<void> {
    const blob = new Blob([jsonString], { type: "application/json" })

    await quipubase.blobs.create({
      path: `components/${this.pageId}/${componentId}.json`,
      file: blob,
      bucket: "quipu-store",
    })
  }

  // Try vector storage (for search)
  private async tryVectorStorage(componentId: string, jsonString: string): Promise<void> {
    await quipubase.vector.upsert({
      namespace: "components",
      input: [jsonString],
      model: "gemini-embedding-001",
      metadata: {
        componentId,
        pageId: this.pageId,
        type: "component",
      },
    })
  }

  // Try query storage
  private async tryQueryStorage(componentId: string, jsonString: string): Promise<void> {
    await quipubase.query.create({
      key: `component_${this.pageId}_${componentId}`,
      query: jsonString,
      namespace: "components",
    })
  }

  // Clean properties to avoid schema issues
  private cleanProperties(properties: Record<string, any>): Record<string, any> {
    const cleaned: Record<string, any> = {}

    for (const [key, value] of Object.entries(properties)) {
      // Skip undefined, null, or function values
      if (value === undefined || value === null || typeof value === "function") {
        continue
      }

      // Convert complex objects to strings
      if (typeof value === "object" && !Array.isArray(value)) {
        try {
          cleaned[key] = JSON.stringify(value)
        } catch {
          cleaned[key] = String(value)
        }
      } else {
        cleaned[key] = value
      }
    }

    return cleaned
  }

  // Update component data
  async updateComponent(componentId: string, updates: Partial<BuilderComponent>): Promise<void> {
    try {
      const existingComponent = this.componentData.get(componentId)
      if (!existingComponent) {
        console.warn(`Component ${componentId} not found in cache`)
        return
      }

      const updatedComponent = { ...existingComponent, ...updates }
      this.componentData.set(componentId, updatedComponent)

      // Try to save updated component
      if (this.isInitialized) {
        await this.saveComponentSafely(updatedComponent)
      }

      console.log(`Component ${componentId} updated`)
    } catch (error) {
      console.error(`Failed to update component ${componentId}:`, error)
    }
  }

  // Remove component and clean up
  async onComponentRemoved(componentId: string): Promise<void> {
    try {
      // Remove from cache
      this.componentData.delete(componentId)

      // Remove from localStorage (only in browser)
      if (typeof window !== "undefined" && window.localStorage) {
        try {
          localStorage.removeItem(`component_${this.pageId}_${componentId}`)
        } catch (localError) {
          console.warn("Failed to remove from localStorage:", localError)
        }
      }

      // Try to remove from remote storage (best effort)
      if (this.isInitialized) {
        this.cleanupRemoteStorage(componentId).catch((error) => {
          console.warn(`Failed to cleanup remote storage for ${componentId}:`, error)
        })
      }

      console.log(`Component ${componentId} removed`)
    } catch (error) {
      console.error(`Failed to remove component ${componentId}:`, error)
    }
  }

  // Cleanup remote storage (best effort)
  private async cleanupRemoteStorage(componentId: string): Promise<void> {
    const cleanupMethods = [
      () =>
        quipubase.blobs.delete({
          path: `components/${this.pageId}/${componentId}.json`,
          bucket: "quipu-store",
        }),
      () =>
        quipubase.query.delete({
          key: `component_${this.pageId}_${componentId}`,
          namespace: "components",
        }),
    ]

    // Try all cleanup methods, don't fail if some don't work
    await Promise.allSettled(cleanupMethods.map((method) => method()))
  }

  // Save all components to a single page file
  async saveAllComponents(components: BuilderComponent[]): Promise<void> {
    try {
      // Update cache
      components.forEach((component) => {
        this.componentData.set(component.id, component)
      })

      // Create clean page data
      const pageData = {
        id: this.pageId,
        components: components.map((comp) => ({
          id: comp.id,
          type: comp.type,
          content: comp.content || "",
          properties: this.cleanProperties(comp.properties || {}),
        })),
        updated_at: new Date().toISOString(),
        version: Date.now(),
      }

      const jsonString = JSON.stringify(pageData, null, 2)

      // Save to localStorage first (only in browser)
      if (typeof window !== "undefined" && window.localStorage) {
        try {
          localStorage.setItem(`page_${this.pageId}`, jsonString)
          console.log(`Page saved to localStorage with ${components.length} components`)
        } catch (localError) {
          console.warn("Failed to save page to localStorage:", localError)
        }
      }

      // Try remote storage if available
      if (this.isInitialized) {
        try {
          const blob = new Blob([jsonString], { type: "application/json" })
          await quipubase.blobs.create({
            path: `pages/${this.pageId}.json`,
            file: blob,
            bucket: "quipu-store",
          })
          console.log(`Page saved remotely with ${components.length} components`)
        } catch (remoteError) {
          console.warn("Failed to save page remotely:", remoteError)
        }
      }
    } catch (error) {
      console.error("Failed to save components:", error)
    }
  }

  // Load components with fallback strategy
  async loadComponents(): Promise<BuilderComponent[]> {
    try {
      console.log(`Loading components for page: ${this.pageId}`)

      // Try remote storage first if available
      if (this.isInitialized) {
        const remoteComponents = await this.loadFromRemote()
        if (remoteComponents.length > 0) {
          // Update cache
          remoteComponents.forEach((component) => {
            this.componentData.set(component.id, component)
          })
          return remoteComponents
        }
      }

      // Fallback to localStorage (only in browser)
      if (typeof window !== "undefined" && window.localStorage) {
        const localComponents = this.loadFromLocalStorage()
        if (localComponents.length > 0) {
          // Update cache
          localComponents.forEach((component) => {
            this.componentData.set(component.id, component)
          })
          return localComponents
        }
      }

      console.log("No components found, starting with empty page")
      return []
    } catch (error) {
      console.error("Failed to load components:", error)
      return []
    }
  }

  // Load from remote storage
  private async loadFromRemote(): Promise<BuilderComponent[]> {
    try {
      // Try to load the entire page first
      const pageBlob = await quipubase.blobs.retrieve({
        path: `pages/${this.pageId}.json`,
        bucket: "quipu-store",
      })

      if (pageBlob) {
        const pageText = await pageBlob.text()
        const pageData = JSON.parse(pageText)

        if (pageData.components && Array.isArray(pageData.components)) {
          console.log(`Loaded ${pageData.components.length} components from remote page`)
          return pageData.components.map(this.normalizeComponent)
        }
      }
    } catch (error) {
      console.log("Failed to load page from remote:", error)
    }

    return []
  }

  // Load from localStorage
  private loadFromLocalStorage(): BuilderComponent[] {
    if (typeof window === "undefined" || !window.localStorage) {
      return []
    }

    try {
      // Try to load the entire page first
      const pageData = localStorage.getItem(`page_${this.pageId}`)
      if (pageData) {
        const parsed = JSON.parse(pageData)
        if (parsed.components && Array.isArray(parsed.components)) {
          console.log(`Loaded ${parsed.components.length} components from localStorage`)
          return parsed.components.map(this.normalizeComponent)
        }
      }

      // Try to load individual components
      const components: BuilderComponent[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(`component_${this.pageId}_`)) {
          try {
            const componentData = localStorage.getItem(key)
            if (componentData) {
              const component = JSON.parse(componentData)
              components.push(this.normalizeComponent(component))
            }
          } catch (parseError) {
            console.warn(`Failed to parse component from localStorage key ${key}:`, parseError)
          }
        }
      }

      if (components.length > 0) {
        console.log(`Loaded ${components.length} individual components from localStorage`)
      }

      return components
    } catch (error) {
      console.error("Failed to load from localStorage:", error)
      return []
    }
  }

  // Normalize component data to ensure consistent structure
  private normalizeComponent(data: any): BuilderComponent {
    return {
      id: data.id || `unknown-${Date.now()}`,
      type: data.type || "text",
      content: data.content || "",
      properties: data.properties || {},
      children: data.children || undefined,
    }
  }

  // Search components (simplified)
  async searchComponents(query: string): Promise<BuilderComponent[]> {
    try {
      // Search in local cache first
      const localResults: BuilderComponent[] = []
      for (const component of this.componentData.values()) {
        const searchText =
          `${component.type} ${component.content} ${JSON.stringify(component.properties)}`.toLowerCase()
        if (searchText.includes(query.toLowerCase())) {
          localResults.push(component)
        }
      }

      return localResults
    } catch (error) {
      console.error("Failed to search components:", error)
      return []
    }
  }

  // Clean up cache
  cleanup(): void {
    this.componentData.clear()
  }
}
