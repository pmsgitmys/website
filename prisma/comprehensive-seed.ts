import { PrismaClient, UserRole, UserStatus } from '@prisma/client'

const prisma = new PrismaClient()

// Test data generators
const brands = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Sony', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Bose', 'JBL', 'Anker', 'Belkin']
const categories = [
  { name: 'Smartphones', slug: 'smartphones', description: 'Latest mobile phones with cutting-edge technology' },
  { name: 'Laptops', slug: 'laptops', description: 'High-performance laptops for work and gaming' },
  { name: 'Audio', slug: 'audio', description: 'Premium headphones, speakers and audio accessories' },
  { name: 'Accessories', slug: 'accessories', description: 'Cases, chargers, cables and other essentials' },
  { name: 'Gaming', slug: 'gaming', description: 'Gaming consoles, controllers and gaming accessories' },
  { name: 'Wearables', slug: 'wearables', description: 'Smartwatches, fitness trackers and wearable tech' }
]

const sampleProducts = [
  // Smartphones
  { name: 'iPhone 15 Pro Max 256GB', category: 'smartphones', brand: 'Apple', price: 134900, comparePrice: 149900, stock: 25 },
  { name: 'iPhone 15 Pro 128GB', category: 'smartphones', brand: 'Apple', price: 124900, comparePrice: 139900, stock: 30 },
  { name: 'Samsung Galaxy S24 Ultra 512GB', category: 'smartphones', brand: 'Samsung', price: 129999, comparePrice: 139999, stock: 20 },
  { name: 'Samsung Galaxy S24+ 256GB', category: 'smartphones', brand: 'Samsung', price: 94999, comparePrice: 104999, stock: 15 },
  { name: 'Google Pixel 8 Pro 256GB', category: 'smartphones', brand: 'Google', price: 84999, comparePrice: 94999, stock: 18 },
  { name: 'OnePlus 12 256GB', category: 'smartphones', brand: 'OnePlus', price: 64999, comparePrice: 69999, stock: 22 },
  { name: 'Xiaomi 14 Ultra 512GB', category: 'smartphones', brand: 'Xiaomi', price: 89999, comparePrice: 99999, stock: 12 },

  // Laptops
  { name: 'MacBook Pro 14" M3 512GB', category: 'laptops', brand: 'Apple', price: 199900, comparePrice: 219900, stock: 8 },
  { name: 'MacBook Air 15" M3 256GB', category: 'laptops', brand: 'Apple', price: 134900, comparePrice: 149900, stock: 12 },
  { name: 'Dell XPS 13 Plus i7 512GB', category: 'laptops', brand: 'Dell', price: 139999, comparePrice: 154999, stock: 6 },
  { name: 'HP Spectre x360 i7 1TB', category: 'laptops', brand: 'HP', price: 149999, comparePrice: 164999, stock: 5 },
  { name: 'Lenovo ThinkPad X1 Carbon i7', category: 'laptops', brand: 'Lenovo', price: 159999, comparePrice: 174999, stock: 7 },
  { name: 'ASUS ROG Zephyrus G14 RTX4060', category: 'laptops', brand: 'ASUS', price: 124999, comparePrice: 139999, stock: 9 },

  // Audio
  { name: 'AirPods Pro 2nd Gen', category: 'audio', brand: 'Apple', price: 24900, comparePrice: 27900, stock: 45 },
  { name: 'Sony WH-1000XM5', category: 'audio', brand: 'Sony', price: 29990, comparePrice: 34990, stock: 30 },
  { name: 'Bose QuietComfort 45', category: 'audio', brand: 'Bose', price: 32900, comparePrice: 36900, stock: 25 },
  { name: 'JBL Charge 5 Portable Speaker', category: 'audio', brand: 'JBL', price: 14999, comparePrice: 17999, stock: 40 },

  // Accessories
  { name: 'Anker PowerCore 26800mAh', category: 'accessories', brand: 'Anker', price: 4999, comparePrice: 5999, stock: 60 },
  { name: 'Belkin 3-in-1 Wireless Charger', category: 'accessories', brand: 'Belkin', price: 8999, comparePrice: 9999, stock: 35 },
  { name: 'Apple USB-C to Lightning Cable', category: 'accessories', brand: 'Apple', price: 1900, comparePrice: 2400, stock: 80 },

  // Gaming
  { name: 'PlayStation 5 Console', category: 'gaming', brand: 'Sony', price: 54990, comparePrice: 59990, stock: 3 },
  { name: 'Xbox Series X', category: 'gaming', brand: 'Microsoft', price: 52990, comparePrice: 57990, stock: 4 },

  // Wearables
  { name: 'Apple Watch Series 9 45mm', category: 'wearables', brand: 'Apple', price: 45900, comparePrice: 49900, stock: 20 },
  { name: 'Samsung Galaxy Watch 6 Classic', category: 'wearables', brand: 'Samsung', price: 38990, comparePrice: 42990, stock: 15 }
]

