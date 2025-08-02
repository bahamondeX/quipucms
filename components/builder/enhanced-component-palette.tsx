"use client"

import { useState, useEffect } from "react"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Type,
  Heading1,
  ImageIcon,
  MousePointer,
  Square,
  Columns,
  Layout,
  List,
  Calendar,
  Star,
  User,
  Tag,
  BarChart3,
  PieChart,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  Play,
  Volume2,
  Search,
  Filter,
  Settings,
  Plus,
} from "lucide-react"
import { useGlobalState } from "@/lib/global-state"

const componentCategories = {
  basic: {
    name: "Basic",
    components: [
      { id: "text", name: "Text", icon: Type, description: "Add text content" },
      { id: "heading", name: "Heading", icon: Heading1, description: "Add a heading" },
      { id: "image", name: "Image", icon: ImageIcon, description: "Add an image" },
      { id: "button", name: "Button", icon: MousePointer, description: "Add a button" },
      { id: "container", name: "Container", icon: Square, description: "Add a container" },
      { id: "columns", name: "Columns", icon: Columns, description: "Add column layout" },
    ],
  },
  forms: {
    name: "Forms",
    components: [
      { id: "input", name: "Input", icon: Type, description: "Text input field" },
      { id: "textarea", name: "Textarea", icon: Type, description: "Multi-line text input" },
      { id: "select", name: "Select", icon: Filter, description: "Dropdown select" },
      { id: "checkbox", name: "Checkbox", icon: CheckCircle, description: "Checkbox input" },
      { id: "radio", name: "Radio", icon: CheckCircle, description: "Radio button group" },
      { id: "form", name: "Form", icon: Layout, description: "Form container" },
    ],
  },
  display: {
    name: "Display",
    components: [
      { id: "card", name: "Card", icon: Square, description: "Content card" },
      { id: "badge", name: "Badge", icon: Tag, description: "Status badge" },
      { id: "alert", name: "Alert", icon: AlertCircle, description: "Alert message" },
      { id: "avatar", name: "Avatar", icon: User, description: "User avatar" },
      { id: "separator", name: "Separator", icon: Type, description: "Visual separator" },
      { id: "accordion", name: "Accordion", icon: List, description: "Collapsible content" },
    ],
  },
  navigation: {
    name: "Navigation",
    components: [
      { id: "tabs", name: "Tabs", icon: Layout, description: "Tabbed content" },
      { id: "breadcrumb", name: "Breadcrumb", icon: Layout, description: "Navigation breadcrumb" },
      { id: "pagination", name: "Pagination", icon: Layout, description: "Page navigation" },
      { id: "menubar", name: "Menu Bar", icon: Layout, description: "Horizontal menu" },
    ],
  },
  media: {
    name: "Media",
    components: [
      { id: "video", name: "Video", icon: Play, description: "Video player" },
      { id: "audio", name: "Audio", icon: Volume2, description: "Audio player" },
      { id: "gallery", name: "Gallery", icon: ImageIcon, description: "Image gallery" },
      { id: "carousel", name: "Carousel", icon: ImageIcon, description: "Image carousel" },
    ],
  },
  charts: {
    name: "Charts",
    components: [
      { id: "bar-chart", name: "Bar Chart", icon: BarChart3, description: "Bar chart visualization" },
      { id: "pie-chart", name: "Pie Chart", icon: PieChart, description: "Pie chart visualization" },
      { id: "line-chart", name: "Line Chart", icon: TrendingUp, description: "Line chart visualization" },
    ],
  },
  advanced: {
    name: "Advanced",
    components: [
      { id: "calendar", name: "Calendar", icon: Calendar, description: "Date picker calendar" },
      { id: "rating", name: "Rating", icon: Star, description: "Star rating component" },
      { id: "progress", name: "Progress", icon: TrendingUp, description: "Progress bar" },
      { id: "slider", name: "Slider", icon: Settings, description: "Range slider" },
      { id: "toggle", name: "Toggle", icon: Settings, description: "Toggle switch" },
      { id: "tooltip", name: "Tooltip", icon: Info, description: "Hover tooltip" },
    ],
  },
}

export function EnhancedComponentPalette() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("basic")
  const { searchResults, isSearching, searchComponents, clearSearch, availableComponents } = useGlobalState()

  useEffect(() => {
    if (searchQuery.trim()) {
      const debounceTimer = setTimeout(() => {
        searchComponents(searchQuery)
      }, 300)
      return () => clearTimeout(debounceTimer)
    } else {
      clearSearch()
    }
  }, [searchQuery, searchComponents, clearSearch])

  const filteredComponents = searchQuery.trim()
    ? searchResults
    : componentCategories[activeCategory as keyof typeof componentCategories]?.components || []

  const saveComponentToCollection = async (component: any) => {
    const { publishToCollection } = useGlobalState.getState()

    try {
      await publishToCollection("components", {
        id: `${component.id}-${Date.now()}`,
        type: component.id,
        name: component.name,
        description: component.description,
        category: activeCategory,
        content: component,
        properties: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Failed to save component:", error)
    }
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-3">Components</h2>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        {!searchQuery.trim() && (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
            </TabsList>
            <div className="flex flex-wrap gap-1 mb-4">
              {Object.entries(componentCategories)
                .slice(3)
                .map(([key, category]) => (
                  <Button
                    key={key}
                    variant={activeCategory === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(key)}
                    className="text-xs"
                  >
                    {category.name}
                  </Button>
                ))}
            </div>
          </Tabs>
        )}
      </div>

      {/* Components List */}
      <ScrollArea className="flex-1">
        <Droppable droppableId="palette" isDropDisabled={true}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <div className="space-y-2">
                {searchQuery.trim() && searchResults.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Found {searchResults.length} components</div>
                    <Separator />
                  </div>
                )}

                {filteredComponents.map((component: any, index: number) => {
                  const IconComponent = component.icon || Square
                  const isSearchResult = "score" in component

                  return (
                    <Draggable
                      key={isSearchResult ? component.id : `${component.id}-${activeCategory}`}
                      draggableId={isSearchResult ? component.id : `${component.id}-${activeCategory}`}
                      index={index}
                    >
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
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 flex-1">
                                <IconComponent className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium text-sm truncate">{component.name}</div>
                                  <div className="text-xs text-gray-500 truncate">{component.description}</div>
                                  {isSearchResult && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="secondary" className="text-xs">
                                        {Math.round(component.score * 100)}% match
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {component.category}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  saveComponentToCollection(component)
                                }}
                                className="ml-2 h-6 w-6 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  )
                })}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t">
        <div className="text-sm font-medium mb-2">Quick Actions</div>
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
            <Layout className="w-3 h-3 mr-2" />
            Create Custom Component
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
            <ImageIcon className="w-3 h-3 mr-2" />
            Import from Library
          </Button>
        </div>
      </div>
    </div>
  )
}
