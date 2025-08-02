"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useGlobalState } from "@/lib/global-state"
import { Wifi, WifiOff, Users, Database } from "lucide-react"

interface ActiveUser {
  id: string
  name: string
  avatar?: string
  cursor?: { x: number; y: number }
  lastSeen: number
}

export function RealTimeIndicator() {
  const [isConnected, setIsConnected] = useState(true)
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
  const { components, dataCatalog } = useGlobalState()

  useEffect(() => {
    // Simulate active users for demo
    const mockUsers: ActiveUser[] = [
      {
        id: "1",
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32&text=JD",
        lastSeen: Date.now(),
      },
      {
        id: "2",
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=32&width=32&text=JS",
        lastSeen: Date.now() - 30000,
      },
    ]

    setActiveUsers(mockUsers)

    // Simulate connection status changes
    const interval = setInterval(() => {
      setIsConnected((prev) => (Math.random() > 0.1 ? true : prev))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center space-x-3 px-4 py-2 bg-white border-b">
      {/* Connection Status */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center space-x-2">
              {isConnected ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />}
              <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isConnected ? "Blob storage active" : "Connection lost"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Active Users */}
      <div className="flex items-center space-x-2">
        <Users className="w-4 h-4 text-gray-600" />
        <div className="flex -space-x-2">
          {activeUsers.map((user) => (
            <TooltipProvider key={user.id}>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="w-6 h-6 border-2 border-white">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-xs">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{user.name}</p>
                  <p className="text-xs text-gray-500">
                    {user.lastSeen > Date.now() - 60000 ? "Active now" : "Last seen 1m ago"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        <span className="text-xs text-gray-600">{activeUsers.length} online</span>
      </div>

      {/* Component Status */}
      <div className="flex items-center space-x-2">
        <Database className="w-4 h-4 text-blue-600" />
        <span className="text-xs text-gray-600">{components.length} components</span>
      </div>

      {/* Storage Status */}
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-600">Blob storage active</span>
      </div>
    </div>
  )
}
