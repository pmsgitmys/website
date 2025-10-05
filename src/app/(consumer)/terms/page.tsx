import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>PhoneMax Electronics - Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">1. Agreement to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using PhoneMax Electronics website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">2. Products and Services</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  PhoneMax Electronics offers genuine electronic products including smartphones, laptops, accessories, and related services in Mysore, Karnataka.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>All products come with manufacturer warranty</li>
                  <li>Product availability is subject to stock</li>
                  <li>Prices are subject to change without notice</li>
                  <li>We reserve the right to limit quantities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">3. Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website, to understand our practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">4. Returns and Refunds</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We offer a 7-day return policy for eligible products:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Products must be in original condition</li>
                  <li>Original packaging and accessories required</li>
                  <li>Proof of purchase required</li>
                  <li>Some products may not be eligible for return</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">5. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  PhoneMax Electronics shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">6. Contact Information</h2>
                <div className="text-gray-700 space-y-2">
                  <p><strong>PhoneMax Electronics</strong></p>
                  <p>123 Electronics Street, Mysore, Karnataka 570001</p>
                  <p>Phone: +91-821-2345678</p>
                  <p>Email: support@phonemax.com</p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}