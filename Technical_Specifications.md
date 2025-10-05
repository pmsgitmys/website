# PhoneMax: Technical Specifications & API Definitions

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Enhanced Database Schema](#enhanced-database-schema)
3. [API Definitions](#api-definitions)
4. [State Management Architecture](#state-management-architecture)
5. [Component Architecture](#component-architecture)
6. [Security Implementation](#security-implementation)
7. [Performance Optimization](#performance-optimization)

## 1. System Architecture

### 1.1 High-Level Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   API Gateway   │    │   Microservices │
│                 │    │                 │    │                 │
│  • Web (PWA)    │◄──►│  • Rate Limiting│◄──►│  • Auth Service │
│  • Mobile       │    │  • Load Balance │    │  • Product API  │
│  • Admin Panel  │    │  • SSL/Security │    │  • Cart Service │
└─────────────────┘    └─────────────────┘    │  • Order API    │
                                              │  • Payment API  │
                                              │  • Search API   │
                                              │  • Notification │
                                              │  • Analytics    │
                                              └─────────────────┘
                                                       │
                              ┌─────────────────────────────────────┐
                              │         Data Layer              │
                              │                                     │
                              │ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
                              │ │ Primary │ │ Cache   │ │ Search  │ │
                              │ │Database │ │(Redis)  │ │(Meili)  │ │
                              │ │(SQLite/│ │         │ │         │ │
                              │ │Postgres)│ │         │ │         │ │
                              │ └─────────┘ └─────────┘ └─────────┘ │
                              └─────────────────────────────────────┘
```

### 1.2 Technology Stack

**Frontend:**
- Framework: Next.js 15 with App Router
- UI Library: Radix UI + Tailwind CSS
- State Management: Zustand + React Query
- Forms: React Hook Form + Zod validation
- PWA: Next-PWA plugin
- Testing: Jest + React Testing Library + Playwright

**Backend:**
- Runtime: Node.js with TypeScript
- Database ORM: Prisma
- Authentication: NextAuth.js + JWT
- Payment: Razorpay SDK + custom webhook handlers
- Search: MeiliSearch
- File Storage: Cloudinary
- Real-time: Socket.io for live updates

**Infrastructure:**
- Hosting: Vercel (Frontend) + Railway/DigitalOcean (Backend)
- Database: SQLite (development) → PostgreSQL (production)
- CDN: Cloudinary for media assets
- Monitoring: Sentry for error tracking
- Analytics: Mixpanel + Google Analytics 4

## 2. Enhanced Database Schema

### 2.1 Core E-Commerce Tables

```prisma
// Enhanced User Model
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  phone         String?   @unique
  name          String?
  avatar        String?
  dateOfBirth   DateTime?
  gender        Gender?
  role          UserRole  @default(CUSTOMER)
  isVerified    Boolean   @default(false)
  preferences   Json?     // Shopping preferences, language, etc.

  // Authentication
  password      String?
  emailVerified DateTime?
  accounts      Account[]
  sessions      Session[]

  // E-commerce relationships
  addresses     Address[]
  orders        Order[]
  reviews       Review[]
  wishlist      WishlistItem[]
  cart          CartItem[]
  loyaltyPoints Int       @default(0)
  referralCode  String?   @unique
  referredBy    String?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}

// Shopping Cart Model
model CartItem {
  id         String   @id @default(cuid())
  userId     String?
  sessionId  String?  // For guest users
  productId  String
  variantId  String?
  quantity   Int      @default(1)

  // Relationships
  user       User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  variant    ProductVariant? @relation(fields: [variantId], references: [id], onDelete: Cascade)

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([userId, productId, variantId])
  @@unique([sessionId, productId, variantId])
  @@map("cart_items")
}

// Wishlist Model
model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  productId String

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([userId, productId])
  @@map("wishlist_items")
}

// Enhanced Order Model
model Order {
  id               String        @id @default(cuid())
  orderNumber      String        @unique
  status           OrderStatus   @default(PENDING)

  // Customer info
  userId           String?
  user             User?         @relation(fields: [userId], references: [id])
  guestEmail       String?       // For guest checkouts

  // Pricing breakdown
  subtotal         Float
  taxAmount        Float         @default(0)
  shippingAmount   Float         @default(0)
  discountAmount   Float         @default(0)
  loyaltyDiscount  Float         @default(0)
  totalAmount      Float

  // Shipping
  shippingAddressId String?
  shippingAddress  Address?      @relation(fields: [shippingAddressId], references: [id])
  shippingMethod   String?
  deliveryDate     DateTime?
  trackingNumber   String?

  // Payment
  paymentStatus    PaymentStatus @default(PENDING)
  paymentMethod    String?
  paymentId        String?       // Razorpay payment ID
  transactionId    String?

  // Order items and fulfillment
  items            OrderItem[]
  notes            String?
  cancelReason     String?

  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  @@map("orders")
}

// Enhanced Product Model with AI features
model Product {
  id               String              @id @default(cuid())
  name             String
  slug             String              @unique
  description      String?
  shortDesc        String?
  price            Float
  comparePrice     Float?
  sku              String?             @unique

  // Enhanced product data
  specifications   Json?               // Technical specs
  features         String[]            // Key features array
  boxContents      String[]            // What's in the box
  warranty         String?             // Warranty information

  // AI & Search enhancement
  searchKeywords   String[]            // AI-generated keywords
  aiDescription    String?             // AI-generated description
  similarProducts  String[]            // Product IDs for similar items

  // Relationships
  categoryId       String
  category         Category            @relation(fields: [categoryId], references: [id])
  brandId          String?
  brand            Brand?              @relation(fields: [brandId], references: [id])

  variants         ProductVariant[]
  images           ProductImage[]
  inventory        ProductInventory?
  reviews          Review[]
  attributes       ProductAttribute[]
  cartItems        CartItem[]
  wishlistItems    WishlistItem[]
  bundleItems      BundleItem[]

  // SEO and content
  metaTitle        String?
  metaDesc         String?
  tags             String[]

  // Status and flags
  status           ProductStatus       @default(DRAFT)
  published        Boolean             @default(false)
  featured         Boolean             @default(false)
  trending         Boolean             @default(false)
  onSale           Boolean             @default(false)

  // Analytics
  viewCount        Int                 @default(0)
  purchaseCount    Int                 @default(0)

  createdAt        DateTime            @default(now())
  updatedAt        DateTime            @updatedAt

  @@map("products")
}

// Product Bundles
model ProductBundle {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  description String?
  image       String?
  bundlePrice Float
  savings     Float        // How much customer saves

  items       BundleItem[]

  published   Boolean      @default(false)
  validFrom   DateTime?
  validUntil  DateTime?

  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@map("product_bundles")
}

model BundleItem {
  id         String        @id @default(cuid())
  bundleId   String
  productId  String
  quantity   Int           @default(1)

  bundle     ProductBundle @relation(fields: [bundleId], references: [id], onDelete: Cascade)
  product    Product       @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([bundleId, productId])
  @@map("bundle_items")
}

// Loyalty Program
model LoyaltyTransaction {
  id          String            @id @default(cuid())
  userId      String
  points      Int               // Positive for earning, negative for spending
  type        LoyaltyActionType
  description String
  orderId     String?           // If related to an order

  user        User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt   DateTime          @default(now())

  @@map("loyalty_transactions")
}

// Enhanced Review System
model Review {
  id            String    @id @default(cuid())
  rating        Int       // 1-5 stars
  title         String?
  content       String?
  pros          String[]  // List of pros
  cons          String[]  // List of cons
  verified      Boolean   @default(false)
  helpful       Int       @default(0)

  productId     String
  product       Product   @relation(fields: [productId], references: [id], onDelete: Cascade)

  // Customer info
  userId        String?   // If registered user
  customerName  String
  customerEmail String?

  // Media attachments
  images        String[]  // Review images
  videos        String[]  // Review videos

  // Moderation
  approved      Boolean   @default(false)
  flagged       Boolean   @default(false)

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("reviews")
}

// Coupons and Discounts
model Coupon {
  id              String      @id @default(cuid())
  code            String      @unique
  name            String
  description     String?
  type            CouponType  // PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING
  value           Float       // Percentage or amount
  minimumAmount   Float?      // Minimum cart value
  maximumDiscount Float?      // Maximum discount amount

  // Usage limits
  usageLimit      Int?        // Total usage limit
  usageCount      Int         @default(0)
  userUsageLimit  Int?        // Per user limit

  // Validity
  validFrom       DateTime
  validUntil      DateTime

  // Conditions
  applicableCategories String[] // Category IDs
  applicableProducts   String[] // Product IDs
  firstTimeOnly        Boolean  @default(false)

  published       Boolean     @default(true)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@map("coupons")
}

// Analytics and Tracking
model UserActivity {
  id          String       @id @default(cuid())
  userId      String?
  sessionId   String?      // For guest users
  action      ActivityType
  entityType  String       // 'product', 'category', 'order', etc.
  entityId    String
  metadata    Json?        // Additional context
  userAgent   String?
  ipAddress   String?

  createdAt   DateTime     @default(now())

  @@map("user_activities")
}

// Notifications
model Notification {
  id         String           @id @default(cuid())
  userId     String?          // Null for system-wide notifications
  type       NotificationType
  title      String
  message    String
  data       Json?            // Additional payload

  read       Boolean          @default(false)
  readAt     DateTime?

  // Delivery channels
  email      Boolean          @default(false)
  sms        Boolean          @default(false)
  push       Boolean          @default(true)

  scheduledFor DateTime?
  sentAt       DateTime?

  createdAt  DateTime         @default(now())

  @@map("notifications")
}

// New Enums
enum Gender {
  MALE
  FEMALE
  OTHER
  PREFER_NOT_TO_SAY
}

enum CouponType {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_SHIPPING
}

enum LoyaltyActionType {
  PURCHASE
  REVIEW
  REFERRAL
  SIGNUP_BONUS
  BIRTHDAY_BONUS
  REDEMPTION
}

enum ActivityType {
  PAGE_VIEW
  PRODUCT_VIEW
  ADD_TO_CART
  REMOVE_FROM_CART
  ADD_TO_WISHLIST
  REMOVE_FROM_WISHLIST
  SEARCH
  PURCHASE
  REVIEW_WRITE
}

enum NotificationType {
  ORDER_UPDATE
  PROMOTION
  STOCK_ALERT
  PRICE_DROP
  REVIEW_REQUEST
  LOYALTY_REWARD
  SYSTEM
}
```

## 3. API Definitions

### 3.1 Authentication APIs

```typescript
// POST /api/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  referralCode?: string;
}

interface RegisterResponse {
  success: boolean;
  user: UserProfile;
  token: string;
  message: string;
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  success: boolean;
  user: UserProfile;
  token: string;
  expiresAt: string;
}

// POST /api/auth/social-login
interface SocialLoginRequest {
  provider: 'google' | 'facebook';
  accessToken: string;
}

// POST /api/auth/verify-otp
interface VerifyOTPRequest {
  phone: string;
  otp: string;
}
```

### 3.2 Product APIs

```typescript
// GET /api/products
interface ProductsQuery {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'popularity' | 'newest';
  page?: number;
  limit?: number;
  filters?: Record<string, string[]>;
}

interface ProductsResponse {
  products: ProductWithDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    categories: CategoryFilter[];
    brands: BrandFilter[];
    priceRange: { min: number; max: number };
    attributes: AttributeFilter[];
  };
}

// GET /api/products/[slug]
interface ProductDetailsResponse {
  product: ProductWithDetails;
  relatedProducts: ProductSummary[];
  recommendations: ProductSummary[];
  recentlyViewed: ProductSummary[];
}

// POST /api/products/[id]/reviews
interface CreateReviewRequest {
  rating: number;
  title?: string;
  content?: string;
  pros?: string[];
  cons?: string[];
  images?: string[];
}

// GET /api/search/suggestions
interface SearchSuggestionsQuery {
  q: string;
  limit?: number;
}

interface SearchSuggestionsResponse {
  products: ProductSummary[];
  categories: CategorySummary[];
  brands: BrandSummary[];
  suggestions: string[];
}
```

### 3.3 Shopping Cart APIs

```typescript
// GET /api/cart
interface CartResponse {
  items: CartItemDetails[];
  summary: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    itemCount: number;
  };
  recommendations: ProductSummary[];
}

// POST /api/cart/items
interface AddToCartRequest {
  productId: string;
  variantId?: string;
  quantity: number;
}

interface AddToCartResponse {
  success: boolean;
  item: CartItemDetails;
  cartSummary: CartSummary;
}

// PUT /api/cart/items/[id]
interface UpdateCartItemRequest {
  quantity: number;
}

// DELETE /api/cart/items/[id]
interface RemoveFromCartResponse {
  success: boolean;
  cartSummary: CartSummary;
}

// POST /api/cart/apply-coupon
interface ApplyCouponRequest {
  code: string;
}

interface ApplyCouponResponse {
  success: boolean;
  discount: number;
  cartSummary: CartSummary;
  message: string;
}
```

### 3.4 Checkout & Order APIs

```typescript
// POST /api/checkout/validate
interface CheckoutValidationRequest {
  items: CheckoutItem[];
  shippingAddressId: string;
  paymentMethod: string;
  couponCode?: string;
}

interface CheckoutValidationResponse {
  valid: boolean;
  issues: ValidationIssue[];
  summary: OrderSummary;
  availablePaymentMethods: PaymentMethod[];
}

// POST /api/orders
interface CreateOrderRequest {
  items: CheckoutItem[];
  shippingAddressId: string;
  paymentMethod: string;
  couponCode?: string;
  notes?: string;
  useGuestCheckout?: boolean;
  guestInfo?: GuestCheckoutInfo;
}

interface CreateOrderResponse {
  success: boolean;
  order: OrderDetails;
  paymentDetails: PaymentDetails;
  redirectUrl?: string; // For payment gateway redirection
}

// GET /api/orders
interface OrdersQuery {
  status?: OrderStatus;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

interface OrdersResponse {
  orders: OrderSummary[];
  pagination: PaginationInfo;
}

// GET /api/orders/[id]
interface OrderDetailsResponse {
  order: OrderDetails;
  timeline: OrderTimelineEvent[];
  canCancel: boolean;
  canReturn: boolean;
}

// PUT /api/orders/[id]/cancel
interface CancelOrderRequest {
  reason: string;
}
```

### 3.5 Payment APIs

```typescript
// POST /api/payments/razorpay/create-order
interface RazorpayOrderRequest {
  orderId: string;
  amount: number;
  currency: string;
}

interface RazorpayOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  key: string;
}

// POST /api/payments/webhook
interface PaymentWebhookRequest {
  event: string;
  payload: any;
  signature: string;
}

// GET /api/payments/methods
interface PaymentMethodsResponse {
  methods: {
    cards: boolean;
    upi: boolean;
    netBanking: boolean;
    wallets: string[];
    emi: EMIOption[];
    cod: boolean;
  };
}
```

### 3.6 User Profile & Wishlist APIs

```typescript
// GET /api/profile
interface UserProfileResponse {
  user: UserProfile;
  statistics: {
    totalOrders: number;
    totalSpent: number;
    loyaltyPoints: number;
    reviewsCount: number;
  };
}

// PUT /api/profile
interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  preferences?: UserPreferences;
}