// User test data
const testUsers = [
  { name: 'Regular Customer', email: 'customer@test.com', role: UserRole.CUSTOMER, status: UserStatus.ACTIVE },
  { name: 'Premium Customer', email: 'premium@test.com', role: UserRole.CUSTOMER, status: UserStatus.ACTIVE },
  { name: 'Store Employee', email: 'employee@phonemax.com', role: UserRole.EMPLOYEE, status: UserStatus.ACTIVE },
  { name: 'Store Manager', email: 'manager@phonemax.com', role: UserRole.MANAGER, status: UserStatus.ACTIVE },
  { name: 'Admin User', email: 'admin@phonemax.com', role: UserRole.ADMIN, status: UserStatus.ACTIVE },
  { name: 'Super Admin', email: 'superadmin@phonemax.com', role: UserRole.SUPER_ADMIN, status: UserStatus.ACTIVE },
  { name: 'Inactive User', email: 'inactive@test.com', role: UserRole.CUSTOMER, status: UserStatus.INACTIVE },
  { name: 'Suspended User', email: 'suspended@test.com', role: UserRole.CUSTOMER, status: UserStatus.SUSPENDED }
]

function generateRandomReviews(productId: string, count: number) {
  const reviews = []
  const reviewTitles = [
    'Excellent product!', 'Great value for money', 'Highly recommended', 'Good quality', 'Amazing features',
    'Perfect for my needs', 'Outstanding performance', 'Worth every penny', 'Impressive build quality', 'Love it!'
  ]
  const reviewComments = [
    'This product exceeded my expectations. Great build quality and performance.',
    'Fantastic value for the price. Would definitely buy again.',
    'Really happy with this purchase. Works exactly as advertised.',
    'Good product overall, though delivery could be faster.',
    'Excellent customer service and quick delivery.',
    'The product is good but packaging could be better.',
    'Amazing quality and features. Highly recommend to others.',
    'Perfect for daily use. Very satisfied with the purchase.',
    'Great product but slightly expensive. Still worth it.',
    'Outstanding performance and reliability. Five stars!'
  ]

  for (let i = 0; i < count; i++) {
    reviews.push({
      productId,
      userId: '', // Will be filled later
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars mostly
      title: reviewTitles[Math.floor(Math.random() * reviewTitles.length)],
      comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
      verified: Math.random() > 0.3, // 70% verified purchases
      helpfulCount: Math.floor(Math.random() * 15)
    })
  }
  return reviews
}

