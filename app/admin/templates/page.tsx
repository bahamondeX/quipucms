"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Eye, Trash2, Copy } from "lucide-react"
import Image from "next/image"

const mockTemplates = [
  {
    id: "1",
    name: "Hero Section",
    description: "Full-width hero section with background image and call-to-action",
    category: "Headers",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Hero+Template",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Feature Grid",
    description: "3-column feature grid with icons and descriptions",
    category: "Content",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Feature+Grid",
    created_at: "2024-01-16T09:00:00Z",
  },
  {
    id: "3",
    name: "Contact Form",
    description: "Contact form with validation and styling",
    category: "Forms",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Contact+Form",
    created_at: "2024-01-17T11:00:00Z",
  },
  {
    id: "4",
    name: "Testimonials",
    description: "Customer testimonials carousel",
    category: "Content",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Testimonials",
    created_at: "2024-01-18T14:00:00Z",
  },
]

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [templates] = useState(mockTemplates)

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "headers":
        return "bg-blue-100 text-blue-800"
      case "content":
        return "bg-green-100 text-green-800"
      case "forms":
        return "bg-purple-100 text-purple-800"
      case "footers":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-600">Reusable page components and layouts</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Templates</CardTitle>
              <CardDescription>
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100">
                  <Image
                    src={template.thumbnail || "/placeholder.svg"}
                    alt={template.name}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Use Template
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{template.description}</p>

                  <div className="flex justify-between items-center">
                    <Badge className={getCategoryColor(template.category)}>{template.category}</Badge>
                    <span className="text-xs text-gray-500">{formatDate(template.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
