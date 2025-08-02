import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Layout, ImageIcon, Users, Settings } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">QuipuCMS</h1>
          <p className="text-xl text-gray-600 mb-8">WordPress-like CMS with Elementor-style Visual Builder</p>
          <div className="flex gap-4 justify-center">
            <Link href="/admin">
              <Button size="lg">Go to Admin Dashboard</Button>
            </Link>
            <Link href="/builder">
              <Button variant="outline" size="lg">
                Open Page Builder
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <FileText className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Create and manage pages, posts, and content with ease</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/pages">
                <Button variant="outline" className="w-full bg-transparent">
                  Manage Pages
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Layout className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Visual Builder</CardTitle>
              <CardDescription>Drag-and-drop page builder with live preview</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/builder">
                <Button variant="outline" className="w-full bg-transparent">
                  Open Builder
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <ImageIcon className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle>Media Library</CardTitle>
              <CardDescription>Upload and manage images, videos, and files</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/media">
                <Button variant="outline" className="w-full bg-transparent">
                  Media Library
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-orange-600 mb-2" />
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users, roles, and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full bg-transparent">
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="w-8 h-8 text-red-600 mb-2" />
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure site settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full bg-transparent">
                  Site Settings
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Layout className="w-8 h-8 text-teal-600 mb-2" />
              <CardTitle>Templates</CardTitle>
              <CardDescription>Create and manage page templates</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/templates">
                <Button variant="outline" className="w-full bg-transparent">
                  Templates
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
