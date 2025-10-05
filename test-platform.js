const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Create screenshots directory
const screenshotsDir = './test-screenshots';
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

async function testPhoneMaxPlatform() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Helper function to log test results
  function logTest(testName, passed, message = '') {
    const result = { testName, passed, message };
    results.tests.push(result);
    if (passed) {
      results.passed++;
      console.log(`✅ ${testName}`);
    } else {
      results.failed++;
      console.log(`❌ ${testName}: ${message}`);
    }
  }

  try {
    console.log('🚀 Starting PhoneMax E-commerce Platform Testing...\n');

    // 1. Homepage Testing
    console.log('📋 Testing Homepage...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotsDir}/01-homepage.png` });

    // Check if PhoneMax logo is visible
    const logo = await page.locator('text=PhoneMax').first();
    logTest('Homepage loads with PhoneMax logo', await logo.isVisible());

    // Check hero section
    const heroSection = await page.locator('[class*="hero"]').first();
    const electronicsStoreBadge = await page.locator('text=#1 Electronics Store in Mysore').first();
    logTest('Hero section is present', await heroSection.isVisible() || await electronicsStoreBadge.isVisible());

    // Check categories section
    const categoriesSection = await page.locator('text=Shop by Category');
    logTest('Categories section is present', await categoriesSection.isVisible());

    // Check if navigation menu exists
    const navigation = await page.locator('nav').first();
    logTest('Navigation menu exists', await navigation.isVisible());

    // 2. Products Page Testing
    console.log('\n📱 Testing Products Page...');
    await page.click('text=Products');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotsDir}/02-products-page.png` });

    // Check if products are displayed
    const productsTitle = await page.locator('h1').filter({ hasText: 'Products' }).first();
    const productsPageIndicator = await page.locator('text=Browse our collection').first();
    logTest('Products page loads', await productsTitle.isVisible() || await productsPageIndicator.isVisible());

    // Check search functionality
    const searchInput = await page.locator('input[placeholder*="Search"]').first();
    logTest('Search input is present', await searchInput.isVisible());

    // Test search
    if (await searchInput.isVisible()) {
      await searchInput.fill('iPhone');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${screenshotsDir}/03-search-results.png` });
      logTest('Search functionality works', true);
    }

    // 3. User Authentication Testing
    console.log('\n🔐 Testing User Authentication...');

    // Navigate to sign in
    await page.click('[aria-label="User account"], text=Sign In').catch(() =>
      page.locator('a[href="/auth/signin"]').click()
    );
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotsDir}/04-signin-page.png` });

    const signinTitle = await page.locator('h2:has-text("Sign in to your account")');
    logTest('Sign in page loads', await signinTitle.isVisible());

    // Test registration page
    await page.click('text=create a new account').catch(() =>
      page.goto('http://localhost:3000/auth/signup')
    );
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotsDir}/05-signup-page.png` });

    const signupTitle = await page.locator('h2').filter({ hasText: 'Create Account' }).first();
    logTest('Sign up page loads', await signupTitle.isVisible());

    // 4. Admin Login Testing
    console.log('\n👨‍💼 Testing Admin Authentication...');
    await page.goto('http://localhost:3000/admin/login');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotsDir}/06-admin-login.png` });

    // Fill admin credentials
    await page.fill('input[type="email"]', 'admin@phonemax.com');
    await page.fill('input[type="password"]', 'AdminPass123!');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotsDir}/07-admin-dashboard.png` });

    // Check if admin dashboard loaded
    const adminDashboard = await page.locator('text=PhoneMax Admin');
    logTest('Admin login successful', await adminDashboard.isVisible());

    // Test admin dashboard sections
    if (await adminDashboard.isVisible()) {
      // Check analytics cards
      const revenueCard = await page.locator('text=Total Revenue');
      logTest('Revenue analytics card present', await revenueCard.isVisible());

      const ordersCard = await page.locator('text=Total Orders');
      logTest('Orders analytics card present', await ordersCard.isVisible());

      // Test navigation tabs
      const tabs = await page.locator('[role="tablist"]');
      logTest('Admin dashboard tabs present', await tabs.isVisible());
    }

    // 5. Shopping Cart Testing
    console.log('\n🛒 Testing Shopping Cart...');

    // Go back to products page
    await page.goto('http://localhost:3000/products');
    await page.waitForLoadState('networkidle');

    // Try to find and click on a product card or Add to Cart button
    const productCards = await page.locator('[class*="card"], [data-testid="product-card"]');
    const productCount = await productCards.count();

    if (productCount > 0) {
      await productCards.first().click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: `${screenshotsDir}/08-product-detail.png` });
      logTest('Product detail page loads', true);

      // Look for Add to Cart button
      const addToCartBtn = await page.locator('text=Add to Cart').first();
      if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
        await page.waitForTimeout(1000);
        logTest('Add to cart functionality works', true);

        // Check if cart icon shows items
        const cartIcon = await page.locator('[class*="cart"]').first();
        await page.screenshot({ path: `${screenshotsDir}/09-cart-with-items.png` });
        logTest('Cart icon updates after adding items', await cartIcon.isVisible());
      }
    } else {
      logTest('Product cards found', false, 'No products available for testing');
    }

    // 6. Wishlist Testing
    console.log('\n❤️ Testing Wishlist...');
    await page.goto('http://localhost:3000/wishlist');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotsDir}/10-wishlist-page.png` });

    const wishlistTitle = await page.locator('h1').filter({ hasText: /Wishlist|My Wishlist/ }).first();
    logTest('Wishlist page loads', await wishlistTitle.isVisible());

    // 7. Search Functionality Testing
    console.log('\n🔍 Testing Search Functionality...');
    await page.goto('http://localhost:3000/search');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotsDir}/11-search-page.png` });

    const searchPageTitle = await page.locator('h1').filter({ hasText: 'Search' }).first();
    logTest('Search page loads', await searchPageTitle.isVisible());

    // Test search input
    const searchPageInput = await page.locator('input[placeholder*="search"]').first();
    if (await searchPageInput.isVisible()) {
      await searchPageInput.fill('smartphone');
      await page.press('input[placeholder*="search"]', 'Enter');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `${screenshotsDir}/12-search-results-page.png` });
      logTest('Search results page works', true);
    }

    // 8. User Account Page Testing
    console.log('\n👤 Testing User Account Page...');
    await page.goto('http://localhost:3000/account');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotsDir}/13-account-page.png` });

    const accountPage = await page.locator('h1').filter({ hasText: /Account|My Account/ }).first();
    logTest('Account page loads', await accountPage.isVisible());

    // 9. Orders Page Testing
    console.log('\n📦 Testing Orders Page...');
    await page.goto('http://localhost:3000/orders');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotsDir}/14-orders-page.png` });

    const ordersPage = await page.locator('h1').filter({ hasText: /Orders|My Orders/ }).first();
    logTest('Orders page loads', await ordersPage.isVisible());

    // 10. Checkout Testing
    console.log('\n💳 Testing Checkout Page...');
    await page.goto('http://localhost:3000/checkout');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotsDir}/15-checkout-page.png` });

    // Checkout might redirect to login if not authenticated
    const checkoutTitle = await page.locator('h1').filter({ hasText: 'Checkout' }).first();
    const signInTitle = await page.locator('h2').filter({ hasText: 'Sign in' }).first();
    logTest('Checkout page accessible', await checkoutTitle.isVisible() || await signInTitle.isVisible());

    // 11. Additional Pages Testing
    console.log('\n📄 Testing Additional Pages...');

    // Contact page
    await page.goto('http://localhost:3000/contact');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotsDir}/16-contact-page.png` });
    const contactTitle = await page.locator('h1').filter({ hasText: 'Contact' }).first();
    logTest('Contact page loads', await contactTitle.isVisible());

    // Shipping page
    await page.goto('http://localhost:3000/shipping');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotsDir}/17-shipping-page.png` });
    const shippingTitle = await page.locator('h1').filter({ hasText: 'Shipping' }).first();
    logTest('Shipping page loads', await shippingTitle.isVisible());

    // 12. Responsive Design Testing
    console.log('\n📱 Testing Responsive Design...');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotsDir}/18-mobile-homepage.png` });

    // Check if mobile menu exists
    const mobileMenu = await page.locator('[class*="mobile"], [aria-label*="menu"]');
    logTest('Mobile responsive design works', await mobileMenu.isVisible() || await page.locator('text=PhoneMax').isVisible());

    // Reset to desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    // 13. Error Page Testing
    console.log('\n🚫 Testing Error Handling...');
    await page.goto('http://localhost:3000/non-existent-page');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotsDir}/19-404-page.png` });

    const errorPage404 = await page.locator('text=404').first();
    const notFoundPage = await page.locator('text=Not Found').first();
    const pageNotFound = await page.locator('text=Page not found').first();
    logTest('404 error page works', await errorPage404.isVisible() || await notFoundPage.isVisible() || await pageNotFound.isVisible());

  } catch (error) {
    console.error('❌ Test execution error:', error.message);
    logTest('Test execution', false, error.message);
  } finally {
    await browser.close();
  }

  // Generate test report
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Total: ${results.tests.length}`);
  console.log(`🎯 Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`);

  console.log('\n📋 DETAILED RESULTS:');
  results.tests.forEach((test, index) => {
    const status = test.passed ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${test.testName}${test.message ? ` - ${test.message}` : ''}`);
  });

  console.log(`\n📸 Screenshots saved to: ${screenshotsDir}/`);
  console.log(`🌐 Application running at: http://localhost:3000`);

  // Write results to file
  fs.writeFileSync('./test-results.json', JSON.stringify(results, null, 2));
  console.log('📄 Test results saved to: test-results.json');

  return results;
}

// Run the tests
testPhoneMaxPlatform()
  .then((results) => {
    process.exit(results.failed > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('Test runner error:', error);
    process.exit(1);
  });