// POST /api/addresses
interface CreateAddressRequest {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  phone?: string;
  isDefault?: boolean;
}

// GET /api/wishlist
interface WishlistResponse {
  items: WishlistItemDetails[];
  totalCount: number;
}

// POST /api/wishlist
interface AddToWishlistRequest {
  productId: string;
}

// DELETE /api/wishlist/[productId]
```

### 3.7 Admin APIs

```typescript
// GET /api/admin/dashboard
interface AdminDashboardResponse {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    conversionRate: number;
  };
  charts: {
    salesData: ChartData[];
    topProducts: ProductStats[];
    categoryPerformance: CategoryStats[];
  };
  recentOrders: OrderSummary[];
}

// GET /api/admin/products
interface AdminProductsQuery extends ProductsQuery {
  status?: ProductStatus;
  lowStock?: boolean;
}

// POST /api/admin/products
interface CreateProductRequest {
  name: string;
  categoryId: string;
  brandId?: string;
  description?: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  specifications?: Record<string, any>;
  features?: string[];
  images: ProductImageInput[];
}

// GET /api/admin/orders
interface AdminOrdersQuery extends OrdersQuery {
  customerId?: string;
  paymentStatus?: PaymentStatus;
}

// PUT /api/admin/orders/[id]/status
interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notes?: string;
  trackingNumber?: string;
}
```

## 4. State Management Architecture

### 4.1 Zustand Store Structure

```typescript
// stores/authStore.ts
interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  register: (data: RegisterRequest) => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
}

