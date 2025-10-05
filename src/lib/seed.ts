import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  {
    id: 'cat-smartphones',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Latest smartphones and mobile phones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
  },
  {
    id: 'cat-laptops',
    name: 'Laptops',
    slug: 'laptops',
    description: 'High-performance laptops and notebooks',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
  },
  {
    id: 'cat-audio',
    name: 'Audio',
    slug: 'audio',
    description: 'Headphones, earbuds, and speakers',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Mobile accessories and gadgets',
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400',
  },
]

const products = [
  // Smartphones
  {
    id: 'prod-iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    description: 'The most advanced iPhone ever with titanium design and powerful A17 Pro chip.',
    price: 134900,
    comparePrice: 139900,
    brand: 'Apple',
    categoryId: 'cat-smartphones',
    sku: 'IPH15PM256',
    stock: 25,
    features: [
      'A17 Pro chip with 6-core GPU',
      '48MP Main camera with 2x Telephoto',
      'Titanium design',
      'Action Button',
      'USB-C connectivity'
    ],
    specifications: {
      display: '6.7" Super Retina XDR',
      storage: '256GB',
      camera: '48MP + 12MP + 12MP',
      battery: 'Up to 29 hours video playback',
      os: 'iOS 17'
    }
  },
  {
    id: 'prod-samsung-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Ultimate Android flagship with S Pen and advanced AI features.',
    price: 129999,
    comparePrice: 134999,
    brand: 'Samsung',
    categoryId: 'cat-smartphones',
    sku: 'SGS24U256',
    stock: 20,
    features: [
      'Snapdragon 8 Gen 3 processor',
      '200MP main camera',
      'Built-in S Pen',
      'Galaxy AI features',
      '5000mAh battery'
    ],
    specifications: {
      display: '6.8" Dynamic AMOLED 2X',
      storage: '256GB',
      camera: '200MP + 50MP + 12MP + 10MP',
      battery: '5000mAh',
      os: 'Android 14'
    }
  },
  {
    id: 'prod-oneplus-12',
    name: 'OnePlus 12',
    description: 'Flagship killer with exceptional performance and camera quality.',
    price: 64999,
    comparePrice: 69999,
    brand: 'OnePlus',
    categoryId: 'cat-smartphones',
    sku: 'OP12256',
    stock: 15,
    features: [
      'Snapdragon 8 Gen 3',
      'Hasselblad Camera System',
      '100W SUPERVOOC fast charging',
      'OxygenOS 14',
      '120Hz LTPO AMOLED display'
    ],
    specifications: {
      display: '6.82" LTPO AMOLED',
      storage: '256GB',
      camera: '50MP + 64MP + 48MP',
      battery: '5400mAh',
      os: 'OxygenOS 14'
    }
  },

  // Laptops
  {
    id: 'prod-macbook-air-m2',
    name: 'MacBook Air M2',
    description: 'Supercharged by M2 chip. Incredibly portable and powerful.',
    price: 114900,
    comparePrice: 119900,
    brand: 'Apple',
    categoryId: 'cat-laptops',
    sku: 'MBA13M2256',
    stock: 12,
    features: [
      'Apple M2 chip',
      '13.6" Liquid Retina display',
      'Up to 18 hours battery life',
      'MagSafe charging',
      '1080p FaceTime HD camera'
    ],
    specifications: {
      processor: 'Apple M2',
      memory: '8GB unified memory',
      storage: '256GB SSD',
      display: '13.6" Liquid Retina',
      weight: '1.24 kg'
    }
  },
  {
    id: 'prod-dell-xps-13',
    name: 'Dell XPS 13',
    description: 'Premium ultrabook with stunning InfinityEdge display.',
    price: 89999,
    comparePrice: 94999,
    brand: 'Dell',
    categoryId: 'cat-laptops',
    sku: 'DXPS13i7512',
    stock: 8,
    features: [
      '12th Gen Intel Core i7',
      '13.4" FHD+ InfinityEdge display',
      '16GB LPDDR5 RAM',
      '512GB PCIe NVMe SSD',
      'Windows 11 Pro'
    ],
    specifications: {
      processor: 'Intel Core i7-1250U',
      memory: '16GB LPDDR5',
      storage: '512GB SSD',
      display: '13.4" FHD+',
      weight: '1.17 kg'
    }
  },

  // Audio
  {
    id: 'prod-airpods-pro-2',
    name: 'AirPods Pro (2nd Gen)',
    description: 'Active Noise Cancellation with Adaptive Transparency.',
    price: 24900,
    comparePrice: 26900,
    brand: 'Apple',
    categoryId: 'cat-audio',
    sku: 'APP2GEN',
    stock: 30,
    features: [
      'Active Noise Cancellation',
      'Adaptive Transparency',
      'H2 chip for enhanced audio',
      'Up to 6 hours listening time',
      'MagSafe charging case'
    ],
    specifications: {
      driver: 'Custom high-excursion driver',
      battery: '6 hrs (30 hrs with case)',
      connectivity: 'Bluetooth 5.3',
      features: 'ANC, Spatial Audio',
      charging: 'Lightning, MagSafe, Qi'
    }
  },
  {
    id: 'prod-sony-wh-1000xm5',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancellation with exceptional sound quality.',
    price: 29990,
    comparePrice: 32990,
    brand: 'Sony',
    categoryId: 'cat-audio',
    sku: 'SWXM5',
    stock: 18,
    features: [
      'Industry-leading noise cancellation',
      '30-hour battery life',
      'Quick Charge (3 min for 3 hours)',
      'Multipoint connection',
      'Speak-to-chat technology'
    ],
    specifications: {
      driver: '30mm driver unit',
      battery: '30 hours',
      connectivity: 'Bluetooth 5.2',
      weight: '250g',
      charging: 'USB-C'
    }
  },

  // Accessories
  {
    id: 'prod-anker-powerbank',
    name: 'Anker PowerCore 10000mAh',
    description: 'Compact and high-speed charging power bank.',
    price: 2499,
    comparePrice: 2999,
    brand: 'Anker',
    categoryId: 'cat-accessories',
    sku: 'ANKPB10K',
    stock: 50,
    features: [
      '10000mAh capacity',
      'PowerIQ fast charging',
      'Compact design',
      'Multi-device charging',
      '18-month warranty'
    ],
    specifications: {
      capacity: '10000mAh',
      input: '5V/2A (Micro USB)',
      output: '5V/2.4A (USB-A)',
      weight: '180g',
      dimensions: '92 x 60 x 22mm'
    }
  }
]

