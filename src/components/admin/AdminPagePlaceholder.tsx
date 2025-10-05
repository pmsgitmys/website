'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Construction, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface AdminPagePlaceholderProps {
  title: string
  description: string
  backLink?: string
}

export function AdminPagePlaceholder({
  title,
  description,
  backLink = '/admin/dashboard'
}: AdminPagePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <Link href={backLink}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-yellow-100 rounded-full">
              <Construction className="h-12 w-12 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Under Development</h3>
              <p className="text-gray-600 max-w-md">
                This admin module is currently under development. Full functionality will be available soon.
              </p>
            </div>
            <div className="pt-4">
              <Link href="/admin/dashboard">
                <Button>Return to Dashboard</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Planned Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Data management interface</li>
              <li>• Advanced filtering options</li>
              <li>• Export functionality</li>
              <li>• Bulk operations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Expected completion: Q1 2025
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Check back soon for updates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Contact the development team for more information about this module.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
