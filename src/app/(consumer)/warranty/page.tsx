'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, CheckCircle, AlertCircle, Phone, Mail, MapPin, Clock, FileText } from 'lucide-react'
import Link from 'next/link'

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Warranty Information</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            All our products come with manufacturer warranty. Learn about warranty coverage, claims, and support.
          </p>
        </div>

        {/* Warranty Overview */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Warranty Coverage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Standard Warranty Periods</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Smartphones</p>
                      <p className="text-sm text-gray-600">1 year manufacturer warranty</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Laptops</p>
                      <p className="text-sm text-gray-600">1-3 years depending on brand</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Tablets & iPads</p>
                      <p className="text-sm text-gray-600">1 year manufacturer warranty</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Accessories</p>
                      <p className="text-sm text-gray-600">6 months to 1 year</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Audio Products</p>
                      <p className="text-sm text-gray-600">1 year manufacturer warranty</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Smart Watches</p>
                      <p className="text-sm text-gray-600">1 year manufacturer warranty</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Important Note
                </h4>
                <p className="text-sm text-gray-700">
                  Warranty period starts from the date of purchase. Please keep your invoice/receipt safe as it's required for warranty claims.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What's Covered */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  What's Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-sm">Manufacturing defects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-sm">Hardware failures under normal use</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-sm">Display issues (dead pixels, backlight)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-sm">Battery performance issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-sm">Software pre-installed by manufacturer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-sm">Charging port and button defects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-sm">Speaker and microphone issues</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  What's NOT Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-sm">Physical damage (cracked screen, water damage)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-sm">Damage from accidents or misuse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-sm">Unauthorized repairs or modifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-sm">Software viruses or data loss</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-sm">Consumables (batteries beyond normal wear)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-sm">Cosmetic damage that doesn't affect functionality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-sm">Damage from natural disasters</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How to Claim Warranty */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                How to Claim Warranty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Contact Customer Support</h4>
                    <p className="text-sm text-gray-600">
                      Call us at +91-821-2345678 or email contact@phonemax.in with your order details and issue description.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Provide Required Documents</h4>
                    <p className="text-sm text-gray-600">
                      Submit your original invoice/receipt and warranty card. Keep these documents safe from the date of purchase.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Product Evaluation</h4>
                    <p className="text-sm text-gray-600">
                      Bring the product to our store or authorized service center for evaluation. Our technician will assess the issue.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Repair or Replacement</h4>
                    <p className="text-sm text-gray-600">
                      If the claim is valid, the product will be repaired or replaced within 7-14 business days, depending on parts availability.
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    Processing Time
                  </h4>
                  <p className="text-sm text-gray-700">
                    Standard warranty claims are processed within 7-14 business days. Complex issues requiring manufacturer approval may take up to 21 business days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Extended Warranty */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-16 w-16 text-purple-600" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">Extended Warranty Available</h3>
                  <p className="text-gray-600 mb-4">
                    Protect your investment with extended warranty plans. Get coverage for up to 3 additional years with comprehensive protection.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Accidental damage protection</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Liquid damage coverage</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Priority service</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Button size="lg" asChild>
                    <Link href="/contact">Learn More</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Warranty Support Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="p-3 bg-blue-100 rounded-full mb-3">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-1">Phone Support</h4>
                  <p className="text-sm text-gray-600 mb-2">Mon-Sat: 10AM-8PM</p>
                  <a href="tel:+918212345678" className="text-blue-600 hover:underline">
                    +91-821-2345678
                  </a>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="p-3 bg-blue-100 rounded-full mb-3">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-1">Email Support</h4>
                  <p className="text-sm text-gray-600 mb-2">Response within 24 hours</p>
                  <a href="mailto:contact@phonemax.in" className="text-blue-600 hover:underline">
                    contact@phonemax.in
                  </a>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="p-3 bg-blue-100 rounded-full mb-3">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-1">Visit Our Store</h4>
                  <p className="text-sm text-gray-600 mb-2">123 Electronics Street</p>
                  <p className="text-sm text-gray-600">Mysore, Karnataka 570001</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