// stores/cartStore.ts
interface CartState {
  items: CartItemDetails[];
  summary: CartSummary;
  isLoading: boolean;
  addItem: (item: AddToCartRequest) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
}

// stores/productsStore.ts
interface ProductsState {
  products: ProductWithDetails[];
  filters: ProductFilters;
  pagination: PaginationInfo;
  isLoading: boolean;
  searchQuery: string;
  setFilters: (filters: Partial<ProductFilters>) => void;
  loadProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
}

// stores/wishlistStore.ts
interface WishlistState {
  items: WishlistItemDetails[];
  isLoading: boolean;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loadWishlist: () => Promise<void>;
}
```

### 4.2 React Query Integration

```typescript
// hooks/useProducts.ts
export const useProducts = (query: ProductsQuery) => {
  return useQuery({
    queryKey: ['products', query],
    queryFn: () => fetchProducts(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// hooks/useCart.ts
export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    refetchOnWindowFocus: false,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      toast.success('Item added to cart');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

// hooks/useOrders.ts
export const useOrders = (query: OrdersQuery) => {
  return useQuery({
    queryKey: ['orders', query],
    queryFn: () => fetchOrders(query),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      queryClient.invalidateQueries(['cart']);
      queryClient.invalidateQueries(['orders']);
      // Redirect to order confirmation
      router.push(`/orders/${order.id}`);
    },
  });
};
```

## 5. Component Architecture

### 5.1 Component Hierarchy

```
src/components/
├── ui/                     # Basic UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── layout/                 # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── MobileNav.tsx
├── features/              # Feature-specific components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── SocialLogin.tsx
│   ├── products/
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── ProductFilters.tsx
│   │   └── ProductSearch.tsx
│   ├── cart/
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── checkout/
│   │   ├── CheckoutForm.tsx
│   │   ├── AddressSelector.tsx
│   │   └── PaymentMethods.tsx
│   └── orders/
│       ├── OrderHistory.tsx
│       ├── OrderDetails.tsx
│       └── OrderTracking.tsx
└── common/               # Shared components
    ├── SearchBar.tsx
    ├── LoadingSpinner.tsx
    ├── ErrorBoundary.tsx
    └── InfiniteScroll.tsx
```

### 5.2 Key Component Specifications

```typescript
// components/features/products/ProductCard.tsx
interface ProductCardProps {
  product: ProductWithDetails;
  variant?: 'default' | 'compact' | 'detailed';
  showQuickAdd?: boolean;
  showCompare?: boolean;
  className?: string;
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  variant = 'default',
  showQuickAdd = true,
  showCompare = false,
  className
}) => {
  const { addToCart, isLoading } = useAddToCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Component implementation with animations, lazy loading, etc.
};

// components/features/checkout/CheckoutForm.tsx
interface CheckoutFormProps {
  initialData?: Partial<CheckoutData>;
  onSuccess: (order: OrderDetails) => void;
  onError: (error: Error) => void;
}

export const CheckoutForm: FC<CheckoutFormProps> = ({
  initialData,
  onSuccess,
  onError
}) => {
  const { cart } = useCart();
  const { createOrder } = useCreateOrder();
  const { addresses } = useAddresses();

  // Multi-step form with validation, payment integration, etc.
};
```

## 6. Security Implementation

### 6.1 Authentication Security

```typescript
// lib/auth.ts
export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Implementation with bcrypt password verification
        // Rate limiting for login attempts
        // Account lockout after failed attempts
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Custom JWT implementation
    },
    async session({ session, token }) {
      // Session customization
    },
  },
};

