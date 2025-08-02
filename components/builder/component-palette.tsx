"use client"

import { Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Type, Heading1, ImageIcon, MousePointer, Square, Columns, Layout, List } from "lucide-react"

const componentTypes = [
  { id: "text", name: "Text", icon: Type, description: "Add text content" },
  { id: "heading", name: "Heading", icon: Heading1, description: "Add a heading" },
  { id: "image", name: "Image", icon: ImageIcon, description: "Add an image" },
  { id: "button", name: "Button", icon: MousePointer, description: "Add a button" },
  { id: "container", name: "Container", icon: Square, description: "Add a container" },
  { id: "columns", name: "Columns", icon: Columns, description: "Add column layout" },
]

export function ComponentPalette() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Components</h2>

      <Droppable droppableId="palette" isDropDisabled={true}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <div className="space-y-2">
              {componentTypes.map((component, index) => (
                <Draggable key={component.id} draggableId={component.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`cursor-grab hover:shadow-md transition-shadow ${
                        snapshot.isDragging ? "shadow-lg" : ""
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <component.icon className="w-5 h-5 text-gray-600" />
                          <div>
                            <div className="font-medium text-sm">{component.name}</div>
                            <div className="text-xs text-gray-500">{component.description}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="mt-8">
        <h3 className="text-md font-semibold mb-3">Templates</h3>
        <div className="space-y-2">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <Layout className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-sm">Hero Section</div>
                  <div className="text-xs text-gray-500">Header with CTA</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <List className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-sm">Feature List</div>
                  <div className="text-xs text-gray-500">3-column features</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
