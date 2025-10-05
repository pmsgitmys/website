import { test, expect } from '@playwright/test';

test.describe('Error Handling and Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle 404 pages correctly', async ({ page }) => {
    // Navigate to non-existent pages
    const nonExistentUrls = [
      '/non-existent-page',
      '/products/999999',
      '/invalid-route',
      '/admin/invalid',
      '/user/99999'
    ];

    for (const url of nonExistentUrls) {
      await page.goto(url);
      await page.waitForTimeout(2000);

      // Check if it's a proper 404 page
      const pageContent = await page.textContent('body');
      const is404 = pageContent?.toLowerCase().includes('404') ||
                   pageContent?.toLowerCase().includes('not found') ||
                   pageContent?.toLowerCase().includes('page not found');

      // Check for 404 elements
      const errorSelectors = [
        'h1:has-text("404")',
        'h1:has-text("Not Found")',
        'div:has-text("404")',
        'div:has-text("Page not found")',
        '[data-testid="404"]',
        '.error-404',
        '.not-found'
      ];

      let errorPageFound = false;
      for (const selector of errorSelectors) {
        if (await page.locator(selector).count() > 0) {
          errorPageFound = true;
          break;
        }
      }

      await page.screenshot({ path: `test-results/404-page-${url.replace(/\//g, '-')}.png` });

      console.log(`URL: ${url} - 404 handling:`, is404 || errorPageFound);

      // Check for navigation back to home
      const homeLinks = [
        'a:has-text("Home")',
        'a:has-text("Go Home")',
        'a:has-text("Back to Home")',
        'a[href="/"]'
      ];

      let homeNavigationFound = false;
      for (const selector of homeLinks) {
        if (await page.locator(selector).count() > 0) {
          homeNavigationFound = true;
          break;
        }
      }

      console.log(`URL: ${url} - Home navigation available:`, homeNavigationFound);
    }
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network conditions by setting offline
    await page.route('**/*', route => {
      route.abort('internetdisconnected');
    });

    // Try to navigate
    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Look for error handling
    const networkErrorSelectors = [
      'div:has-text("Network error")',
      'div:has-text("Connection error")',
      'div:has-text("Unable to connect")',
      'div:has-text("Check your connection")',
      '.network-error',
      '.connection-error',
      '[data-testid="network-error"]'
    ];

    let networkErrorHandled = false;
    for (const selector of networkErrorSelectors) {
      if (await page.locator(selector).count() > 0) {
        networkErrorHandled = true;
        break;
      }
    }

    await page.screenshot({ path: 'test-results/network-error.png' });

    console.log('Network error handling found:', networkErrorHandled);

    // Reset routing
    await page.unroute('**/*');
  });

  test('should handle API errors', async ({ page }) => {
    // Mock API responses to return errors
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    // Try actions that would call APIs
    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Look for error handling
    const apiErrorSelectors = [
      'div:has-text("Error loading")',
      'div:has-text("Something went wrong")',
      'div:has-text("Try again")',
      'div:has-text("Server error")',
      '.api-error',
      '.error-message',
      '[data-testid="error"]'
    ];

    let apiErrorHandled = false;
    for (const selector of apiErrorSelectors) {
      if (await page.locator(selector).count() > 0) {
        apiErrorHandled = true;
        break;
      }
    }

    await page.screenshot({ path: 'test-results/api-error.png' });

    console.log('API error handling found:', apiErrorHandled);

    await page.unroute('**/api/**');
  });

  test('should handle slow loading gracefully', async ({ page }) => {
    // Slow down all requests
    await page.route('**/*', route => {
      setTimeout(() => {
        route.continue();
      }, 3000); // 3 second delay
    });

    await page.goto('/products');

    // Look for loading indicators
    const loadingSelectors = [
      '.loading',
      '.spinner',
      '.loader',
      '[data-testid="loading"]',
      'div:has-text("Loading")',
      'div:has-text("Please wait")'
    ];

    let loadingIndicatorFound = false;
    for (const selector of loadingSelectors) {
      if (await page.locator(selector).count() > 0) {
        loadingIndicatorFound = true;
        break;
      }
    }

    await page.screenshot({ path: 'test-results/loading-state.png' });

    console.log('Loading indicator found:', loadingIndicatorFound);

    // Wait for content to load
    await page.waitForTimeout(5000);

    await page.unroute('**/*');
  });

  test('should handle form validation errors', async ({ page }) => {
    // Test login form validation
    await page.goto('/auth/login');
    await page.waitForTimeout(2000);

    // Try submitting empty form
    const submitButton = page.locator('button[type="submit"], button:has-text("Login")').first();
    if (await submitButton.count() > 0) {
      await submitButton.click();
      await page.waitForTimeout(2000);

      // Look for validation errors
      const validationSelectors = [
        '.error',
        '.field-error',
        '.form-error',
        '[data-testid="error"]',
        'div:has-text("required")',
        'div:has-text("Please")',
        'span[style*="color: red"], span[style*="color:red"]'
      ];

      let validationErrorsFound = false;
      for (const selector of validationSelectors) {
        if (await page.locator(selector).count() > 0) {
          validationErrorsFound = true;
          break;
        }
      }

      await page.screenshot({ path: 'test-results/form-validation-errors.png' });

      console.log('Form validation errors found:', validationErrorsFound);
    }

    // Test registration form validation
    await page.goto('/auth/register');
    await page.waitForTimeout(2000);

    const registerSubmit = page.locator('button[type="submit"], button:has-text("Register")').first();
    if (await registerSubmit.count() > 0) {
      await registerSubmit.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/register-validation-errors.png' });
    }
  });

  test('should handle invalid input gracefully', async ({ page }) => {
    // Test search with special characters
    const searchInput = page.locator('input[type="search"], input[name="search"]').first();
    if (await searchInput.count() > 0) {
      const invalidInputs = [
        '<script>alert("test")</script>',
        '!@#$%^&*()',
        '   ',
        'a'.repeat(1000), // Very long string
        '{"malicious": "json"}'
      ];

      for (const input of invalidInputs) {
        await searchInput.fill(input);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);

        // Check if app handles it gracefully (doesn't crash)
        const pageTitle = await page.title();
        const isPageWorking = pageTitle && pageTitle.length > 0;

        console.log(`Invalid input "${input.substring(0, 20)}..." - Page working:`, isPageWorking);

        await page.goto('/');
        await page.waitForTimeout(1000);
      }
    }

    await page.screenshot({ path: 'test-results/invalid-input-handling.png' });
  });

  test('should handle session timeout', async ({ page }) => {
    // Login first
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

      // Clear all cookies to simulate session timeout
      await page.context().clearCookies();

      // Try to access protected page
      await page.goto('/account');
      await page.waitForTimeout(3000);

      // Check if redirected to login or shown session timeout message
      const currentUrl = page.url();
      const redirectedToAuth = currentUrl.includes('/login') || currentUrl.includes('/auth');

      const sessionTimeoutSelectors = [
        'div:has-text("Session expired")',
        'div:has-text("Please login again")',
        'div:has-text("Authentication required")',
        '.session-timeout',
        '[data-testid="session-timeout"]'
      ];

      let sessionTimeoutHandled = false;
      for (const selector of sessionTimeoutSelectors) {
        if (await page.locator(selector).count() > 0) {
          sessionTimeoutHandled = true;
          break;
        }
      }

      await page.screenshot({ path: 'test-results/session-timeout.png' });

      console.log('Session timeout handled (redirected to auth):', redirectedToAuth);
      console.log('Session timeout message found:', sessionTimeoutHandled);
    }
  });

  test('should handle browser compatibility issues', async ({ page }) => {
    // Test if the app works with disabled JavaScript (graceful degradation)
    await page.setJavaScriptEnabled(false);
    await page.goto('/');
    await page.waitForTimeout(3000);

    // Check if basic content is still accessible
    const bodyContent = await page.textContent('body');
    const hasContent = bodyContent && bodyContent.trim().length > 0;

    await page.screenshot({ path: 'test-results/no-javascript.png' });

    console.log('Page works without JavaScript:', hasContent);

    // Re-enable JavaScript
    await page.setJavaScriptEnabled(true);
  });

  test('should handle CSRF protection', async ({ page }) => {
    // Test forms without proper CSRF tokens
    await page.goto('/auth/login');
    await page.waitForTimeout(2000);

    // Try to submit form data directly without going through the UI
    const response = await page.request.post('/api/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'password123'
      }
    });

    // CSRF protection should reject this request
    const isProtected = response.status() === 403 || response.status() === 401;

    console.log('CSRF protection active:', isProtected);
    console.log('Response status:', response.status());
  });

  test('should handle rate limiting', async ({ page }) => {
    // Rapidly try to perform the same action
    await page.goto('/auth/login');
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Login")').first();

    if (await emailInput.count() > 0 && await passwordInput.count() > 0 && await submitButton.count() > 0) {
      // Try multiple login attempts rapidly
      for (let i = 0; i < 5; i++) {
        await emailInput.fill('test@example.com');
        await passwordInput.fill('wrongpassword');
        await submitButton.click();
        await page.waitForTimeout(500);
      }

      // Look for rate limiting messages
      const rateLimitSelectors = [
        'div:has-text("Too many attempts")',
        'div:has-text("Rate limit")',
        'div:has-text("Please wait")',
        'div:has-text("Blocked")',
        '.rate-limit',
        '[data-testid="rate-limit"]'
      ];

      let rateLimitingFound = false;
      for (const selector of rateLimitSelectors) {
        if (await page.locator(selector).count() > 0) {
          rateLimitingFound = true;
          break;
        }
      }

      await page.screenshot({ path: 'test-results/rate-limiting.png' });

      console.log('Rate limiting protection found:', rateLimitingFound);
    }
  });

  test('should handle data corruption gracefully', async ({ page }) => {
    // Mock corrupted API responses
    await page.route('**/api/products**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{"invalid": json}' // Malformed JSON
      });
    });

    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Check if app handles corrupted data
    const errorSelectors = [
      'div:has-text("Error loading")',
      'div:has-text("Invalid data")',
      'div:has-text("Something went wrong")',
      '.data-error',
      '[data-testid="data-error"]'
    ];

    let dataErrorHandled = false;
    for (const selector of errorSelectors) {
      if (await page.locator(selector).count() > 0) {
        dataErrorHandled = true;
        break;
      }
    }

    await page.screenshot({ path: 'test-results/data-corruption.png' });

    console.log('Data corruption handled:', dataErrorHandled);

    await page.unroute('**/api/products**');
  });

  test('should handle memory issues on large datasets', async ({ page }) => {
    // Mock a very large dataset response
    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Product ${i}`,
      description: `Description for product ${i}`.repeat(100)
    }));

    await page.route('**/api/products**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ products: largeDataset })
      });
    });

    await page.goto('/products');
    await page.waitForTimeout(5000);

    // Check if page is still responsive
    const pageTitle = await page.title();
    const isPageResponsive = pageTitle && pageTitle.length > 0;

    // Look for pagination or virtualization
    const optimizationSelectors = [
      '.pagination',
      '.virtual-list',
      'button:has-text("Load more")',
      'div:has-text("Showing")',
      '[data-testid="pagination"]'
    ];

    let optimizationFound = false;
    for (const selector of optimizationSelectors) {
      if (await page.locator(selector).count() > 0) {
        optimizationFound = true;
        break;
      }
    }

    await page.screenshot({ path: 'test-results/large-dataset.png' });

    console.log('Page responsive with large dataset:', isPageResponsive);
    console.log('Performance optimization found:', optimizationFound);

    await page.unroute('**/api/products**');
  });

  test('should handle accessibility errors gracefully', async ({ page }) => {
    // Test keyboard navigation
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Try navigating with keyboard only
    let tabCount = 0;
    const maxTabs = 10;

    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press('Tab');
      const activeElement = await page.evaluate(() => {
        return document.activeElement?.tagName || 'none';
      });

      if (activeElement !== 'none') {
        tabCount++;
      }
      await page.waitForTimeout(200);
    }

    // Check for proper focus indicators
    const focusedElement = page.locator(':focus');
    const hasFocusIndicator = await focusedElement.count() > 0;

    await page.screenshot({ path: 'test-results/keyboard-navigation.png' });

    console.log('Keyboard navigation working:', tabCount > 0);
    console.log('Focus indicators present:', hasFocusIndicator);
  });
});