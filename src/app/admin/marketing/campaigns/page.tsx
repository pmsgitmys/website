'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Megaphone, Plus, TrendingUp, Users, Mail, BarChart3 } from 'lucide-react'

const campaigns = [
  { id: 1, name: 'Diwali Mega Sale 2025', type: 'Email', status: 'active', reach: 15000, conversions: 450, revenue: 2250000, startDate: '2025-10-15' },
  { id: 2, name: 'New Year Bonanza', type: 'SMS', status: 'scheduled', reach: 12000, conversions: 0, revenue: 0, startDate: '2025-12-25' },
  { id: 3, name: 'Flash Sale Weekend', type: 'Push Notification', status: 'active', reach: 8000, conversions: 320, revenue: 1600000, startDate: '2025-10-01' },
  { id: 4, name: 'Student Discount Program', type: 'Social Media', status: 'completed', reach: 20000, conversions: 580, revenue: 1740000, startDate: '2025-09-01' },
  { id: 5, name: 'Referral Rewards', type: 'Email', status: 'active', reach: 10000, conversions: 250, revenue: 1250000, startDate: '2025-09-15' },
]

export default function CampaignsPage() {
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length
  const totalReach = campaigns.reduce((sum, c) => sum + c.reach, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0)
  const conversionRate = totalReach > 0 ? ((totalConversions / totalReach) * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Campaigns</h1>
          <p className="text-gray-500 mt-2">Manage and track marketing initiatives</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns}</div>
            <p className="text-xs text-green-600 mt-1">Running now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Reach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalReach / 1000).toFixed(0)}K</div>
            <p className="text-xs text-gray-500 mt-1">People reached</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{conversionRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Overall performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Campaign Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500 mt-1">Generated revenue</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Marketing Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    campaign.type === 'Email' ? 'bg-blue-100' :
                    campaign.type === 'SMS' ? 'bg-green-100' :
                    campaign.type === 'Push Notification' ? 'bg-purple-100' : 'bg-pink-100'
                  }`}>
                    <Mail className={`h-6 w-6 ${
                      campaign.type === 'Email' ? 'text-blue-600' :
                      campaign.type === 'SMS' ? 'text-green-600' :
                      campaign.type === 'Push Notification' ? 'text-purple-600' : 'text-pink-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-sm text-gray-500">{campaign.type} • Started {new Date(campaign.startDate).toLocaleDateString('en-IN')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-medium">{(campaign.reach / 1000).toFixed(0)}K reach</div>
                    <div className="text-xs text-gray-500">{campaign.conversions} conversions</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">₹{(campaign.revenue / 100000).toFixed(1)}L</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.slice(0, 4).map((campaign) => {
                const convRate = campaign.reach > 0 ? ((campaign.conversions / campaign.reach) * 100).toFixed(1) : 0
                return (
                  <div key={campaign.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{campaign.name}</span>
                      <span className="text-gray-600">{convRate}% conversion</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${Math.min(Number(convRate) * 10, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Channel Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Email', 'SMS', 'Push Notification', 'Social Media'].map((channel) => {
                const channelCampaigns = campaigns.filter(c => c.type === channel)
                const count = channelCampaigns.length
                const revenue = channelCampaigns.reduce((sum, c) => sum + c.revenue, 0)
                return (
                  <div key={channel} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">{channel}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">₹{(revenue / 100000).toFixed(1)}L</div>
                      <div className="text-xs text-gray-500">{count} campaigns</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
