'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, CreditCard, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { generateOrders } from '@/lib/admin-data'
import { useMemo } from 'react'

export default function TransactionsPage() {
  const orders = useMemo(() => generateOrders(), [])

  const transactions = useMemo(() => {
    return orders.map((order, i) => ({
      id: `TXN-${String(i + 1000).padStart(6, '0')}`,
      type: order.paymentStatus === 'refunded' ? 'debit' : 'credit',
      amount: order.total,
      method: order.paymentMethod,
      status: order.paymentStatus,
      date: order.createdAt,
      orderNumber: order.orderNumber,
      customer: order.customer.name
    }))
  }, [orders])

  const financialMetrics = useMemo(() => {
    const totalCredit = transactions.filter(t => t.type === 'credit' && t.status === 'paid').reduce((sum, t) => sum + t.amount, 0)
    const totalDebit = transactions.filter(t => t.type === 'debit' || t.status === 'refunded').reduce((sum, t) => sum + t.amount, 0)
    const netRevenue = totalCredit - totalDebit
    const pendingAmount = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0)

    return { totalCredit, totalDebit, netRevenue, pendingAmount }
  }, [transactions])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Transactions</h1>
          <p className="text-gray-500 mt-2">Payment processing and transaction history</p>
        </div>
        <Button>
          <DollarSign className="h-4 w-4 mr-2" />
          Export Ledger
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{(financialMetrics.totalCredit / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500 mt-1">Payments received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <ArrowDownRight className="h-4 w-4" />
              Total Debits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{(financialMetrics.totalDebit / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500 mt-1">Refunds & expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Net Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(financialMetrics.netRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-green-600 mt-1">+{((financialMetrics.netRevenue / financialMetrics.totalCredit) * 100).toFixed(0)}% net margin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">₹{(financialMetrics.pendingAmount / 100000).toFixed(1)}L</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting clearance</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 10).map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {txn.type === 'credit' ?
                      <ArrowUpRight className="h-5 w-5 text-green-600" /> :
                      <ArrowDownRight className="h-5 w-5 text-red-600" />
                    }
                  </div>
                  <div>
                    <div className="font-medium">{txn.id}</div>
                    <div className="text-sm text-gray-500">{txn.customer} • {txn.method}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.type === 'credit' ? '+' : '-'}₹{(txn.amount / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-gray-500">{new Date(txn.date).toLocaleDateString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery'].map((method) => {
                const count = transactions.filter(t => t.method === method).length
                const percentage = (count / transactions.length) * 100
                return (
                  <div key={method} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{method}</span>
                      <span className="text-gray-600">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
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
            <CardTitle>Transaction Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { status: 'paid', label: 'Successful', color: 'green' },
                { status: 'pending', label: 'Pending', color: 'yellow' },
                { status: 'failed', label: 'Failed', color: 'red' },
                { status: 'refunded', label: 'Refunded', color: 'blue' }
              ].map((item) => {
                const count = transactions.filter(t => t.status === item.status).length
                const percentage = (count / transactions.length) * 100
                return (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-gray-600">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-${item.color}-600 h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
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