function generateLargeDataset(): Array<{name: string, category: string, brand: string, price: number, comparePrice: number, stock: number}> {
  // Generate 1000+ products for scalability testing with proper brand-category mapping
  const largeProductSet: Array<{name: string, category: string, brand: string, price: number, comparePrice: number, stock: number}> = []

  // Proper brand-to-category mappings
  const brandCategoryMap: Record<string, string[]> = {
    'Apple': ['smartphones', 'laptops', 'audio', 'accessories', 'wearables'],
    'Samsung': ['smartphones', 'accessories'],
    'Google': ['smartphones', 'accessories'],
    'OnePlus': ['smartphones', 'accessories'],
    'Xiaomi': ['smartphones', 'accessories', 'wearables'],
    'Sony': ['audio', 'gaming', 'accessories'],
    'Dell': ['laptops', 'accessories'],
    'HP': ['laptops', 'accessories'],
    'Lenovo': ['laptops', 'accessories'],
    'ASUS': ['laptops', 'gaming', 'accessories'],
    'Bose': ['audio'],
    'JBL': ['audio'],
    'Anker': ['accessories'],
    'Belkin': ['accessories']
  }

  const phoneModels = ['Pro', 'Plus', 'Ultra', 'Max', 'Mini', 'Standard', 'Lite', 'Special Edition', 'Air', 'Edge', 'Note', 'Galaxy', 'Pixel']
  const laptopModels = ['Pro', 'Air', 'Book', 'Pavilion', 'Inspiron', 'ThinkPad', 'Surface', 'ZenBook', 'Vivobook', 'ROG', 'Gaming']
  const audioModels = ['Pro', 'Max', 'Studio', 'QuietComfort', 'SoundLink', 'Charge', 'Flip', 'Boom', 'PowerCore', 'Wireless']
  const accessoryModels = ['Pro', 'Max', 'Ultra', 'Fast', 'Wireless', 'Portable', 'Compact', 'Premium', 'Essential']
  const wearableModels = ['Watch', 'Band', 'Tracker', 'Sport', 'Classic', 'Active', 'Fit', 'Health']
  const gamingModels = ['Pro', 'Elite', 'Gaming', 'Controller', 'Console', 'Headset', 'Mouse', 'Keyboard']

  const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB']
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Purple', 'Gold', 'Silver', 'Rose Gold', 'Space Gray']

  Object.entries(brandCategoryMap).forEach(([brand, allowedCategories]) => {
    allowedCategories.forEach(categorySlug => {
      const category = categories.find(c => c.slug === categorySlug)
      if (!category) return

      // Generate appropriate number of products per brand-category combination
      const productCount = Math.floor(Math.random() * 15) + 10 // 10-24 products per brand-category

      for (let i = 0; i < productCount; i++) {
        let model, storage = '', priceRange

        switch (categorySlug) {
          case 'smartphones':
            model = phoneModels[Math.floor(Math.random() * phoneModels.length)]
            storage = storageOptions[Math.floor(Math.random() * 4)] // 64GB-512GB for phones
            priceRange = { min: 15000, max: 150000 }
            break
          case 'laptops':
            model = laptopModels[Math.floor(Math.random() * laptopModels.length)]
            storage = storageOptions[Math.floor(Math.random() * storageOptions.length)]
            priceRange = { min: 40000, max: 300000 }
            break
          case 'audio':
            model = audioModels[Math.floor(Math.random() * audioModels.length)]
            priceRange = { min: 2000, max: 50000 }
            break
          case 'accessories':
            model = accessoryModels[Math.floor(Math.random() * accessoryModels.length)]
            priceRange = { min: 500, max: 15000 }
            break
          case 'wearables':
            model = wearableModels[Math.floor(Math.random() * wearableModels.length)]
            priceRange = { min: 3000, max: 60000 }
            break
          case 'gaming':
            model = gamingModels[Math.floor(Math.random() * gamingModels.length)]
            priceRange = { min: 5000, max: 80000 }
            break
          default:
            model = phoneModels[Math.floor(Math.random() * phoneModels.length)]
            priceRange = { min: 5000, max: 50000 }
        }

        const color = colors[Math.floor(Math.random() * colors.length)]
        const price = Math.floor(Math.random() * (priceRange.max - priceRange.min)) + priceRange.min
        const comparePrice = Math.floor(price * (1.1 + Math.random() * 0.4)) // 10-50% higher

        const productName = storage ?
          `${brand} ${model} ${storage} ${color}` :
          `${brand} ${model} ${color}`

        largeProductSet.push({
          name: productName,
          category: categorySlug,
          brand,
          price,
          comparePrice,
          stock: Math.floor(Math.random() * 50) + 1
        })
      }
    })
  })

  return largeProductSet.slice(0, 1000) // Limit to 1000 products
}

