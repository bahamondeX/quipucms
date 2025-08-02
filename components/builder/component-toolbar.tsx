"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Settings,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react"
import type { BuilderComponent } from "@/app/builder/page"

interface ComponentToolbarProps {
  component: BuilderComponent
  isSelected: boolean
  onUpdate: (updates: Partial<BuilderComponent>) => void
  onDelete: () => void
  onDuplicate: () => void
  onToggleVisibility: () => void
  onToggleLock: () => void
}

export function ComponentToolbar({
  component,
  isSelected,
  onUpdate,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onToggleLock,
}: ComponentToolbarProps) {
  const [isVisible, setIsVisible] = useState(component.properties.visible !== false)
  const [isLocked, setIsLocked] = useState(component.properties.locked === true)

  if (!isSelected) return null

  const handleVisibilityToggle = () => {
    const newVisibility = !isVisible
    setIsVisible(newVisibility)
    onUpdate({ properties: { ...component.properties, visible: newVisibility } })
    onToggleVisibility()
  }

  const handleLockToggle = () => {
    const newLocked = !isLocked
    setIsLocked(newLocked)
    onUpdate({ properties: { ...component.properties, locked: newLocked } })
    onToggleLock()
  }

  const handleAlignmentChange = (alignment: string) => {
    onUpdate({
      properties: {
        ...component.properties,
        textAlign: alignment,
      },
    })
  }

  return (
    <TooltipProvider>
      <Card className="absolute -top-12 left-0 z-50 shadow-lg border-blue-500">
        <CardContent className="p-2">
          <div className="flex items-center space-x-1">
            {/* Component Type Badge */}
            <Badge variant="secondary" className="text-xs">
              {component.type}
            </Badge>

            <Separator orientation="vertical" className="h-4" />

            {/* Alignment Controls */}
            {(component.type === "text" || component.type === "heading") && (
              <>
                <div className="flex items-center space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleAlignmentChange("left")}
                      >
                        <AlignLeft className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Align Left</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleAlignmentChange("center")}
                      >
                        <AlignCenter className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Align Center</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleAlignmentChange("right")}
                      >
                        <AlignRight className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Align Right</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleAlignmentChange("justify")}
                      >
                        <AlignJustify className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Justify</TooltipContent>
                  </Tooltip>
                </div>

                <Separator orientation="vertical" className="h-4" />
              </>
            )}

            {/* Visibility Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleVisibilityToggle}>
                  {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isVisible ? "Hide" : "Show"}</TooltipContent>
            </Tooltip>

            {/* Lock Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleLockToggle}>
                  {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isLocked ? "Unlock" : "Lock"}</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-4" />

            {/* Duplicate */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onDuplicate}>
                  <Copy className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Duplicate</TooltipContent>
            </Tooltip>

            {/* Delete */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  onClick={onDelete}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-4" />

            {/* Settings */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
