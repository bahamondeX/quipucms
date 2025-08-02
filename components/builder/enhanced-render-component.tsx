"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { BuilderComponent } from "@/app/builder/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { ComponentToolbar } from "./component-toolbar"
import { ComponentStreamManager } from "@/lib/component-stream-manager"
import { Star, Play, Volume2, AlertCircle, CheckCircle, Info } from "lucide-react"
import { useGlobalState } from "@/lib/global-state"
import type { JSX } from "react/jsx-runtime"

interface EnhancedRenderComponentProps {
  component: BuilderComponent
  isSelected: boolean
  onSelect: (id: string | null) => void
  onUpdate: (id: string, updates: Partial<BuilderComponent>) => void
  onDelete: (id: string) => void
  previewMode: boolean
  pageId: string
}

export function EnhancedRenderComponent({
  component,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  previewMode,
  pageId,
}: EnhancedRenderComponentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(component.content || "")
  const { publishToCollection } = useGlobalState()
  const [streamManager] = useState(() => ComponentStreamManager.getInstance(pageId))
  const [formValues, setFormValues] = useState<Record<string, any>>({})

  // Listen for real-time updates
  useEffect(() => {
    const handleComponentUpdate = (event: CustomEvent) => {
      if (event.detail.componentId === component.id) {
        console.log("Real-time update received:", event.detail)
        // Update component with real-time data
        if (event.detail.data.props) {
          onUpdate(component.id, { properties: event.detail.data.props })
        }
      }
    }

    window.addEventListener("componentUpdate", handleComponentUpdate as EventListener)
    return () => {
      window.removeEventListener("componentUpdate", handleComponentUpdate as EventListener)
    }
  }, [component.id, onUpdate])

  const handleDoubleClick = () => {
    if (!previewMode && (component.type === "text" || component.type === "heading" || component.type === "button")) {
      setIsEditing(true)
      setEditContent(component.content || "")
    }
  }

  const handleSaveEdit = async () => {
    const updates = { content: editContent }
    onUpdate(component.id, updates)
    setIsEditing(false)

    // Update in stream
    await streamManager.updateComponent(component.id, updates)
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

  const handleDuplicate = async () => {
    const duplicatedComponent: BuilderComponent = {
      ...component,
      id: `${component.type}-${Date.now()}`,
      content: component.content,
      properties: { ...component.properties },
    }

    // Add to stream
    await streamManager.onComponentAdded(duplicatedComponent)
  }

  const handleDelete = async () => {
    await streamManager.onComponentRemoved(component.id)
    onDelete(component.id)
  }

  const handleToggleVisibility = () => {
    // Handle visibility toggle
  }

  const handleToggleLock = () => {
    // Handle lock toggle
  }

  const getStyles = () => {
    const props = component.properties
    const styles: React.CSSProperties = {
      fontSize: props.fontSize,
      color: props.color,
      textAlign: props.textAlign as any,
      backgroundColor: props.backgroundColor,
      padding: props.padding,
      borderRadius: props.borderRadius,
      width: props.width,
      height: props.height,
      border: props.border,
      boxShadow: props.boxShadow,
      margin: props.margin,
      opacity: props.visible === false ? 0.5 : 1,
      pointerEvents: props.locked ? "none" : "auto",
    }

    // Remove undefined values
    Object.keys(styles).forEach((key) => {
      if (styles[key as keyof React.CSSProperties] === undefined) {
        delete styles[key as keyof React.CSSProperties]
      }
    })

    return styles
  }

  const renderComponent = () => {
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
        const HeadingTag = (component.properties.level || "h1") as keyof JSX.IntrinsicElements
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
              <Button
                style={getStyles()}
                variant={component.properties.variant || "default"}
                size={component.properties.size || "default"}
                disabled={component.properties.disabled || false}
              >
                {component.content}
              </Button>
            )}
          </div>
        )

      case "input":
        return (
          <div style={getStyles()}>
            <Label>{component.properties.label || "Input Field"}</Label>
            <Input
              type={component.properties.type || "text"}
              placeholder={component.properties.placeholder || "Enter text..."}
              defaultValue={component.properties.value || ""}
              disabled={component.properties.disabled || previewMode}
              required={component.properties.required || false}
              maxLength={component.properties.maxLength}
              minLength={component.properties.minLength}
              onChange={(e) => {
                if (!previewMode) {
                  setFormValues((prev) => ({ ...prev, [component.id]: e.target.value }))
                  onUpdate(component.id, {
                    properties: { ...component.properties, value: e.target.value },
                  })
                }
              }}
            />
          </div>
        )

      case "textarea":
        return (
          <div style={getStyles()}>
            <Label>{component.properties.label || "Text Area"}</Label>
            <Textarea
              placeholder={component.properties.placeholder || "Enter text..."}
              defaultValue={component.properties.value || ""}
              disabled={previewMode}
              onChange={(e) => {
                if (!previewMode) {
                  setFormValues((prev) => ({ ...prev, [component.id]: e.target.value }))
                  onUpdate(component.id, {
                    properties: { ...component.properties, value: e.target.value },
                  })
                }
              }}
            />
          </div>
        )

      case "select":
        return (
          <div style={getStyles()}>
            <Label>{component.properties.label || "Select Option"}</Label>
            <Select
              disabled={previewMode}
              defaultValue={component.properties.value || ""}
              onValueChange={(value) => {
                if (!previewMode) {
                  setFormValues((prev) => ({ ...prev, [component.id]: value }))
                  onUpdate(component.id, {
                    properties: { ...component.properties, value },
                  })
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      case "checkbox":
        return (
          <div style={getStyles()} className="flex items-center space-x-2">
            <Checkbox
              id={component.id}
              disabled={previewMode}
              defaultChecked={component.properties.checked || false}
              onCheckedChange={(checked) => {
                if (!previewMode) {
                  setFormValues((prev) => ({ ...prev, [component.id]: checked }))
                  onUpdate(component.id, {
                    properties: { ...component.properties, checked },
                  })
                }
              }}
            />
            <Label htmlFor={component.id}>{component.properties.label || "Checkbox option"}</Label>
          </div>
        )

      case "radio":
        return (
          <div style={getStyles()}>
            <Label>{component.properties.label || "Radio Group"}</Label>
            <RadioGroup
              disabled={previewMode}
              defaultValue={component.properties.value || ""}
              onValueChange={(value) => {
                if (!previewMode) {
                  setFormValues((prev) => ({ ...prev, [component.id]: value }))
                  onUpdate(component.id, {
                    properties: { ...component.properties, value },
                  })
                }
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="r1" />
                <Label htmlFor="r1">Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="r2" />
                <Label htmlFor="r2">Option 2</Label>
              </div>
            </RadioGroup>
          </div>
        )

      case "card":
        return (
          <Card style={getStyles()} className={component.properties.variant === "outline" ? "border" : ""}>
            <CardHeader>
              <CardTitle>{component.properties.title || "Card Title"}</CardTitle>
              <CardDescription>{component.properties.description || "Card description goes here"}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{component.content || "Card content goes here"}</p>
            </CardContent>
          </Card>
        )

      case "badge":
        return (
          <Badge style={getStyles()} variant={component.properties.variant || "default"}>
            {component.content || "Badge"}
          </Badge>
        )

      case "alert":
        const alertIcons = {
          info: Info,
          warning: AlertCircle,
          success: CheckCircle,
          error: AlertCircle,
        }
        const AlertIcon = alertIcons[component.properties.type as keyof typeof alertIcons] || Info

        return (
          <Alert style={getStyles()} className={component.properties.variant === "destructive" ? "border-red-200" : ""}>
            <AlertIcon className="h-4 w-4" />
            {component.properties.title && <h4 className="font-medium">{component.properties.title}</h4>}
            <AlertDescription>{component.content || "This is an alert message"}</AlertDescription>
          </Alert>
        )

      case "avatar":
        return (
          <Avatar style={getStyles()}>
            <AvatarImage src={component.content || "/placeholder.svg?height=40&width=40&text=Avatar"} />
            <AvatarFallback>{component.properties.fallback || "U"}</AvatarFallback>
          </Avatar>
        )

      case "separator":
        return <Separator style={getStyles()} />

      case "accordion":
        return (
          <Accordion type="single" collapsible style={getStyles()}>
            <AccordionItem value="item-1">
              <AccordionTrigger>{component.properties.title || "Accordion Item"}</AccordionTrigger>
              <AccordionContent>{component.content || "Accordion content goes here"}</AccordionContent>
            </AccordionItem>
          </Accordion>
        )

      case "tabs":
        return (
          <Tabs defaultValue="tab1" style={getStyles()}>
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <p>Content for tab 1</p>
            </TabsContent>
            <TabsContent value="tab2">
              <p>Content for tab 2</p>
            </TabsContent>
          </Tabs>
        )

      case "progress":
        return (
          <div style={getStyles()}>
            <Label>{component.properties.label || "Progress"}</Label>
            <Progress value={component.properties.value || 50} className="mt-2" />
          </div>
        )

      case "slider":
        return (
          <div style={getStyles()}>
            <Label>{component.properties.label || "Slider"}</Label>
            <Slider
              defaultValue={[component.properties.value || 50]}
              max={100}
              step={1}
              className="mt-2"
              disabled={previewMode}
              onValueChange={(value) => {
                if (!previewMode) {
                  const newValue = value[0]
                  setFormValues((prev) => ({ ...prev, [component.id]: newValue }))
                  onUpdate(component.id, {
                    properties: { ...component.properties, value: newValue },
                  })
                }
              }}
            />
          </div>
        )

      case "toggle":
        return (
          <div style={getStyles()} className="flex items-center space-x-2">
            <Switch
              id={component.id}
              disabled={previewMode}
              defaultChecked={component.properties.checked || false}
              onCheckedChange={(checked) => {
                if (!previewMode) {
                  setFormValues((prev) => ({ ...prev, [component.id]: checked }))
                  onUpdate(component.id, {
                    properties: { ...component.properties, checked },
                  })
                }
              }}
            />
            <Label htmlFor={component.id}>{component.properties.label || "Toggle option"}</Label>
          </div>
        )

      case "rating":
        return (
          <div style={getStyles()} className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < (component.properties.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        )

      case "video":
        return (
          <div style={getStyles()} className="relative bg-black rounded-lg overflow-hidden">
            <video
              src={component.content || "#"}
              controls={previewMode}
              className="w-full h-auto"
              poster="/placeholder.svg?height=200&width=300&text=Video"
            />
            {!previewMode && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Play className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
        )

      case "audio":
        return (
          <div style={getStyles()} className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg">
            <Button variant="outline" size="sm" disabled={!previewMode}>
              <Play className="w-4 h-4" />
            </Button>
            <div className="flex-1 h-2 bg-gray-300 rounded-full">
              <div className="h-full w-1/3 bg-blue-500 rounded-full"></div>
            </div>
            <Volume2 className="w-4 h-4 text-gray-600" />
          </div>
        )

      case "calendar":
        return (
          <div style={getStyles()}>
            <Calendar mode="single" className="rounded-md border" disabled={!previewMode} />
          </div>
        )

      case "container":
        return (
          <div style={getStyles()} className="border border-dashed border-gray-300 min-h-[100px] relative">
            {component.children?.map((child) => (
              <EnhancedRenderComponent
                key={child.id}
                component={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                onDelete={onDelete}
                previewMode={previewMode}
                pageId={pageId}
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

      case "form":
        return (
          <form
            style={getStyles()}
            className="space-y-4 p-4 border rounded-lg"
            onSubmit={(e) => {
              e.preventDefault()
              if (previewMode) {
                console.log("Form submitted:", formValues)
                alert("Form submitted! Check console for values.")
              }
            }}
          >
            <div>
              <Label>Name</Label>
              <Input
                placeholder="Enter your name"
                disabled={!previewMode}
                onChange={(e) => {
                  setFormValues((prev) => ({ ...prev, [`${component.id}_name`]: e.target.value }))
                }}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                disabled={!previewMode}
                onChange={(e) => {
                  setFormValues((prev) => ({ ...prev, [`${component.id}_email`]: e.target.value }))
                }}
              />
            </div>
            <Button type="submit" disabled={!previewMode}>
              Submit
            </Button>
          </form>
        )

      default:
        return <div>Unknown component type: {component.type}</div>
    }
  }

  return (
    <div className="relative">
      {renderComponent()}

      {/* Component Toolbar */}
      {!previewMode && (
        <ComponentToolbar
          component={component}
          isSelected={isSelected}
          onUpdate={(updates) => onUpdate(component.id, updates)}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onToggleVisibility={handleToggleVisibility}
          onToggleLock={handleToggleLock}
        />
      )}
    </div>
  )
}
