// Mock data for admin dashboard

export interface Order {
  id: string
  orderNumber: string
  customer: {
    id: string
    name: string
    email: string
    phone: string
  }
  items: OrderItem[]
  total: number
  subtotal: number
  tax: number
  shipping: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: string
  shippingAddress: {
    street: string
    city: string
    state: string
    pincode: string
  }
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  minStock: number
  sold: number
  revenue: number
  status: 'active' | 'inactive' | 'out_of_stock'
  image: string
  createdAt: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  orderId: string
  customer: {
    name: string
    email: string
  }
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  paidDate?: string
  createdAt: string
}

// Generate mock orders
export const generateOrders = (): Order[] => {
  const customers = [
    { id: 'C001', name: 'Rajesh Mehta', email: 'rajesh@example.com', phone: '+91-9876543210' },
    { id: 'C002', name: 'Sunita Sharma', email: 'sunita@example.com', phone: '+91-9876543211' },
    { id: 'C003', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91-9876543212' },
    { id: 'C004', name: 'Anita Gupta', email: 'anita@example.com', phone: '+91-9876543213' },
    { id: 'C005', name: 'Ravi Kumar', email: 'ravi@example.com', phone: '+91-9876543214' },
    { id: 'C006', name: 'Priya Patel', email: 'priya@example.com', phone: '+91-9876543215' },
    { id: 'C007', name: 'Amit Reddy', email: 'amit@example.com', phone: '+91-9876543216' },
    { id: 'C008', name: 'Lakshmi Iyer', email: 'lakshmi@example.com', phone: '+91-9876543217' },
  ]

  const products = [
    { id: 'P001', name: 'iPhone 15 Pro Max', price: 134900 },
    { id: 'P002', name: 'Samsung Galaxy S24 Ultra', price: 124999 },
    { id: 'P003', name: 'MacBook Pro M3', price: 199900 },
    { id: 'P004', name: 'Sony WH-1000XM5', price: 29990 },
    { id: 'P005', name: 'iPad Pro M4', price: 89900 },
  ]

  const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  const paymentStatuses: Order['paymentStatus'][] = ['pending', 'paid', 'failed']
  const paymentMethods = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery']

  const orders: Order[] = []

  for (let i = 0; i < 50; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const numItems = Math.floor(Math.random() * 3) + 1
    const items: OrderItem[] = []
    let subtotal = 0

    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)]
      const quantity = Math.floor(Math.random() * 3) + 1
      const total = product.price * quantity
      subtotal += total

      items.push({
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
        total,
      })
    }

    const tax = Math.round(subtotal * 0.18)
    const shipping = subtotal > 50000 ? 0 : 500
    const total = subtotal + tax + shipping

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    orders.push({
      id: `ORD${(50000 + i).toString()}`,
      orderNumber: `ORD-${(50000 + i).toString()}`,
      customer,
      items,
      subtotal,
      tax,
      shipping,
      total,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      shippingAddress: {
        street: `${Math.floor(Math.random() * 500) + 1} MG Road`,
        city: 'Mysore',
        state: 'Karnataka',
        pincode: '570001',
      },
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    })
  }

  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Generate mock products
