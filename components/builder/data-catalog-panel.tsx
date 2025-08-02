"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGlobalState } from "@/lib/global-state"
import { Database, FileText, Search, Eye, Folder, AlertCircle } from "lucide-react"
import { quipubase } from "@/lib/quipubase"

interface BlobInfo {
  path: string
  size: number
  lastModified: string
  type: string
}

export function DataCatalogPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [blobs, setBlobs] = useState<BlobInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { dataCatalog, components } = useGlobalState()

  useEffect(() => {
    loadBlobCatalog()
  }, [])

  const loadBlobCatalog = async () => {
    setLoading(true)
    setError(null)

    try {
      const allBlobs: BlobInfo[] = []

      // Try to load pages
      try {
        console.log("Loading page blobs...")
        const pageBlobs = await quipubase.blobs.list({
          path: "pages/",
          bucket: "quipu-store",
        })

        console.log("Page blobs response:", pageBlobs)

        // Handle different response formats
        if (Array.isArray(pageBlobs)) {
          pageBlobs.forEach((blob) => {
            allBlobs.push({
              path: blob.path || blob.key || "unknown",
              size: blob.size || 0,
              lastModified: blob.lastModified || blob.last_modified || new Date().toISOString(),
              type: "page",
            })
          })
        } else if (pageBlobs && typeof pageBlobs === "object") {
          // Handle case where response is an object with data property
          const blobArray = pageBlobs.data || pageBlobs.blobs || []
          if (Array.isArray(blobArray)) {
            blobArray.forEach((blob) => {
              allBlobs.push({
                path: blob.path || blob.key || "unknown",
                size: blob.size || 0,
                lastModified: blob.lastModified || blob.last_modified || new Date().toISOString(),
                type: "page",
              })
            })
          }
        }
      } catch (pageError) {
        console.warn("Failed to load page blobs:", pageError)
      }

      // Try to load components
      try {
        console.log("Loading component blobs...")
        const componentBlobs = await quipubase.blobs.list({
          path: "components/",
          bucket: "quipu-store",
        })

        console.log("Component blobs response:", componentBlobs)

        // Handle different response formats
        if (Array.isArray(componentBlobs)) {
          componentBlobs.forEach((blob) => {
            allBlobs.push({
              path: blob.path || blob.key || "unknown",
              size: blob.size || 0,
              lastModified: blob.lastModified || blob.last_modified || new Date().toISOString(),
              type: "component",
            })
          })
        } else if (componentBlobs && typeof componentBlobs === "object") {
          // Handle case where response is an object with data property
          const blobArray = componentBlobs.data || componentBlobs.blobs || []
          if (Array.isArray(blobArray)) {
            blobArray.forEach((blob) => {
              allBlobs.push({
                path: blob.path || blob.key || "unknown",
                size: blob.size || 0,
                lastModified: blob.lastModified || blob.last_modified || new Date().toISOString(),
                type: "component",
              })
            })
          }
        }
      } catch (componentError) {
        console.warn("Failed to load component blobs:", componentError)
      }

      setBlobs(allBlobs)

      if (allBlobs.length === 0) {
        setError("No files found in blob storage")
      }
    } catch (error) {
      console.error("Failed to load blob catalog:", error)
      setError(`Failed to load files: ${error instanceof Error ? error.message : "Unknown error"}`)
      setBlobs([])
    } finally {
      setLoading(false)
    }
  }

  const filteredBlobs = blobs.filter((blob) => blob.path.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "page":
        return "bg-blue-100 text-blue-800"
      case "component":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const previewBlob = async (path: string) => {
    try {
      const blob = await quipubase.blobs.retrieve({
        path,
        bucket: "quipu-store",
      })

      if (blob) {
        const text = await blob.text()
        const data = JSON.parse(text)
        console.log("Blob content:", data)
        // You could show this in a modal or side panel
        alert(`Preview of ${path}:\n\n${JSON.stringify(data, null, 2).slice(0, 500)}...`)
      }
    } catch (error) {
      console.error("Failed to preview blob:", error)
      alert(`Failed to preview ${path}: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-3">
          <Database className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Data Catalog</h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="blobs" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="blobs">Files</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="blobs" className="flex-1 mt-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">
                {filteredBlobs.length} file{filteredBlobs.length !== 1 ? "s" : ""}
              </span>
              <Button variant="outline" size="sm" onClick={loadBlobCatalog} disabled={loading}>
                {loading ? "Loading..." : "Refresh"}
              </Button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">{error}</span>
                </div>
              </div>
            )}

            <ScrollArea className="h-full">
              <div className="space-y-3">
                {filteredBlobs.map((blob, index) => (
                  <Card key={`${blob.path}-${index}`} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-sm truncate">
                              {blob.path.split("/").pop() || blob.path}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {blob.path.split("/").slice(0, -1).join("/") || "root"}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getTypeColor(blob.type)} variant="secondary">
                          {blob.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{formatFileSize(blob.size)}</span>
                        <span>{new Date(blob.lastModified).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-full justify-start text-xs"
                          onClick={() => previewBlob(blob.path)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredBlobs.length === 0 && !loading && !error && (
                  <div className="text-center py-8 text-gray-500">
                    <Folder className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No files found</p>
                    <p className="text-xs text-gray-400 mt-1">Create some components to see them here</p>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-300 mx-auto mb-2"></div>
                    <p className="text-sm">Loading files...</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="summary" className="flex-1 mt-0">
          <div className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Storage Summary</CardTitle>
                <CardDescription className="text-xs">Current data overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Components in memory:</span>
                    <Badge variant="outline">{components.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Files in storage:</span>
                    <Badge variant="outline">{blobs.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Page files:</span>
                    <Badge variant="outline">{blobs.filter((b) => b.type === "page").length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Component files:</span>
                    <Badge variant="outline">{blobs.filter((b) => b.type === "component").length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Storage Backend</CardTitle>
                <CardDescription className="text-xs">Quipubase blob storage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Bucket:</span>
                    <Badge variant="outline">quipu-store</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