// middleware.ts
export default withAuth(
  function middleware(req) {
    // Route protection logic
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Authorization logic
      },
    },
  }
);
```

### 6.2 API Security

```typescript
// lib/api-security.ts
export const rateLimiter = new RateLimiter({
  tokensPerInterval: 100,
  interval: 'hour',
  uniqueTokenPerInterval: 500,
});

export const authenticateAPI = async (req: NextRequest) => {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return payload as AuthenticatedUser;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Input validation with Zod
export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().cuid(),
    quantity: z.number().min(1).max(10),
    variantId: z.string().cuid().optional(),
  })),
  shippingAddressId: z.string().cuid(),
  paymentMethod: z.enum(['razorpay', 'cod']),
  couponCode: z.string().optional(),
});
```

### 6.3 Payment Security

```typescript
// lib/payment-security.ts
export const verifyRazorpaySignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const generatedSignature = hmac.digest('hex');
  return generatedSignature === signature;
};

export const encryptSensitiveData = (data: string): string => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY!);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};
```

## 7. Performance Optimization

### 7.1 Frontend Optimization

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config) => {
    // Bundle analysis and optimization
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };
    return config;
  },
};

// Progressive image loading
export const OptimizedImage: FC<ImageProps> = ({ src, alt, ...props }) => {
  return (
    <Image
      src={src}
      alt={alt}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyydULhY5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyydULhY5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyydU..."
      quality={75}
      {...props}
    />
  );
};
```