export const generateProducts = (): Product[] => {
  const categories = ['Smartphones', 'Laptops', 'Audio', 'Accessories', 'Tablets']
  const products: Product[] = [
    { name: 'iPhone 15 Pro Max', sku: 'IP15PM-256', category: 'Smartphones', price: 134900, stock: 25, minStock: 15, sold: 1560, revenue: 20995440 },
    { name: 'Samsung Galaxy S24 Ultra', sku: 'SGS24U-256', category: 'Smartphones', price: 124999, stock: 30, minStock: 12, sold: 890, revenue: 11999550 },
    { name: 'OnePlus 12', sku: 'OP12-256', category: 'Smartphones', price: 64999, stock: 45, minStock: 20, sold: 340, revenue: 2209966 },
    { name: 'Google Pixel 8 Pro', sku: 'GP8P-128', category: 'Smartphones', price: 84999, stock: 20, minStock: 15, sold: 210, revenue: 1784979 },
    { name: 'MacBook Pro M3', sku: 'MBP-M3-16', category: 'Laptops', price: 199900, stock: 15, minStock: 8, sold: 450, revenue: 8999550 },
    { name: 'MacBook Air M2', sku: 'MBA-M2-13', category: 'Laptops', price: 114900, stock: 25, minStock: 10, sold: 560, revenue: 6434400 },
    { name: 'Dell XPS 15', sku: 'DX15-I7', category: 'Laptops', price: 145000, stock: 18, minStock: 10, sold: 230, revenue: 3335000 },
    { name: 'HP Spectre x360', sku: 'HPS360-I7', category: 'Laptops', price: 134900, stock: 12, minStock: 8, sold: 180, revenue: 2428200 },
    { name: 'Sony WH-1000XM5', sku: 'SWH-1000XM5', category: 'Audio', price: 29990, stock: 40, minStock: 20, sold: 780, revenue: 1949220 },
    { name: 'AirPods Pro 2nd Gen', sku: 'APP-2ND', category: 'Audio', price: 24900, stock: 60, minStock: 30, sold: 920, revenue: 2290800 },
    { name: 'JBL Flip 6', sku: 'JBL-F6', category: 'Audio', price: 12999, stock: 50, minStock: 25, sold: 450, revenue: 584955 },
    { name: 'Bose QuietComfort 45', sku: 'BQC-45', category: 'Audio', price: 28990, stock: 35, minStock: 15, sold: 340, revenue: 985660 },
    { name: 'iPad Pro M4', sku: 'IPP-M4-11', category: 'Tablets', price: 89900, stock: 22, minStock: 12, sold: 340, revenue: 3059160 },
    { name: 'Samsung Tab S9', sku: 'STS9-11', category: 'Tablets', price: 74999, stock: 18, minStock: 10, sold: 180, revenue: 1349982 },
    { name: 'Apple Pencil Pro', sku: 'AP-PRO', category: 'Accessories', price: 11900, stock: 100, minStock: 50, sold: 670, revenue: 797300 },
    { name: 'Magic Keyboard', sku: 'MK-IPAD', category: 'Accessories', price: 30900, stock: 45, minStock: 25, sold: 290, revenue: 896100 },
    { name: 'Samsung Buds Pro 2', sku: 'SBP2', category: 'Audio', price: 17999, stock: 55, minStock: 30, sold: 510, revenue: 917949 },
    { name: 'Anker PowerCore', sku: 'APC-20K', category: 'Accessories', price: 3499, stock: 120, minStock: 60, sold: 890, revenue: 311411 },
    { name: 'Logitech MX Master 3S', sku: 'LMX-M3S', category: 'Accessories', price: 9995, stock: 65, minStock: 30, sold: 420, revenue: 419790 },
    { name: 'Dell 27" Monitor', sku: 'D27-4K', category: 'Accessories', price: 45999, stock: 28, minStock: 15, sold: 180, revenue: 827982 },
  ]

  return products.map((p, i) => ({
    id: `P${String(i + 1).padStart(3, '0')}`,
    ...p,
    status: p.stock === 0 ? 'out_of_stock' : p.stock < p.minStock ? 'active' : 'active',
    image: `/products/${p.sku}.jpg`,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  }))
}

// Generate mock customers
export const generateCustomers = (): Customer[] => {
  const customers: Customer[] = [
    { name: 'Rajesh Mehta', email: 'rajesh@example.com', phone: '+91-9876543210', totalOrders: 15, totalSpent: 450000 },
    { name: 'Sunita Sharma', email: 'sunita@example.com', phone: '+91-9876543211', totalOrders: 12, totalSpent: 380000 },
    { name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91-9876543212', totalOrders: 20, totalSpent: 620000 },
    { name: 'Anita Gupta', email: 'anita@example.com', phone: '+91-9876543213', totalOrders: 8, totalSpent: 240000 },
    { name: 'Ravi Kumar', email: 'ravi@example.com', phone: '+91-9876543214', totalOrders: 18, totalSpent: 550000 },
    { name: 'Priya Patel', email: 'priya@example.com', phone: '+91-9876543215', totalOrders: 10, totalSpent: 320000 },
    { name: 'Amit Reddy', email: 'amit@example.com', phone: '+91-9876543216', totalOrders: 14, totalSpent: 410000 },
    { name: 'Lakshmi Iyer', email: 'lakshmi@example.com', phone: '+91-9876543217', totalOrders: 16, totalSpent: 480000 },
    { name: 'Karthik Nair', email: 'karthik@example.com', phone: '+91-9876543218', totalOrders: 9, totalSpent: 270000 },
    { name: 'Deepa Menon', email: 'deepa@example.com', phone: '+91-9876543219', totalOrders: 11, totalSpent: 340000 },
  ]

  return customers.map((c, i) => ({
    id: `C${String(i + 1).padStart(3, '0')}`,
    ...c,
    lastOrderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: Math.random() > 0.1 ? 'active' : 'inactive',
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  }))
}

// Generate mock invoices
export const generateInvoices = (): Invoice[] => {
  const orders = generateOrders().slice(0, 30)
  return orders.map((order, i) => ({
    id: `INV${String(i + 1).padStart(4, '0')}`,
    invoiceNumber: `INV-2024-${String(i + 1).padStart(4, '0')}`,
    orderId: order.id,
    customer: {
      name: order.customer.name,
      email: order.customer.email,
    },
    amount: order.total,
    status: order.paymentStatus === 'paid' ? 'paid' : order.paymentStatus === 'failed' ? 'cancelled' : 'sent',
    dueDate: new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    paidDate: order.paymentStatus === 'paid' ? new Date(new Date(order.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    createdAt: order.createdAt,
  }))
}
