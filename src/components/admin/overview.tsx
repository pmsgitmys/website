import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface OverviewProps {
  data?: {
    name: string
    total: number
  }[]
}

export function Overview({ data = [] }: OverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Sales overview for the current period</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.name}</span>
                <span className="font-medium">${item.total}</span>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}