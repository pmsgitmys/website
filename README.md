# PhoneMax Electronics Store

A modern, responsive e-commerce website for PhoneMax Electronics Store in Mysore, India. Built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

### Customer Features
- **Beautiful Landing Page**: Hero section with featured products and categories
- **Product Catalog**: Advanced filtering and search functionality
- **Product Details**: Comprehensive product pages with reviews and specifications
- **Mobile-First Design**: Optimized for smartphones and tablets
- **Local Focus**: Mysore-specific features and contact information
- **Trust Signals**: Security badges, warranty information, and service guarantees

### Business Features
- **Flexible Product Management**: Add any electronics product type without schema changes
- **Dynamic Attributes**: Support for different product specifications
- **Inventory Tracking**: Real-time stock management
- **Customer Reviews**: Built-in review and rating system
- **Admin Dashboard**: Simple interface for managing products

### Technical Features
- **Modern Tech Stack**: Next.js 15, TypeScript, Prisma, SQLite
- **Component Library**: shadcn/ui for consistent design
- **Database**: Flexible schema supporting any product type
- **SEO Optimized**: Meta tags and structured data for search engines
- **Performance**: Optimized images and lazy loading

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: SQLite with Prisma ORM
- **Icons**: Lucide React
- **State Management**: Zustand (for future cart functionality)

## 📱 Pages Included

1. **Homepage** (`/`)
   - Hero section with call-to-action
   - Category showcase
   - Featured products
   - Trust badges and store information

2. **Products Listing** (`/products`)
   - Advanced filtering (category, brand, price, specifications)
   - Search functionality
   - Grid/list view toggle
   - Sorting options

3. **Product Details** (`/products/[slug]`)
   - Product images and galleries
   - Detailed specifications
   - Customer reviews
   - Related products
   - Add to cart functionality

4. **Admin Dashboard** (`/admin`)
   - Product management interface
   - Inventory tracking
   - Sales statistics
   - Quick actions

## 🗄️ Database Schema

The database is designed to be highly flexible and can accommodate any type of electronics product:

- **Products**: Main product information
- **Categories**: Hierarchical categorization
- **Brands**: Brand management
- **Attributes**: Dynamic product specifications
- **Variants**: Product variations (color, storage, etc.)
- **Inventory**: Stock tracking
- **Reviews**: Customer feedback
- **Orders**: Order management (ready for future implementation)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   The `.env.local` file is already configured for development:
   ```bash
   # Database
   DATABASE_URL="file:./dev.db"

   # NextAuth.js (optional)
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # Payment Integration (optional)
   NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key"
   RAZORPAY_KEY_SECRET="your-razorpay-secret"
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev --name init

   # Seed with sample data
   npx prisma db seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Visit Application**
   - Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## 📊 Sample Data

The database is pre-seeded with sample electronics products:

- **Smartphones**: iPhone 15 Pro, Samsung Galaxy S24 Ultra, Google Pixel 8 Pro, OnePlus 12
- **Laptops**: MacBook Pro 16-inch M3, Dell XPS 15
- **Audio**: Sony WH-1000XM5 headphones
- **Accessories**: iPhone cases and chargers

## 🏪 Store Information

**PhoneMax Electronics**
- Location: Mysore, Karnataka, India
- Specialization: Smartphones, Laptops, Audio devices, Accessories
- Features: Same-day delivery in Mysore, 7-day returns, official warranty

## 🔧 Customization

### Adding New Product Types
The system is designed for easy expansion:

1. **No Schema Changes Required**: Use the flexible attribute system
2. **Add New Categories**: Create categories in the admin panel
3. **Define Attributes**: Set up product specifications
4. **Create Products**: Add products with dynamic attributes

### Design Customization
- **Colors**: Update Tailwind config for brand colors
- **Components**: Modify shadcn/ui components in `/components/ui`
- **Layout**: Customize header and footer in `/components/layout`

## 🚦 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Deployment Platforms
- **Recommended**: Netlify (free tier supports commercial use)
- **Alternatives**: Vercel, AWS, Digital Ocean

## 📈 Future Enhancements

Ready for implementation:
- **Payment Integration**: Razorpay setup included
- **User Authentication**: NextAuth.js configured
- **Shopping Cart**: Zustand state management ready
- **Order Management**: Database schema prepared
- **Search Enhancement**: Meilisearch integration planned
- **Multi-language**: Kannada localization structure ready

## 🎯 Local Market Features

Designed specifically for the Mysore electronics market:
- **Local Delivery**: Same-day delivery in Mysore
- **Regional Pricing**: Indian Rupee formatting
- **Trust Building**: Local contact information and store details
- **Mobile-First**: Optimized for Indian mobile usage patterns
- **Payment Methods**: UPI and local payment preferences

## 📞 Support

For any questions about implementation or customization:
- Review the code documentation
- Check the Prisma schema for database structure
- Refer to Next.js and shadcn/ui documentation

## 📄 License

This project is created for PhoneMax Electronics Store, Mysore, India.

---

**Built with ❤️ for PhoneMax Electronics, Mysore** 📱💻🎧