const productImages = [
  // iPhone 15 Pro Max
  { productId: 'prod-iphone-15-pro-max', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', alt: 'iPhone 15 Pro Max' },
  { productId: 'prod-iphone-15-pro-max', url: 'https://images.unsplash.com/photo-1695048133313-e1bbaed1df21?w=600', alt: 'iPhone 15 Pro Max Side' },

  // Samsung S24 Ultra
  { productId: 'prod-samsung-s24-ultra', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600', alt: 'Samsung Galaxy S24 Ultra' },
  { productId: 'prod-samsung-s24-ultra', url: 'https://images.unsplash.com/photo-1596742578443-7682ef5251cd?w=600', alt: 'Samsung Galaxy S24 Ultra Back' },

  // OnePlus 12
  { productId: 'prod-oneplus-12', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600', alt: 'OnePlus 12' },

  // MacBook Air M2
  { productId: 'prod-macbook-air-m2', url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600', alt: 'MacBook Air M2' },
  { productId: 'prod-macbook-air-m2', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', alt: 'MacBook Air M2 Side' },

  // Dell XPS 13
  { productId: 'prod-dell-xps-13', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600', alt: 'Dell XPS 13' },

  // AirPods Pro 2
  { productId: 'prod-airpods-pro-2', url: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600', alt: 'AirPods Pro 2nd Gen' },

  // Sony WH-1000XM5
  { productId: 'prod-sony-wh-1000xm5', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', alt: 'Sony WH-1000XM5' },
  { productId: 'prod-sony-wh-1000xm5', url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600', alt: 'Sony WH-1000XM5 Side' },

  // Anker PowerBank
  { productId: 'prod-anker-powerbank', url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600', alt: 'Anker PowerCore 10000mAh' }
]

async function main() {
  try {
    // Clear existing data
    await prisma.productImage.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()

    // Seed categories
    console.log('Seeding categories...')
    for (const category of categories) {
      await prisma.category.create({
        data: category
      })
    }

    // Seed products
    console.log('Seeding products...')
    for (const product of products) {
      await prisma.product.create({
        data: product
      })
    }

    // Seed product images
    console.log('Seeding product images...')
    for (const image of productImages) {
      await prisma.productImage.create({
        data: image
      })
    }

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}

export { main as seedDatabase }