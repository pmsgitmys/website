'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronUp, Search, HelpCircle, Phone, Mail } from 'lucide-react'

interface FAQ {
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const faqs: FAQ[] = [
    {
      category: 'Orders & Shipping',
      question: 'How long does delivery take?',
      answer: 'We offer same-day delivery within Mysore city limits for orders placed before 3 PM. For other locations in Karnataka, delivery typically takes 2-3 business days. We also offer express shipping options for faster delivery.'
    },
    {
      category: 'Orders & Shipping',
      question: 'Do you ship outside Karnataka?',
      answer: 'Yes, we ship across India. Delivery times vary by location: 3-5 business days for metro cities and 5-7 business days for other locations. Free shipping is available on orders above ₹5,000.'
    },
    {
      category: 'Orders & Shipping',
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order on our Track Order page or directly on the courier website using the tracking number provided.'
    },
    {
      category: 'Returns & Refunds',
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy for most products. Items must be in original condition with all accessories, manuals, and packaging. Some products like earphones and software are non-returnable for hygiene and security reasons.'
    },
    {
      category: 'Returns & Refunds',
      question: 'How long does it take to get a refund?',
      answer: 'Refunds are processed within 7-10 business days after we receive and inspect the returned product. The amount will be credited to your original payment method. For cash on delivery orders, refunds are issued via bank transfer.'
    },
    {
      category: 'Returns & Refunds',
      question: 'Can I exchange a product?',
      answer: 'Yes, you can exchange products within 7 days of delivery if there is a manufacturing defect or if you received the wrong product. Contact our customer support to initiate an exchange.'
    },
    {
      category: 'Payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including Credit/Debit Cards, UPI, Net Banking, Wallets (Paytm, PhonePe, Google Pay), and Cash on Delivery. All online payments are processed securely through Razorpay.'
    },
    {
      category: 'Payment',
      question: 'Is it safe to use my credit card on your website?',
      answer: 'Absolutely! All payment transactions are encrypted and processed through Razorpay, a PCI-DSS compliant payment gateway. We never store your complete card details on our servers.'
    },
    {
      category: 'Payment',
      question: 'Do you offer EMI options?',
      answer: 'Yes, we offer EMI options on credit cards and through financing partners like Bajaj Finserv. EMI options are available on purchases above ₹10,000. You can select the EMI option during checkout.'
    },
    {
      category: 'Products',
      question: 'Are all products genuine?',
      answer: 'Yes, all our products are 100% genuine and sourced directly from authorized distributors and brand partners. Every product comes with official warranty and manufacturer support.'
    },
    {
      category: 'Products',
      question: 'Do products come with warranty?',
      answer: 'Yes, all products come with manufacturer warranty. Warranty periods vary by product and brand - typically 1 year for smartphones, 1-3 years for laptops, and 6 months to 1 year for accessories. Warranty details are mentioned on each product page.'
    },
    {
      category: 'Products',
      question: 'Can I visit your physical store?',
      answer: 'Yes! Our store is located at 123 Electronics Street, Mysore, Karnataka 570001. We are open Monday-Saturday from 10 AM to 8 PM, and Sunday from 11 AM to 6 PM. You can check out products in person and get expert advice from our staff.'
    },
    {
      category: 'Account',
      question: 'How do I create an account?',
      answer: 'Click on the "Sign In" button at the top of the page and select "Create Account". You can sign up using your email address or phone number. Creating an account allows you to track orders, save addresses, and receive exclusive offers.'
    },
    {
      category: 'Account',
      question: 'I forgot my password. What should I do?',
      answer: 'Click on "Sign In" and then select "Forgot Password". Enter your registered email address or phone number, and we will send you a link to reset your password.'
    },
    {
      category: 'Account',
      question: 'Can I change my delivery address after placing an order?',
      answer: 'You can change your delivery address only before the order is shipped. Contact our customer support immediately at +91-821-2345678 or contact@phonemax.in to request an address change.'
    }
  ]

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categories = Array.from(new Set(faqs.map(faq => faq.category)))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find answers to common questions about orders, shipping, returns, and more.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="search"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-base"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto">
          {categories.map((category) => {
            const categoryFAQs = filteredFAQs.filter(faq => faq.category === category)

            if (categoryFAQs.length === 0) return null

            return (
              <div key={category} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">{category}</h2>
                <div className="space-y-3">
                  {categoryFAQs.map((faq, index) => {
                    const globalIndex = faqs.indexOf(faq)
                    const isExpanded = expandedIndex === globalIndex

                    return (
                      <Card key={globalIndex} className="overflow-hidden">
                        <button
                          onClick={() => setExpandedIndex(isExpanded ? null : globalIndex)}
                          className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <CardContent className="pt-0 pb-6 px-6">
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          </CardContent>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {filteredFAQs.length === 0 && (
            <Card className="p-12 text-center">
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try a different search term or browse all FAQs above</p>
            </Card>
          )}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-center">Still have questions?</h2>
              <p className="text-gray-600 text-center mb-6">
                Can't find the answer you're looking for? Our customer support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="gap-2" asChild>
                  <a href="tel:+918212345678">
                    <Phone className="h-4 w-4" />
                    Call: +91-821-2345678
                  </a>
                </Button>
                <Button variant="outline" className="gap-2" asChild>
                  <a href="mailto:contact@phonemax.in">
                    <Mail className="h-4 w-4" />
                    Email Support
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
