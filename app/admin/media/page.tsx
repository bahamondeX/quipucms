"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Upload, Search, MoreHorizontal, Download, Trash2, Copy } from "lucide-react"
import Image from "next/image"

const mockMedia = [
  {
    id: "1",
    filename: "hero-image.jpg",
    url: "/placeholder.svg?height=200&width=300&text=Hero+Image",
    type: "image/jpeg",
    size: 245760,
    alt: "Hero section background",
    uploaded_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    filename: "logo.png",
    url: "/placeholder.svg?height=100&width=200&text=Logo",
    type: "image/png",
    size: 15360,
    alt: "Company logo",
    uploaded_at: "2024-01-16T09:00:00Z",
  },
  {
    id: "3",
    filename: "about-team.jpg",
    url: "/placeholder.svg?height=200&width=300&text=Team+Photo",
    type: "image/jpeg",
    size: 189440,
    alt: "Team photo",
    uploaded_at: "2024-01-17T11:00:00Z",
  },
  {
    id: "4",
    filename: "product-demo.mp4",
    url: "#",
    type: "video/mp4",
    size: 5242880,
    alt: "Product demonstration video",
    uploaded_at: "2024-01-18T14:00:00Z",
  },
]

export default function MediaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [media] = useState(mockMedia)

  const filteredMedia = media.filter(
    (item) =>
      item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alt.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getFileTypeColor = (type: string) => {
    if (type.startsWith("image/")) return "bg-green-100 text-green-800"
    if (type.startsWith("video/")) return "bg-blue-100 text-blue-800"
    if (type.startsWith("audio/")) return "bg-purple-100 text-purple-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">Manage your images, videos, and files</p>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Media</CardTitle>
              <CardDescription>
                {filteredMedia.length} file{filteredMedia.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search media..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {item.type.startsWith("image/") ? (
                    <Image
                      src={item.url || "/placeholder.svg"}
                      alt={item.alt}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <div className="text-2xl mb-2">📄</div>
                      <div className="text-sm">{item.type.split("/")[1].toUpperCase()}</div>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm truncate flex-1 mr-2">{item.filename}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <Badge className={getFileTypeColor(item.type)}>{item.type}</Badge>
                    <div className="text-xs text-gray-600">
                      {formatFileSize(item.size)} • {formatDate(item.uploaded_at)}
                    </div>
                    {item.alt && <div className="text-xs text-gray-500 truncate">Alt: {item.alt}</div>}
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
