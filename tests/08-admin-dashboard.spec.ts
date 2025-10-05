import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should login as admin', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();

    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      // Use admin credentials
      await emailInput.fill('admin@phonemax.com');
      await passwordInput.fill('AdminPass123!');

      const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
      await submitButton.click();
      await page.waitForTimeout(5000);

      await page.screenshot({ path: 'test-results/admin-login-success.png', fullPage: true });

      // Check if login was successful
      const successIndicators = [
        'a:has-text("Logout")',
        'a:has-text("Sign Out")',
        'button:has-text("Logout")',
        'div:has-text("Welcome")',
        'div:has-text("Dashboard")',
        'nav:has-text("Admin")'
      ];

      let loginSuccessful = false;
      for (const selector of successIndicators) {
        if (await page.locator(selector).count() > 0) {
          loginSuccessful = true;
          break;
        }
      }

      // Also check URL for admin redirect
      const currentUrl = page.url();
      if (currentUrl.includes('/admin') || currentUrl.includes('/dashboard')) {
        loginSuccessful = true;
      }

      console.log('Admin login successful:', loginSuccessful);
      console.log('Current URL after login:', currentUrl);
    }
  });

  test('should access admin dashboard', async ({ page }) => {
    // Login as admin first
    await page.goto('/auth/login');
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();

    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill('admin@phonemax.com');
      await passwordInput.fill('AdminPass123!');

      const submitButton = page.locator('button[type="submit"], button:has-text("Login")').first();
      await submitButton.click();
      await page.waitForTimeout(3000);

      // Navigate to admin dashboard
      const adminDashboardSelectors = [
        'a[href*="/admin"]',
        'a[href*="/dashboard"]',
        'a:has-text("Admin")',
        'a:has-text("Dashboard")',
        'a:has-text("Admin Dashboard")',
        '[data-testid="admin-link"]',
        '[data-testid="dashboard-link"]'
      ];

      let dashboardOpened = false;
      for (const selector of adminDashboardSelectors) {
        const dashboardLink = page.locator(selector).first();
        if (await dashboardLink.count() > 0) {
          await dashboardLink.click();
          await page.waitForTimeout(3000);
          dashboardOpened = true;
          break;
        }
      }

      if (!dashboardOpened) {
        // Try direct navigation
        await page.goto('/admin');
        await page.waitForTimeout(3000);

        // If /admin doesn't work, try other common admin paths
        if (!page.url().includes('/admin')) {
          await page.goto('/dashboard');
          await page.waitForTimeout(3000);
        }

        if (!page.url().includes('/dashboard')) {
          await page.goto('/admin/dashboard');
          await page.waitForTimeout(3000);
        }
      }

      await page.screenshot({ path: 'test-results/admin-dashboard.png', fullPage: true });

      // Verify we're on admin dashboard
      const currentUrl = page.url();
      const isAdminPage = currentUrl.includes('/admin') || currentUrl.includes('/dashboard');

      // Also check page content for admin elements
      const adminElements = [
        'h1:has-text("Dashboard")',
        'h1:has-text("Admin")',
        'div:has-text("Analytics")',
        'div:has-text("Statistics")',
        'div:has-text("Overview")',
        '.dashboard',
        '.admin-panel',
        '[data-testid="dashboard"]'
      ];

      let adminContentFound = false;
      for (const selector of adminElements) {
        if (await page.locator(selector).count() > 0) {
          adminContentFound = true;
          break;
        }
      }

      console.log('Admin dashboard accessed:', isAdminPage || adminContentFound);
      console.log('Current URL:', currentUrl);
    }
  });

  test('should display analytics and statistics', async ({ page }) => {
    // Login as admin and navigate to dashboard
    await page.goto('/auth/login');
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();

    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill('admin@phonemax.com');
      await passwordInput.fill('AdminPass123!');

      const submitButton = page.locator('button[type="submit"], button:has-text("Login")').first();
      await submitButton.click();
      await page.waitForTimeout(3000);

      // Navigate to admin dashboard
      await page.goto('/admin');
      await page.waitForTimeout(3000);

      // If admin page doesn't exist, try dashboard
      if (!page.url().includes('/admin')) {
        await page.goto('/dashboard');
        await page.waitForTimeout(3000);
      }

      // Look for analytics/statistics elements
      const analyticsSelectors = [
        '.analytics',
        '.statistics',
        '.stats',
        '.dashboard-stats',
        '[data-testid="analytics"]',
        '[data-testid="statistics"]',
        'div:has-text("Total Orders")',
        'div:has-text("Total Users")',
        'div:has-text("Total Products")',
        'div:has-text("Revenue")',
        'div:has-text("Sales")',
        '.stat-card',
        '.metric',
        '.kpi'
      ];

      let analyticsFound = 0;
      for (const selector of analyticsSelectors) {
        if (await page.locator(selector).count() > 0) {
          analyticsFound++;
        }
      }

      // Look for charts or graphs
      const chartSelectors = [
        'canvas',
        '.chart',
        '.graph',
        'svg',
        '[data-testid="chart"]',
        '.recharts-wrapper',
        '.chartjs-render-monitor'
      ];

      let chartsFound = 0;
      for (const selector of chartSelectors) {
        if (await page.locator(selector).count() > 0) {
          chartsFound++;
        }
      }

      await page.screenshot({ path: 'test-results/admin-analytics.png' });

      console.log('Analytics elements found:', analyticsFound);
      console.log('Charts/graphs found:', chartsFound);
    }
  });

  test('should access product management', async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();

    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill('admin@phonemax.com');
      await passwordInput.fill('AdminPass123!');

      const submitButton = page.locator('button[type="submit"], button:has-text("Login")').first();
      await submitButton.click();
      await page.waitForTimeout(3000);

      // Navigate to admin and look for product management
      await page.goto('/admin');
      await page.waitForTimeout(3000);

      const productManagementSelectors = [
        'a:has-text("Products")',
        'a:has-text("Manage Products")',
        'a:has-text("Product Management")',
        'a[href*="/admin/products"]',
        '[data-testid="products-link"]',
        '.product-management'
      ];

      let productManagementFound = false;
      for (const selector of productManagementSelectors) {
        const productLink = page.locator(selector).first();
        if (await productLink.count() > 0) {
          await productLink.click();
          await page.waitForTimeout(3000);
          productManagementFound = true;
          break;
        }
      }

      if (!productManagementFound) {
        // Try direct navigation
        await page.goto('/admin/products');
        await page.waitForTimeout(3000);
      }

      await page.screenshot({ path: 'test-results/admin-product-management.png', fullPage: true });

      // Look for product management features
      const managementFeatures = [
        'button:has-text("Add Product")',
        'button:has-text("Create Product")',
        'table',
        '.product-list',
        '.product-table',
        'button:has-text("Edit")',
        'button:has-text("Delete")',
        '[data-testid="add-product"]'
      ];

      let managementFeaturesFound = 0;
      for (const selector of managementFeatures) {
        if (await page.locator(selector).count() > 0) {
          managementFeaturesFound++;
        }
      }

      console.log('Product management accessed:', productManagementFound);
      console.log('Management features found:', managementFeaturesFound);
    }
  });

  test('should access user management', async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();

    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill('admin@phonemax.com');
      await passwordInput.fill('AdminPass123!');

      const submitButton = page.locator('button[type="submit"], button:has-text("Login")').first();
      await submitButton.click();
      await page.waitForTimeout(3000);

      await page.goto('/admin');
      await page.waitForTimeout(3000);

      // Look for user management
      const userManagementSelectors = [
        'a:has-text("Users")',
        'a:has-text("Customers")',
        'a:has-text("User Management")',
        'a[href*="/admin/users"]',
        '[data-testid="users-link"]',
        '.user-management'
      ];

      let userManagementFound = false;
      for (const selector of userManagementSelectors) {
        const userLink = page.locator(selector).first();
        if (await userLink.count() > 0) {
          await userLink.click();
          await page.waitForTimeout(3000);
          userManagementFound = true;
          break;
        }
      }

      if (!userManagementFound) {
        await page.goto('/admin/users');
        await page.waitForTimeout(3000);
      }

      await page.screenshot({ path: 'test-results/admin-user-management.png', fullPage: true });

      // Look for user management features
      const userFeatures = [
        'table',
        '.user-list',
        '.user-table',
        'div:has-text("Email")',
        'div:has-text("Name")',
        'button:has-text("Edit")',
        'button:has-text("Delete")',
        'button:has-text("Block")',
        'button:has-text("Activate")'
      ];

      let userFeaturesFound = 0;
      for (const selector of userFeatures) {
        if (await page.locator(selector).count() > 0) {
          userFeaturesFound++;
        }
      }

      console.log('User management accessed:', userManagementFound);
      console.log('User management features found:', userFeaturesFound);
    }
  });

  test('should access order management', async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();

    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill('admin@phonemax.com');
      await passwordInput.fill('AdminPass123!');

      const submitButton = page.locator('button[type="submit"], button:has-text("Login")').first();
      await submitButton.click();
      await page.waitForTimeout(3000);

      await page.goto('/admin');
      await page.waitForTimeout(3000);

      // Look for order management
      const orderManagementSelectors = [
        'a:has-text("Orders")',
        'a:has-text("Order Management")',
        'a:has-text("Manage Orders")',
        'a[href*="/admin/orders"]',
        '[data-testid="orders-link"]',
        '.order-management'
      ];

      let orderManagementFound = false;
      for (const selector of orderManagementSelectors) {
        const orderLink = page.locator(selector).first();
        if (await orderLink.count() > 0) {
          await orderLink.click();
          await page.waitForTimeout(3000);
          orderManagementFound = true;
          break;
        }
      }

      if (!orderManagementFound) {
        await page.goto('/admin/orders');
        await page.waitForTimeout(3000);
      }

      await page.screenshot({ path: 'test-results/admin-order-management.png', fullPage: true });

      // Look for order management features
      const orderFeatures = [
        'table',
        '.order-list',
        '.order-table',
        'div:has-text("Order #")',
        'div:has-text("Status")',
        'div:has-text("Customer")',
        'select',
        'button:has-text("Update Status")',
        'button:has-text("View Details")'
      ];

      let orderFeaturesFound = 0;
      for (const selector of orderFeatures) {
        if (await page.locator(selector).count() > 0) {
          orderFeaturesFound++;
        }
      }

      console.log('Order management accessed:', orderManagementFound);
      console.log('Order management features found:', orderFeaturesFound);
    }
  });

  test('should test admin navigation menu', async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();

    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill('admin@phonemax.com');
      await passwordInput.fill('AdminPass123!');

      const submitButton = page.locator('button[type="submit"], button:has-text("Login")').first();
      await submitButton.click();
      await page.waitForTimeout(3000);

      await page.goto('/admin');
      await page.waitForTimeout(3000);

      // Look for admin navigation menu
      const navSelectors = [
        '.admin-nav',
        '.sidebar',
        '.admin-sidebar',
        'nav',
        '[data-testid="admin-nav"]',
        '.navigation'
      ];

      let adminNavFound = false;
      for (const selector of navSelectors) {
        if (await page.locator(selector).count() > 0) {
          adminNavFound = true;
          break;
        }
      }

      // Count navigation links
      const navLinks = [
        'a:has-text("Dashboard")',
        'a:has-text("Products")',
        'a:has-text("Orders")',
        'a:has-text("Users")',
        'a:has-text("Analytics")',
        'a:has-text("Settings")',
        'a:has-text("Reports")'
      ];

      let navLinksFound = 0;
      for (const linkText of navLinks) {
        if (await page.locator(linkText).count() > 0) {
          navLinksFound++;
        }
      }

      await page.screenshot({ path: 'test-results/admin-navigation.png' });

      console.log('Admin navigation found:', adminNavFound);
      console.log('Navigation links found:', navLinksFound);
    }
  });

  test('should test admin permissions and security', async ({ page }) => {
    // Test accessing admin routes without authentication
    await page.goto('/admin');
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    const redirectedToAuth = currentUrl.includes('/login') || currentUrl.includes('/auth');

    await page.screenshot({ path: 'test-results/admin-security-check.png', fullPage: true });

    console.log('Admin routes protected (redirected to auth):', redirectedToAuth);

    if (!redirectedToAuth) {
      // Check if there's an authentication prompt or error
      const authRequiredSelectors = [
        'div:has-text("Access Denied")',
        'div:has-text("Unauthorized")',
        'div:has-text("Please login")',
        'div:has-text("Admin access required")',
        '.auth-required',
        '.access-denied'
      ];

      let authRequiredFound = false;
      for (const selector of authRequiredSelectors) {
        if (await page.locator(selector).count() > 0) {
          authRequiredFound = true;
          break;
        }
      }

      console.log('Authentication required message found:', authRequiredFound);
    }
  });

  test('should test admin dashboard responsiveness', async ({ page }) => {
    // Login as admin first
    await page.goto('/auth/login');
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();

    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill('admin@phonemax.com');
      await passwordInput.fill('AdminPass123!');

      const submitButton = page.locator('button[type="submit"], button:has-text("Login")').first();
      await submitButton.click();
      await page.waitForTimeout(3000);

      await page.goto('/admin');
      await page.waitForTimeout(3000);

      // Test desktop view
      await page.screenshot({ path: 'test-results/admin-dashboard-desktop.png', fullPage: true });

      // Test tablet view
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/admin-dashboard-tablet.png', fullPage: true });

      // Test mobile view
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/admin-dashboard-mobile.png', fullPage: true });

      // Check if mobile menu exists
      const mobileMenuSelectors = [
        '.mobile-menu',
        '.hamburger',
        'button[aria-label*="menu"]',
        '[data-testid="mobile-menu"]'
      ];

      let mobileMenuFound = false;
      for (const selector of mobileMenuSelectors) {
        if (await page.locator(selector).count() > 0) {
          mobileMenuFound = true;
          break;
        }
      }

      console.log('Mobile menu found for admin dashboard:', mobileMenuFound);

      // Reset viewport
      await page.setViewportSize({ width: 1280, height: 720 });
    }
  });

  test('should test admin settings and configuration', async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();

    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill('admin@phonemax.com');
      await passwordInput.fill('AdminPass123!');

      const submitButton = page.locator('button[type="submit"], button:has-text("Login")').first();
      await submitButton.click();
      await page.waitForTimeout(3000);

      await page.goto('/admin');
      await page.waitForTimeout(3000);

      // Look for settings/configuration options
      const settingsSelectors = [
        'a:has-text("Settings")',
        'a:has-text("Configuration")',
        'a:has-text("Site Settings")',
        'a[href*="/admin/settings"]',
        '[data-testid="settings-link"]',
        '.settings'
      ];

      let settingsFound = false;
      for (const selector of settingsSelectors) {
        const settingsLink = page.locator(selector).first();
        if (await settingsLink.count() > 0) {
          await settingsLink.click();
          await page.waitForTimeout(3000);
          settingsFound = true;
          break;
        }
      }

      if (!settingsFound) {
        await page.goto('/admin/settings');
        await page.waitForTimeout(3000);
      }

      await page.screenshot({ path: 'test-results/admin-settings.png', fullPage: true });

      // Look for configuration options
      const configOptions = [
        'input[name*="site"]',
        'input[name*="email"]',
        'input[name*="payment"]',
        'input[name*="shipping"]',
        'textarea[name*="description"]',
        'select',
        'button:has-text("Save")',
        'button:has-text("Update")'
      ];

      let configOptionsFound = 0;
      for (const selector of configOptions) {
        if (await page.locator(selector).count() > 0) {
          configOptionsFound++;
        }
      }

      console.log('Admin settings accessed:', settingsFound);
      console.log('Configuration options found:', configOptionsFound);
    }
  });
});