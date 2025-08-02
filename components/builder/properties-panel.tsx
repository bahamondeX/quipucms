"use client"

import type { BuilderComponent } from "@/app/builder/page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface PropertiesPanelProps {
  component: BuilderComponent
  onUpdate: (updates: Partial<BuilderComponent>) => void
}

export function PropertiesPanel({ component, onUpdate }: PropertiesPanelProps) {
  const updateProperty = (key: string, value: any) => {
    onUpdate({
      properties: {
        ...component.properties,
        [key]: value,
      },
    })
  }

  const updateContent = (content: string) => {
    onUpdate({ content })
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        <div className="text-sm text-gray-600 mb-4">
          {component.type.charAt(0).toUpperCase() + component.type.slice(1)} Component
        </div>
      </div>

      {/* Content */}
      {(component.type === "text" || component.type === "heading" || component.type === "button") && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {component.type === "text" ? (
              <Textarea
                value={component.content || ""}
                onChange={(e) => updateContent(e.target.value)}
                placeholder="Enter text content..."
              />
            ) : (
              <Input
                value={component.content || ""}
                onChange={(e) => updateContent(e.target.value)}
                placeholder={`Enter ${component.type} text...`}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Typography */}
      {(component.type === "text" || component.type === "heading" || component.type === "button") && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Typography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">Font Size</Label>
              <Input
                value={component.properties.fontSize || "16px"}
                onChange={(e) => updateProperty("fontSize", e.target.value)}
                placeholder="16px"
              />
            </div>

            <div>
              <Label className="text-xs">Color</Label>
              <Input
                type="color"
                value={component.properties.color || "#000000"}
                onChange={(e) => updateProperty("color", e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs">Text Align</Label>
              <Select
                value={component.properties.textAlign || "left"}
                onValueChange={(value) => updateProperty("textAlign", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {component.type === "heading" && (
              <div>
                <Label className="text-xs">Heading Level</Label>
                <Select
                  value={component.properties.level || "h1"}
                  onValueChange={(value) => updateProperty("level", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h1">H1</SelectItem>
                    <SelectItem value="h2">H2</SelectItem>
                    <SelectItem value="h3">H3</SelectItem>
                    <SelectItem value="h4">H4</SelectItem>
                    <SelectItem value="h5">H5</SelectItem>
                    <SelectItem value="h6">H6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {component.type !== "columns" && (
            <>
              <div>
                <Label className="text-xs">Width</Label>
                <Input
                  value={component.properties.width || "100%"}
                  onChange={(e) => updateProperty("width", e.target.value)}
                  placeholder="100%"
                />
              </div>

              <div>
                <Label className="text-xs">Height</Label>
                <Input
                  value={component.properties.height || "auto"}
                  onChange={(e) => updateProperty("height", e.target.value)}
                  placeholder="auto"
                />
              </div>
            </>
          )}

          <div>
            <Label className="text-xs">Padding</Label>
            <Input
              value={component.properties.padding || "0px"}
              onChange={(e) => updateProperty("padding", e.target.value)}
              placeholder="0px"
            />
          </div>
        </CardContent>
      </Card>

      {/* Background */}
      {(component.type === "button" || component.type === "container") && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Background</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">Background Color</Label>
              <Input
                type="color"
                value={component.properties.backgroundColor || "#transparent"}
                onChange={(e) => updateProperty("backgroundColor", e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs">Border Radius</Label>
              <Input
                value={component.properties.borderRadius || "0px"}
                onChange={(e) => updateProperty("borderRadius", e.target.value)}
                placeholder="0px"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Columns specific */}
      {component.type === "columns" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Columns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">Number of Columns</Label>
              <Select
                value={String(component.properties.columns || 2)}
                onValueChange={(value) => updateProperty("columns", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Column</SelectItem>
                  <SelectItem value="2">2 Columns</SelectItem>
                  <SelectItem value="3">3 Columns</SelectItem>
                  <SelectItem value="4">4 Columns</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Gap</Label>
              <Input
                value={component.properties.gap || "20px"}
                onChange={(e) => updateProperty("gap", e.target.value)}
                placeholder="20px"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image specific */}
      {component.type === "image" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">Image URL</Label>
              <Input
                value={component.content || ""}
                onChange={(e) => updateContent(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <Label className="text-xs">Alt Text</Label>
              <Input
                value={component.properties.alt || ""}
                onChange={(e) => updateProperty("alt", e.target.value)}
                placeholder="Image description"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
