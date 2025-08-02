"use client"

import { useState, useEffect } from "react"
import { DragDropContext } from "@hello-pangea/dnd"
import { EnhancedComponentPalette } from "@/components/builder/enhanced-component-palette"
import { PageCanvas } from "@/components/builder/page-canvas"
import { PropertiesPanel } from "@/components/builder/properties-panel"
import { BuilderToolbar } from "@/components/builder/builder-toolbar"
import { useGlobalState, initializeGlobalState } from "@/lib/global-state"
import { DataCatalogPanel } from "@/components/builder/data-catalog-panel"
import { ComponentStreamManager } from "@/lib/component-stream-manager"
import { inferComponentSchema } from "@/lib/schema-inference"

export interface BuilderComponent {
  id: string
  type: string
  content?: string
  properties: Record<string, any>
  children?: BuilderComponent[]
}

export default function PageBuilder() {
  const [components, setComponents] = useState<BuilderComponent[]>([])
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [pageId] = useState("default") // Simplified page ID
  const [streamManager] = useState(() => ComponentStreamManager.getInstance(pageId))
  const [isInitialized, setIsInitialized] = useState(false)

  const {
    components: globalComponents,
    addComponent,
    updateComponent: globalUpdateComponent,
    removeComponent,
  } = useGlobalState()

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("Initializing page builder...")
        await initializeGlobalState()
        await streamManager.initialize()

        // Load existing components from collections
        const loadedComponents = await streamManager.loadComponents()
        setComponents(loadedComponents)
        setIsInitialized(true)
        console.log("Page builder initialized successfully")
      } catch (error) {
        console.error("Failed to initialize:", error)
        setIsInitialized(true) // Still allow UI to work
      }
    }

    initialize()
  }, [streamManager])

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const { source, destination } = result

    // Handle drag from palette to canvas
    if (source.droppableId === "palette" && destination.droppableId === "canvas") {
      try {
        const componentType = result.draggableId.split("-")[0] // Remove category suffix

        // Validate component type
        if (!componentType) {
          console.error("Invalid component type")
          return
        }

        const componentSchema = inferComponentSchema(componentType)

        const newComponent: BuilderComponent = {
          id: `${componentType}-${Date.now()}`,
          type: componentType,
          content: componentSchema.defaultProps.content || getDefaultContent(componentType),
          properties: { ...componentSchema.defaultProps },
          children: componentType === "container" || componentType === "columns" ? [] : undefined,
        }

        console.log("Creating new component:", newComponent)

        // Add to local state first (this ensures UI works immediately)
        setComponents((prev) => {
          const newComponents = [...prev]
          newComponents.splice(destination.index, 0, newComponent)
          return newComponents
        })

        // Add to global state
        addComponent(newComponent)

        // Start stream for this component (with error handling)
        if (isInitialized) {
          try {
            await streamManager.onComponentAdded(newComponent)
          } catch (streamError) {
            console.error("Failed to add component to stream:", streamError)
            // Component is still added to local state, so UI works
          }
        }
      } catch (error) {
        console.error("Failed to handle component drag:", error)
      }
    }

    // Handle reordering within canvas
    if (source.droppableId === "canvas" && destination.droppableId === "canvas") {
      const newComponents = Array.from(components)
      const [reorderedItem] = newComponents.splice(source.index, 1)
      newComponents.splice(destination.index, 0, reorderedItem)
      setComponents(newComponents)

      // Update positions in streams (with error handling)
      if (isInitialized) {
        try {
          await streamManager.saveAllComponents(newComponents)
        } catch (error) {
          console.error("Failed to save component positions:", error)
        }
      }
    }
  }

  const getDefaultContent = (type: string): string => {
    switch (type) {
      case "text":
        return "This is a text element. Click to edit."
      case "heading":
        return "Your Heading Here"
      case "button":
        return "Click Me"
      case "image":
        return "/placeholder.svg?height=200&width=300&text=Image"
      default:
        return ""
    }
  }

  const updateComponent = async (id: string, updates: Partial<BuilderComponent>) => {
    setComponents((prev) => prev.map((comp) => (comp.id === id ? { ...comp, ...updates } : comp)))

    // Update in stream
    if (isInitialized) {
      try {
        await streamManager.updateComponent(id, updates)
      } catch (error) {
        console.error("Failed to update component in stream:", error)
      }
    }
    globalUpdateComponent(id, updates)
  }

  const deleteComponent = async (id: string) => {
    setComponents((prev) => prev.filter((comp) => comp.id !== id))

    // Remove from stream
    if (isInitialized) {
      try {
        await streamManager.onComponentRemoved(id)
      } catch (error) {
        console.error("Failed to remove component from stream:", error)
      }
    }
    removeComponent(id)

    if (selectedComponent === id) {
      setSelectedComponent(null)
    }
  }

  const handleSave = async () => {
    if (!isInitialized) {
      console.warn("System not initialized, cannot save")
      return
    }

    try {
      await streamManager.saveAllComponents(components)
      console.log("Page saved successfully")
    } catch (error) {
      console.error("Failed to save page:", error)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <BuilderToolbar
        previewMode={previewMode}
        onPreviewToggle={() => setPreviewMode(!previewMode)}
        onSave={handleSave}
      />

      <div className="flex-1 flex overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          {!previewMode && (
            <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
              <EnhancedComponentPalette />
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <PageCanvas
              components={components}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
              onUpdateComponent={updateComponent}
              onDeleteComponent={deleteComponent}
              previewMode={previewMode}
              pageId={pageId}
            />
          </div>

          {!previewMode && selectedComponent && (
            <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
              <PropertiesPanel
                component={components.find((c) => c.id === selectedComponent)!}
                onUpdate={(updates) => updateComponent(selectedComponent, updates)}
              />
            </div>
          )}

          {!previewMode && <DataCatalogPanel />}
        </DragDropContext>
      </div>
    </div>
  )
}
