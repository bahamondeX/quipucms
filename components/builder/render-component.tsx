"use client"

import type React from "react"

import type { BuilderComponent } from "@/app/builder/page"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface RenderComponentProps {
  component: BuilderComponent
  isSelected: boolean
  onSelect: (id: string | null) => void
  onUpdate: (id: string, updates: Partial<BuilderComponent>) => void
  onDelete: (id: string) => void
  previewMode: boolean
}

export function RenderComponent({
  component,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  previewMode,
}: RenderComponentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(component.content || "")

  const handleDoubleClick = () => {
    if (!previewMode && (component.type === "text" || component.type === "heading" || component.type === "button")) {
      setIsEditing(true)
      setEditContent(component.content || "")
    }
  }

  const handleSaveEdit = () => {
    onUpdate(component.id, { content: editContent })
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSaveEdit()
    }
    if (e.key === "Escape") {
      setIsEditing(false)
      setEditContent(component.content || "")
    }
  }

  const getStyles = () => {
    const props = component.properties
    return {
      fontSize: props.fontSize,
      color: props.color,
      textAlign: props.textAlign,
      backgroundColor: props.backgroundColor,
      padding: props.padding,
      borderRadius: props.borderRadius,
      width: props.width,
      height: props.height,
    }
  }

  switch (component.type) {
    case "text":
      return (
        <div style={getStyles()} onDoubleClick={handleDoubleClick} className="cursor-text">
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyPress}
              className="w-full bg-transparent border-none outline-none resize-none"
              autoFocus
            />
          ) : (
            <p>{component.content}</p>
          )}
        </div>
      )

    case "heading":
      const HeadingTag = component.properties.level || "h1"
      return (
        <div onDoubleClick={handleDoubleClick}>
          {isEditing ? (
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyPress}
              className="w-full bg-transparent border-none outline-none text-inherit"
              style={getStyles()}
              autoFocus
            />
          ) : (
            <HeadingTag style={getStyles()}>{component.content}</HeadingTag>
          )}
        </div>
      )

    case "button":
      return (
        <div onDoubleClick={handleDoubleClick}>
          {isEditing ? (
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyPress}
              className="bg-transparent border-none outline-none text-inherit"
              style={getStyles()}
              autoFocus
            />
          ) : (
            <Button style={getStyles()}>{component.content}</Button>
          )}
        </div>
      )

    case "image":
      return (
        <div style={{ width: component.properties.width }}>
          <Image
            src={component.content || "/placeholder.svg?height=200&width=300&text=Image"}
            alt={component.properties.alt || "Image"}
            width={300}
            height={200}
            style={getStyles()}
            className="max-w-full h-auto"
          />
        </div>
      )

    case "container":
      return (
        <div style={getStyles()} className="border border-dashed border-gray-300 min-h-[100px]">
          {component.children?.map((child) => (
            <RenderComponent
              key={child.id}
              component={child}
              isSelected={false}
              onSelect={onSelect}
              onUpdate={onUpdate}
              onDelete={onDelete}
              previewMode={previewMode}
            />
          )) || <div className="text-gray-400 text-center py-8">Drop components here</div>}
        </div>
      )

    case "columns":
      const columnCount = component.properties.columns || 2
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
            gap: component.properties.gap || "20px",
            ...getStyles(),
          }}
          className="min-h-[100px]"
        >
          {Array.from({ length: columnCount }).map((_, index) => (
            <div key={index} className="border border-dashed border-gray-300 p-4 min-h-[100px]">
              <div className="text-gray-400 text-center">Column {index + 1}</div>
            </div>
          ))}
        </div>
      )

    default:
      return <div>Unknown component type</div>
  }
}