### 7.2 Database Optimization

```typescript
// Database indexing strategy
model Product {
  // ... other fields

  @@index([published, featured])
  @@index([categoryId, published])
  @@index([price])
  @@index([createdAt])
  @@fulltext([name, description])
}

model Order {
  // ... other fields

  @@index([userId, createdAt])
  @@index([status])
  @@index([orderNumber])
}

// Query optimization
export const getProductsOptimized = async (query: ProductsQuery) => {
  const { category, brand, minPrice, maxPrice, search, page = 1, limit = 20 } = query;

  // Use database-level pagination and filtering
  const products = await prisma.product.findMany({
    where: {
      published: true,
      ...(category && { category: { slug: category } }),
      ...(brand && { brand: { slug: brand } }),
      ...(minPrice || maxPrice) && {
        price: {
          ...(minPrice && { gte: minPrice }),
          ...(maxPrice && { lte: maxPrice }),
        },
      },
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { searchKeywords: { hasSome: [search] } },
        ],
      }),
    },
    include: {
      brand: { select: { name: true, slug: true } },
      category: { select: { name: true, slug: true } },
      images: { take: 1, orderBy: { position: 'asc' } },
      inventory: { select: { quantity: true } },
      reviews: { select: { rating: true } },
      _count: { select: { reviews: true } },
    },
    orderBy: getOrderBy(query.sort),
    skip: (page - 1) * limit,
    take: limit,
  });

  return products;
};
```

### 7.3 Caching Strategy

```typescript
// lib/cache.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cache = {
  get: async <T>(key: string): Promise<T | null> => {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },

  set: async <T>(key: string, value: T, ttl: number = 3600): Promise<void> => {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  del: async (key: string): Promise<void> => {
    await redis.del(key);
  },

  invalidatePattern: async (pattern: string): Promise<void> => {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },
};

// API route with caching
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cacheKey = `products:${searchParams.toString()}`;

  // Try cache first
  let products = await cache.get(cacheKey);

  if (!products) {
    // Fetch from database
    products = await getProductsOptimized(Object.fromEntries(searchParams));

    // Cache for 5 minutes
    await cache.set(cacheKey, products, 300);
  }

  return NextResponse.json(products);
}
```

This comprehensive technical specification provides the foundation for implementing all the advanced features outlined in the requirements document, ensuring scalability, security, and optimal performance for the PhoneMax e-commerce platform.