async function main() {
  console.log('🚀 Starting comprehensive data seeding...')

  try {
    // Clear existing data
    await prisma.review.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.productImage.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    console.log('✅ Cleared existing data')

    // Create categories
    const createdCategories = new Map()
    for (const category of categories) {
      const created = await prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          isActive: true
        }
      })
      createdCategories.set(category.slug, created.id)
    }
    console.log(`✅ Created ${categories.length} categories`)

    // Create test users
    const createdUsers = []
    for (const user of testUsers) {
      const created = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: '$2a$10$rQv9QFz5AJzI8ZjVR8zw8eXXz5Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z', // "password123"
          role: user.role,
          status: user.status,
          isActive: user.status === UserStatus.ACTIVE
        }
      })
      createdUsers.push(created)
    }
    console.log(`✅ Created ${testUsers.length} test users`)

    // Create products with comprehensive data
    const allProducts = [...sampleProducts, ...generateLargeDataset()]
    const createdProducts = []

    for (const product of allProducts) {
      const categoryId = createdCategories.get(product.category)
      if (!categoryId) continue

      const created = await prisma.product.create({
        data: {
          name: product.name,
          description: `Premium ${product.name} with advanced features and excellent build quality. Perfect for both personal and professional use.`,
          price: product.price,
          comparePrice: product.comparePrice,
          brand: product.brand,
          categoryId,
          sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          stock: product.stock,
          features: JSON.stringify([
            'High-quality display',
            'Long battery life',
            'Fast charging',
            'Premium build quality',
            'Advanced camera system',
            'Water resistant'
          ]),
          specifications: JSON.stringify({
            warranty: '1 Year Official Warranty',
            color: 'Multiple colors available',
            weight: `${Math.floor(Math.random() * 500) + 100}g`,
            dimensions: `${Math.floor(Math.random() * 20) + 10}cm x ${Math.floor(Math.random() * 15) + 8}cm`
          }),
          isActive: true
        }
      })
      createdProducts.push(created)

      // Add product images
      const imageUrls = [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600'
      ]

      for (let i = 0; i < Math.min(3, imageUrls.length); i++) {
        await prisma.productImage.create({
          data: {
            url: imageUrls[i % imageUrls.length],
            alt: `${product.name} - Image ${i + 1}`,
            productId: created.id
          }
        })
      }
    }
    console.log(`✅ Created ${createdProducts.length} products with images`)

    // Generate reviews for products
    let totalReviews = 0
    for (const product of createdProducts.slice(0, 100)) { // Reviews for first 100 products
      const reviewCount = Math.floor(Math.random() * 10) + 1
      const reviews = generateRandomReviews(product.id, reviewCount)

      for (const review of reviews) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)]
        await prisma.review.create({
          data: {
            ...review,
            userId: randomUser.id
          }
        })
        totalReviews++
      }
    }
    console.log(`✅ Created ${totalReviews} product reviews`)

    // Generate sample orders for testing
    const orderStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    const paymentMethods = ['CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING', 'COD']

    for (let i = 0; i < 50; i++) {
      const customer = createdUsers.find(u => u.role === UserRole.CUSTOMER)
      if (!customer) continue

      const randomProducts = createdProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1)

      const totalAmount = randomProducts.reduce((sum, product) => sum + product.price, 0)

      const order = await prisma.order.create({
        data: {
          userId: customer.id,
          totalAmount,
          status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          shippingAddress: JSON.stringify({
            name: customer.name,
            phone: '+91-9876543210',
            address: '123 Test Street',
            city: 'Mysore',
            state: 'Karnataka',
            pincode: '570001'
          })
        }
      })

      // Add order items
      for (const product of randomProducts) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity: Math.floor(Math.random() * 2) + 1,
            price: product.price
          }
        })
      }
    }
    console.log('✅ Created 50 sample orders with items')

    // Generate wishlist items
    for (const user of createdUsers.filter(u => u.role === UserRole.CUSTOMER)) {
      const randomProducts = createdProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 5) + 1)

      for (const product of randomProducts) {
        await prisma.wishlist.create({
          data: {
            userId: user.id,
            productId: product.id
          }
        })
      }
    }
    console.log('✅ Created wishlist items for customers')

    console.log('🎉 Comprehensive data seeding completed successfully!')
    console.log(`
📊 Summary:
- Categories: ${categories.length}
- Products: ${createdProducts.length}
- Users: ${createdUsers.length}
- Reviews: ${totalReviews}
- Orders: 50
- Product Images: ${createdProducts.length * 2}
    `)

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })