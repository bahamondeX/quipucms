"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Save, Undo, Redo, Download, Upload, Settings, Smartphone, Tablet, Monitor } from "lucide-react"
import { RealTimeIndicator } from "./real-time-indicator"

interface BuilderToolbarProps {
  previewMode: boolean
  onPreviewToggle: () => void
  onSave: () => void
}

export function BuilderToolbar({ previewMode, onPreviewToggle, onSave }: BuilderToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <RealTimeIndicator />
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold">Page Builder</h1>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="ghost" size="sm">
            <Undo className="w-4 h-4 mr-1" />
            Undo
          </Button>
          <Button variant="ghost" size="sm">
            <Redo className="w-4 h-4 mr-1" />
            Redo
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Smartphone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Tablet className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white shadow-sm">
              <Monitor className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="ghost" size="sm">
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>

          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>

          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="outline" size="sm" onClick={onPreviewToggle}>
            {previewMode ? (
              <>
                <EyeOff className="w-4 h-4 mr-1" />
                Edit
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </>
            )}
          </Button>

          <Button size="sm" onClick={onSave}>
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
