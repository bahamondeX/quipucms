"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileText, Layout, Image, Users, Settings, Home, LayoutTemplateIcon as Template, Eye } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Pages", href: "/admin/pages", icon: FileText },
  { name: "Templates", href: "/admin/templates", icon: Template },
  { name: "Media", href: "/admin/media", icon: Image },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">QuipuCMS</h1>
        <p className="text-sm text-gray-600">Admin Dashboard</p>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors",
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="mt-8 px-3">
          <div className="border-t pt-4">
            <Link href="/builder">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Layout className="w-4 h-4 mr-2" />
                Page Builder
              </Button>
            </Link>
            <Link href="/" className="mt-2 block">
              <Button className="w-full justify-start" variant="ghost">
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
