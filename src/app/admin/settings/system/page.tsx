'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, Server, Database, Globe, Zap, CheckCircle, AlertTriangle } from 'lucide-react'

const systemSettings = [
  { category: 'Application', setting: 'App Name', value: 'PhoneMax', status: 'configured' },
  { category: 'Application', setting: 'Environment', value: 'Production', status: 'active' },
  { category: 'Application', setting: 'Debug Mode', value: 'Disabled', status: 'configured' },
  { category: 'Database', setting: 'Primary DB', value: 'PostgreSQL 15.3', status: 'connected' },
  { category: 'Database', setting: 'Connection Pool', value: '50 connections', status: 'active' },
  { category: 'Database', setting: 'Backup Schedule', value: 'Daily at 2:00 AM', status: 'enabled' },
  { category: 'API', setting: 'Rate Limiting', value: '1000 req/min', status: 'enabled' },
  { category: 'API', setting: 'API Version', value: 'v2.1.0', status: 'active' },
  { category: 'Cache', setting: 'Redis Cache', value: 'Enabled', status: 'active' },
  { category: 'Cache', setting: 'TTL', value: '3600 seconds', status: 'configured' },
]

export default function SystemPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
          <p className="text-gray-500 mt-2">Configure and monitor system settings</p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Update Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Server className="h-4 w-4" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-gray-500 mt-1">All services running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Connected</div>
            <p className="text-xs text-gray-500 mt-1">PostgreSQL 15.3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              API Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-gray-500 mt-1">v2.1.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">95%</div>
            <p className="text-xs text-gray-500 mt-1">Optimal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemSettings.filter(s => s.category === 'Application').map((setting, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{setting.setting}</div>
                    <div className="text-sm text-gray-500">{setting.value}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    setting.status === 'active' || setting.status === 'configured' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {setting.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemSettings.filter(s => s.category === 'Database').map((setting, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{setting.setting}</div>
                    <div className="text-sm text-gray-500">{setting.value}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    setting.status === 'connected' || setting.status === 'active' || setting.status === 'enabled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {setting.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>API & Cache Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemSettings.filter(s => s.category === 'API' || s.category === 'Cache').map((setting, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {setting.category === 'API' ? <Globe className="h-5 w-5 text-blue-600" /> : <Zap className="h-5 w-5 text-purple-600" />}
                    <div>
                      <div className="font-medium">{setting.setting}</div>
                      <div className="text-sm text-gray-500">{setting.value}</div>
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    setting.status === 'enabled' || setting.status === 'active' || setting.status === 'configured' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {setting.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                  <CheckCircle className="h-5 w-5" />
                  All Systems Operational
                </div>
                <p className="text-sm text-green-600">No issues detected in the last 7 days</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Server Uptime</span>
                  <span className="text-gray-600">99.9%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.9%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Response Time</span>
                  <span className="text-gray-600">45ms avg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Error Rate</span>
                  <span className="text-gray-600">0.1%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.9%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
