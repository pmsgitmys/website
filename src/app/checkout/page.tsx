'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useCartStore } from '@/lib/store/cart'
import { toast } from 'sonner'
import { ArrowLeft, CreditCard, Truck, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ShippingAddress {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
}

interface PaymentMethod {
  type: 'cod' | 'razorpay' | 'upi'
  details?: any
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: session?.user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Mysore',
    state: 'Karnataka',
    pincode: ''
  })

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'cod'
  })

  const totalAmount = getTotalPrice()
  const deliveryCharge = totalAmount > 1000 ? 0 : 50
  const finalAmount = totalAmount + deliveryCharge

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/checkout')
      return
    }
    if (items.length === 0) {
      router.push('/products')
      return
    }
  }, [session, items.length, router])

  const handleAddressSubmit = () => {
    if (!shippingAddress.fullName || !shippingAddress.phone ||
        !shippingAddress.addressLine1 || !shippingAddress.city ||
        !shippingAddress.pincode) {
      toast.error('Please fill all required fields')
      return
    }
    setCurrentStep(2)
  }

  const handlePaymentSubmit = () => {
    setCurrentStep(3)
  }

  const handlePlaceOrder = async () => {
    setIsLoading(true)
    try {
      // Create order via API first
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress,
        paymentMethod,
        totalAmount: finalAmount
      }

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const order = await orderResponse.json()
      console.log('Order created:', order)

      // Handle payment based on method
      if (paymentMethod.type === 'cod') {
        // COD - direct completion
        clearCart()
        toast.success('Order placed successfully!')
        router.push('/orders')
      // Razorpay and UPI payment temporarily disabled for deployment
      }
    } catch (error) {
      console.error('Order placement error:', error)
      toast.error('Failed to place order')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRazorpayPayment = async (order: any) => {
    try {
      // Create Razorpay order
      const paymentOrderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalAmount,
          currency: 'INR',
          receipt: order.id,
        }),
      })

      if (!paymentOrderResponse.ok) {
        throw new Error('Failed to create payment order')
      }

      const paymentOrder = await paymentOrderResponse.json()

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: 'PhoneMax Electronics',
        description: `Order #${order.id}`,
        order_id: paymentOrder.id,
        handler: async function (response: any) {
          // Verify payment
          const verifyResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order.id,
            }),
          })

          if (verifyResponse.ok) {
            clearCart()
            toast.success('Payment successful! Order placed.')
            router.push('/orders')
          } else {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: session?.user?.email,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#3B82F6',
        },
        method: {
          upi: paymentMethod.type === 'upi',
          card: paymentMethod.type === 'razorpay',
          netbanking: paymentMethod.type === 'razorpay',
          wallet: false,
        },
      }

      // Load Razorpay script if not already loaded
      if (!(window as any).Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)
        await new Promise(resolve => {
          script.onload = resolve
        })
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.on('payment.failed', function (response: any) {
        toast.error('Payment failed. Please try again.')
        console.error('Payment failed:', response.error)
      })
      razorpay.open()
    } catch (error) {
      console.error('Razorpay payment error:', error)
      toast.error('Payment initialization failed')
    }
  }

  if (!session || items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span className="ml-2 font-medium">Shipping</span>
                </div>
                <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className="ml-2 font-medium">Payment</span>
                </div>
                <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    3
                  </div>
                  <span className="ml-2 font-medium">Review</span>
                </div>
              </div>
            </div>

            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      value={shippingAddress.addressLine1}
                      onChange={(e) => setShippingAddress({...shippingAddress, addressLine1: e.target.value})}
                      placeholder="House/Flat/Office No, Building Name, Street"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={shippingAddress.addressLine2}
                      onChange={(e) => setShippingAddress({...shippingAddress, addressLine2: e.target.value})}
                      placeholder="Area, Landmark"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddressSubmit} className="w-full mt-6">
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={paymentMethod.type}
                    onValueChange={(value) => setPaymentMethod({type: value as PaymentMethod['type']})}
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Cash on Delivery</div>
                            <div className="text-sm text-gray-500">Pay when your order arrives</div>
                          </div>
                          <Truck className="h-5 w-5 text-green-600" />
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <Label htmlFor="razorpay" className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Credit/Debit Card</div>
                            <div className="text-sm text-gray-500">Pay securely with Razorpay</div>
                          </div>
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">UPI Payment</div>
                            <div className="text-sm text-gray-500">Pay with Google Pay, PhonePe, Paytm</div>
                          </div>
                          <div className="text-orange-600">₹</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="flex gap-4 mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                      Back to Address
                    </Button>
                    <Button onClick={handlePaymentSubmit} className="flex-1">
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Shipping Address Review */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Delivery Address</h3>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                          Edit
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                        <div className="font-medium">{shippingAddress.fullName}</div>
                        <div>{shippingAddress.phone}</div>
                        <div>{shippingAddress.addressLine1}</div>
                        {shippingAddress.addressLine2 && <div>{shippingAddress.addressLine2}</div>}
                        <div>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</div>
                      </div>
                    </div>

                    {/* Payment Method Review */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Payment Method</h3>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                          Edit
                        </Button>
                      </div>
                      <div className="text-sm p-3 bg-gray-50 rounded">
                        {paymentMethod.type === 'cod' && 'Cash on Delivery'}
                        {paymentMethod.type === 'razorpay' && 'Credit/Debit Card (Razorpay)'}
                        {paymentMethod.type === 'upi' && 'UPI Payment'}
                      </div>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      className="w-full"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Placing Order...' : `Place Order - ₹${finalAmount}`}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 bg-gray-100 rounded">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                        <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total Amount</span>
                    <span>₹{finalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {totalAmount < 1000 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                    <p className="text-yellow-800">
                      Add ₹{(1000 - totalAmount).toLocaleString()} more to get FREE delivery!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}