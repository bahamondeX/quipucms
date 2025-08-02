"use client"

import { Droppable, Draggable } from "@hello-pangea/dnd"
import type { BuilderComponent } from "@/app/builder/page"
import { EnhancedRenderComponent } from "./enhanced-render-component"
import { Trash2, Move } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageCanvasProps {
  components: BuilderComponent[]
  selectedComponent: string | null
  onSelectComponent: (id: string | null) => void
  onUpdateComponent: (id: string, updates: Partial<BuilderComponent>) => void
  onDeleteComponent: (id: string) => void
  previewMode: boolean
  pageId: string
}

export function PageCanvas({
  components,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  previewMode,
  pageId,
}: PageCanvasProps) {
  return (
    <div className="min-h-full bg-white">
      {previewMode ? (
        <div className="p-4">
          {components.map((component) => (
            <EnhancedRenderComponent
              key={component.id}
              component={component}
              isSelected={false}
              onSelect={() => {}}
              onUpdate={() => {}}
              onDelete={() => {}}
              previewMode={true}
              pageId={pageId}
            />
          ))}
        </div>
      ) : (
        <Droppable droppableId="canvas">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-full p-4 ${snapshot.isDraggingOver ? "bg-blue-50" : ""}`}
            >
              {components.length === 0 && (
                <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <div className="text-gray-500 text-lg mb-2">Start Building</div>
                    <div className="text-gray-400 text-sm">
                      Drag components from the left panel to start building your page
                    </div>
                  </div>
                </div>
              )}

              {components.map((component, index) => (
                <Draggable key={component.id} draggableId={component.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`relative group mb-4 ${snapshot.isDragging ? "opacity-50" : ""}`}
                    >
                      <div
                        className={`border-2 border-transparent hover:border-blue-300 rounded ${
                          selectedComponent === component.id ? "border-blue-500" : ""
                        }`}
                        onClick={() => onSelectComponent(component.id)}
                      >
                        <EnhancedRenderComponent
                          component={component}
                          isSelected={selectedComponent === component.id}
                          onSelect={onSelectComponent}
                          onUpdate={onUpdateComponent}
                          onDelete={onDeleteComponent}
                          previewMode={false}
                          pageId={pageId}
                        />
                      </div>

                      {selectedComponent === component.id && (
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 flex space-x-1">
                          <div {...provided.dragHandleProps} className="bg-blue-500 text-white p-1 rounded cursor-move">
                            <Move className="w-3 h-3" />
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="p-1 h-auto"
                            onClick={() => onDeleteComponent(component.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  )
}
