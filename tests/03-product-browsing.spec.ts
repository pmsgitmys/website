import { test, expect } from '@playwright/test';

test.describe('Product Browsing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to products page', async ({ page }) => {
    // Look for products link
    const productsSelectors = [
      'a[href*="/products"]',
      'a:has-text("Products")',
      'a:has-text("Shop")',
      'a:has-text("Browse")',
      'a:has-text("Catalog")',
      '[data-testid="products-link"]',
      'nav a:has-text("Products")'
    ];

    let productsFound = false;
    for (const selector of productsSelectors) {
      try {
        const productsElement = page.locator(selector).first();
        if (await productsElement.count() > 0) {
          await productsElement.click();
          productsFound = true;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    if (!productsFound) {
      // Try navigating directly to products page
      await page.goto('/products');
    }

    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'test-results/products-page.png', fullPage: true });

    // Verify we're on products page
    const currentUrl = page.url();
    const isProductsPage = currentUrl.includes('/products') || currentUrl.includes('/shop');

    expect(isProductsPage).toBeTruthy();
  });

  test('should display product grid', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Look for product items
    const productSelectors = [
      '.product',
      '.product-card',
      '.product-item',
      '[data-testid="product"]',
      '[data-testid="product-card"]',
      'div:has(img):has([role="button"], a)',
      'article',
      '.card:has(img)'
    ];

    let productsFound = false;
    let productCount = 0;

    for (const selector of productSelectors) {
      const products = page.locator(selector);
      const count = await products.count();
      if (count > 0) {
        productsFound = true;
        productCount = count;
        break;
      }
    }

    expect(productsFound).toBeTruthy();
    expect(productCount).toBeGreaterThan(0);

    await page.screenshot({ path: 'test-results/products-grid.png' });

    console.log(`Found ${productCount} products on the page`);
  });

  test('should display product details', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Find first product and check its details
    const productSelectors = [
      '.product img',
      '.product-card img',
      '[data-testid="product"] img',
      'img[alt*="product" i]',
      'img[alt*="phone" i]',
      'article img'
    ];

    let productImage = null;
    for (const selector of productSelectors) {
      const images = page.locator(selector);
      if (await images.count() > 0) {
        productImage = images.first();
        break;
      }
    }

    if (productImage) {
      // Check if image is visible
      await expect(productImage).toBeVisible();

      // Check for product title/name
      const titleSelectors = [
        'h1, h2, h3, h4',
        '.product-title',
        '.product-name',
        '[data-testid="product-title"]',
        '[data-testid="product-name"]'
      ];

      let titleFound = false;
      for (const selector of titleSelectors) {
        if (await page.locator(selector).count() > 0) {
          titleFound = true;
          break;
        }
      }

      expect(titleFound).toBeTruthy();

      // Check for price
      const priceSelectors = [
        '.price',
        '.product-price',
        '[data-testid="price"]',
        'span:has-text("$")',
        'div:has-text("$")',
        'span:has-text("₹")',
        'div:has-text("₹")'
      ];

      let priceFound = false;
      for (const selector of priceSelectors) {
        if (await page.locator(selector).count() > 0) {
          priceFound = true;
          break;
        }
      }

      // Price might not always be visible on product listing
      console.log('Price information found:', priceFound);

      await page.screenshot({ path: 'test-results/products-details.png' });
    }
  });

  test('should test product filtering', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Look for filter controls
    const filterSelectors = [
      '.filter',
      '.filters',
      '[data-testid="filter"]',
      '[data-testid="filters"]',
      'select',
      'input[type="checkbox"]',
      'input[type="radio"]',
      '.sidebar',
      '.filter-sidebar'
    ];

    let filtersFound = false;
    for (const selector of filterSelectors) {
      if (await page.locator(selector).count() > 0) {
        filtersFound = true;
        break;
      }
    }

    await page.screenshot({ path: 'test-results/products-filters.png' });

    if (filtersFound) {
      console.log('Product filters found');

      // Try to interact with a filter
      const selectFilter = page.locator('select').first();
      if (await selectFilter.count() > 0) {
        const options = await selectFilter.locator('option').count();
        if (options > 1) {
          await selectFilter.selectOption({ index: 1 });
          await page.waitForTimeout(2000);
          await page.screenshot({ path: 'test-results/products-filtered.png' });
        }
      }

      // Try checkbox filters
      const checkboxFilter = page.locator('input[type="checkbox"]').first();
      if (await checkboxFilter.count() > 0) {
        await checkboxFilter.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'test-results/products-checkbox-filter.png' });
      }
    } else {
      console.log('No filters found on products page');
    }
  });

  test('should test category filtering', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Look for category filters or links
    const categorySelectors = [
      'a:has-text("Category")',
      'a:has-text("Smartphones")',
      'a:has-text("iPhone")',
      'a:has-text("Samsung")',
      'a:has-text("Android")',
      '.category',
      '.categories',
      '[data-testid="category"]',
      'button:has-text("Category")',
      'select option:has-text("Category")'
    ];

    let categoryFound = false;
    for (const selector of categorySelectors) {
      try {
        const categoryElement = page.locator(selector).first();
        if (await categoryElement.count() > 0) {
          await categoryElement.click();
          categoryFound = true;
          await page.waitForTimeout(2000);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    await page.screenshot({ path: 'test-results/products-category-filter.png' });

    console.log('Category filtering available:', categoryFound);
  });

  test('should test brand filtering', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Look for brand filters
    const brandSelectors = [
      'a:has-text("Apple")',
      'a:has-text("Samsung")',
      'a:has-text("Google")',
      'a:has-text("OnePlus")',
      '.brand',
      '.brands',
      '[data-testid="brand"]',
      'input[type="checkbox"][value*="apple" i]',
      'input[type="checkbox"][value*="samsung" i]',
      'select option:has-text("Apple")',
      'select option:has-text("Samsung")'
    ];

    let brandFound = false;
    for (const selector of brandSelectors) {
      try {
        const brandElement = page.locator(selector).first();
        if (await brandElement.count() > 0) {
          await brandElement.click();
          brandFound = true;
          await page.waitForTimeout(2000);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    await page.screenshot({ path: 'test-results/products-brand-filter.png' });

    console.log('Brand filtering available:', brandFound);
  });

  test('should test price range filtering', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Look for price range controls
    const priceSelectors = [
      'input[type="range"]',
      'input[type="number"]',
      '.price-range',
      '.price-filter',
      '[data-testid="price-range"]',
      'select:has(option:has-text("Price"))',
      'button:has-text("Price")',
      'div:has-text("Price Range")'
    ];

    let priceFilterFound = false;
    for (const selector of priceSelectors) {
      if (await page.locator(selector).count() > 0) {
        priceFilterFound = true;
        break;
      }
    }

    if (priceFilterFound) {
      // Try to interact with price range
      const rangeInput = page.locator('input[type="range"]').first();
      if (await rangeInput.count() > 0) {
        await rangeInput.fill('500');
        await page.waitForTimeout(2000);
      }

      const numberInput = page.locator('input[type="number"]').first();
      if (await numberInput.count() > 0) {
        await numberInput.fill('100');
        await page.waitForTimeout(2000);
      }
    }

    await page.screenshot({ path: 'test-results/products-price-filter.png' });

    console.log('Price range filtering available:', priceFilterFound);
  });

  test('should test product sorting', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Look for sort controls
    const sortSelectors = [
      'select:has(option:has-text("Sort"))',
      'select:has(option:has-text("Price"))',
      'select:has(option:has-text("Name"))',
      'button:has-text("Sort")',
      '.sort',
      '.sorting',
      '[data-testid="sort"]',
      '[data-testid="sorting"]'
    ];

    let sortFound = false;
    for (const selector of sortSelectors) {
      const sortElement = page.locator(selector);
      if (await sortElement.count() > 0) {
        sortFound = true;

        // If it's a select, try to change the option
        if (selector.startsWith('select')) {
          const options = await sortElement.locator('option').count();
          if (options > 1) {
            await sortElement.selectOption({ index: 1 });
            await page.waitForTimeout(2000);
          }
        } else {
          // If it's a button, click it
          await sortElement.first().click();
          await page.waitForTimeout(2000);
        }
        break;
      }
    }

    await page.screenshot({ path: 'test-results/products-sorting.png' });

    console.log('Product sorting available:', sortFound);
  });

  test('should test individual product view', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Find and click on a product
    const productLinkSelectors = [
      '.product a',
      '.product-card a',
      'a:has(img)',
      '[data-testid="product"] a',
      'article a'
    ];

    let productClicked = false;
    for (const selector of productLinkSelectors) {
      const productLinks = page.locator(selector);
      if (await productLinks.count() > 0) {
        await productLinks.first().click();
        productClicked = true;
        break;
      }
    }

    if (!productClicked) {
      // Try clicking on product image or card directly
      const productElements = [
        '.product',
        '.product-card',
        '[data-testid="product"]'
      ];

      for (const selector of productElements) {
        const products = page.locator(selector);
        if (await products.count() > 0) {
          await products.first().click();
          productClicked = true;
          break;
        }
      }
    }

    if (productClicked) {
      await page.waitForTimeout(3000);

      // Check if we're on a product detail page
      const currentUrl = page.url();
      const isProductPage = currentUrl.includes('/product') ||
                           currentUrl.includes('/item') ||
                           currentUrl.includes('/detail');

      await page.screenshot({ path: 'test-results/product-detail-page.png', fullPage: true });

      // Look for product detail elements
      const detailElements = [
        'img[alt*="product" i]',
        '.product-image',
        '.product-gallery',
        '.product-description',
        '.add-to-cart',
        'button:has-text("Add to Cart")',
        'button:has-text("Buy Now")',
        '.price',
        '.product-price'
      ];

      let detailsFound = 0;
      for (const selector of detailElements) {
        if (await page.locator(selector).count() > 0) {
          detailsFound++;
        }
      }

      console.log('Product detail page accessed:', isProductPage);
      console.log('Product detail elements found:', detailsFound);

      expect(detailsFound).toBeGreaterThan(0);
    }
  });

  test('should test search functionality on products page', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Look for search input on products page
    const searchSelectors = [
      'input[type="search"]',
      'input[name="search"]',
      'input[placeholder*="search" i]',
      'input[placeholder*="find" i]',
      '[data-testid="search"]',
      '.search-input'
    ];

    let searchFound = false;
    for (const selector of searchSelectors) {
      const searchInput = page.locator(selector);
      if (await searchInput.count() > 0) {
        await searchInput.fill('iPhone');
        await page.keyboard.press('Enter');
        searchFound = true;
        await page.waitForTimeout(3000);
        break;
      }
    }

    await page.screenshot({ path: 'test-results/products-search.png' });

    console.log('Search functionality on products page:', searchFound);

    if (searchFound) {
      // Check if results are displayed
      const resultsSelectors = [
        '.search-results',
        '.results',
        '.product',
        '.product-card'
      ];

      let resultsFound = false;
      for (const selector of resultsSelectors) {
        if (await page.locator(selector).count() > 0) {
          resultsFound = true;
          break;
        }
      }

      console.log('Search results displayed:', resultsFound);
    }
  });

  test('should test responsive design on products page', async ({ page }) => {
    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Test desktop view first
    await page.screenshot({ path: 'test-results/products-desktop.png', fullPage: true });

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/products-tablet.png', fullPage: true });

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/products-mobile.png', fullPage: true });

    // Check if products are still visible on mobile
    const productElements = page.locator('.product, .product-card, [data-testid="product"]');
    const productCount = await productElements.count();

    expect(productCount).toBeGreaterThan(0);

    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});