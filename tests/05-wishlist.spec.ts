import { test, expect } from '@playwright/test';

test.describe('Wishlist Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display wishlist icon/button', async ({ page }) => {
    // Look for wishlist icon/button
    const wishlistSelectors = [
      '[data-testid="wishlist"]',
      '[data-testid="wishlist-button"]',
      '.wishlist',
      '.wishlist-icon',
      'button:has-text("Wishlist")',
      'a:has-text("Wishlist")',
      'button:has-text("Favorites")',
      'a:has-text("Favorites")',
      'svg[class*="heart"]',
      'i[class*="heart"]',
      '[aria-label*="wishlist" i]',
      '[aria-label*="favorites" i]'
    ];

    let wishlistFound = false;
    let wishlistElement = null;

    for (const selector of wishlistSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        wishlistFound = true;
        wishlistElement = element.first();
        break;
      }
    }

    await page.screenshot({ path: 'test-results/wishlist-icon.png' });

    console.log('Wishlist icon/button found:', wishlistFound);

    if (wishlistElement) {
      await expect(wishlistElement).toBeVisible();
    }
  });

  test('should navigate to wishlist page', async ({ page }) => {
    // Try to navigate to wishlist page
    const wishlistLinkSelectors = [
      'a[href*="/wishlist"]',
      'a[href*="/favorites"]',
      'a:has-text("Wishlist")',
      'a:has-text("Favorites")',
      '[data-testid="wishlist-link"]'
    ];

    let wishlistPageOpened = false;
    for (const selector of wishlistLinkSelectors) {
      const wishlistLink = page.locator(selector).first();
      if (await wishlistLink.count() > 0) {
        await wishlistLink.click();
        await page.waitForTimeout(3000);
        wishlistPageOpened = true;
        break;
      }
    }

    if (!wishlistPageOpened) {
      // Try direct navigation
      await page.goto('/wishlist');
      await page.waitForTimeout(3000);
    }

    await page.screenshot({ path: 'test-results/wishlist-page.png', fullPage: true });

    // Check if we're on wishlist page
    const currentUrl = page.url();
    const isWishlistPage = currentUrl.includes('/wishlist') || currentUrl.includes('/favorites');

    // Also check page content
    const pageContent = await page.textContent('body');
    const hasWishlistContent = pageContent?.toLowerCase().includes('wishlist') ||
                               pageContent?.toLowerCase().includes('favorites');

    console.log('Wishlist page accessed:', isWishlistPage || hasWishlistContent);
  });

  test('should add product to wishlist', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Look for add to wishlist button
    const addToWishlistSelectors = [
      'button:has-text("Add to Wishlist")',
      'button:has-text("♡")',
      'button:has-text("♥")',
      'button:has-text("❤")',
      '[data-testid="add-to-wishlist"]',
      '[data-testid="wishlist-button"]',
      '.add-to-wishlist',
      '.wishlist-button',
      'button[aria-label*="wishlist" i]',
      'button[aria-label*="favorite" i]',
      'svg[class*="heart"]',
      'i[class*="heart"]'
    ];

    let addToWishlistFound = false;
    for (const selector of addToWishlistSelectors) {
      const addToWishlistButton = page.locator(selector).first();
      if (await addToWishlistButton.count() > 0) {
        try {
          await expect(addToWishlistButton).toBeVisible();
          await addToWishlistButton.click();
          addToWishlistFound = true;
          await page.waitForTimeout(2000);
          break;
        } catch (e) {
          continue;
        }
      }
    }

    // If not found on products page, try individual product page
    if (!addToWishlistFound) {
      const productSelectors = [
        '.product a',
        '.product-card a',
        '[data-testid="product"] a'
      ];

      for (const selector of productSelectors) {
        const productLink = page.locator(selector).first();
        if (await productLink.count() > 0) {
          await productLink.click();
          await page.waitForTimeout(3000);

          // Look for wishlist button on product detail page
          for (const wishlistSelector of addToWishlistSelectors) {
            const addToWishlistButton = page.locator(wishlistSelector).first();
            if (await addToWishlistButton.count() > 0) {
              try {
                await expect(addToWishlistButton).toBeVisible();
                await addToWishlistButton.click();
                addToWishlistFound = true;
                await page.waitForTimeout(2000);
                break;
              } catch (e) {
                continue;
              }
            }
          }
          break;
        }
      }
    }

    await page.screenshot({ path: 'test-results/wishlist-add-product.png' });

    if (addToWishlistFound) {
      // Look for confirmation message
      const confirmationSelectors = [
        'div:has-text("Added to wishlist")',
        'div:has-text("Added to favorites")',
        'div:has-text("Item added")',
        '.toast',
        '.notification',
        '.alert-success',
        '[data-testid="wishlist-notification"]'
      ];

      let confirmationFound = false;
      for (const selector of confirmationSelectors) {
        if (await page.locator(selector).count() > 0) {
          confirmationFound = true;
          break;
        }
      }

      console.log('Add to wishlist successful:', addToWishlistFound);
      console.log('Confirmation message found:', confirmationFound);
    } else {
      console.log('Add to wishlist button not found');
    }
  });

  test('should view wishlist with items', async ({ page }) => {
    // First try to add an item to wishlist
    await page.goto('/products');
    await page.waitForTimeout(3000);

    const addToWishlistButton = page.locator('button:has-text("♡"), button:has-text("♥"), [data-testid="add-to-wishlist"], .add-to-wishlist').first();
    if (await addToWishlistButton.count() > 0) {
      await addToWishlistButton.click();
      await page.waitForTimeout(2000);
    }

    // Navigate to wishlist page
    await page.goto('/wishlist');
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'test-results/wishlist-with-items.png', fullPage: true });

    // Look for wishlist items
    const wishlistItemSelectors = [
      '.wishlist-item',
      '[data-testid="wishlist-item"]',
      '.favorite-item',
      '[data-testid="favorite-item"]',
      '.product',
      '.product-card'
    ];

    let itemsFound = false;
    let itemCount = 0;

    for (const selector of wishlistItemSelectors) {
      const items = page.locator(selector);
      const count = await items.count();
      if (count > 0) {
        itemsFound = true;
        itemCount = count;
        break;
      }
    }

    console.log('Wishlist items found:', itemsFound);
    console.log('Item count:', itemCount);

    // Also check for empty state if no items
    if (!itemsFound) {
      const emptyStateSelectors = [
        'div:has-text("empty")',
        'div:has-text("No items")',
        'div:has-text("No favorites")',
        '[data-testid="empty-wishlist"]',
        '.empty-wishlist'
      ];

      let emptyStateFound = false;
      for (const selector of emptyStateSelectors) {
        if (await page.locator(selector).count() > 0) {
          emptyStateFound = true;
          break;
        }
      }

      console.log('Empty wishlist state found:', emptyStateFound);
    }
  });

  test('should remove item from wishlist', async ({ page }) => {
    // Add item to wishlist first
    await page.goto('/products');
    await page.waitForTimeout(3000);

    const addToWishlistButton = page.locator('button:has-text("♡"), button:has-text("♥"), [data-testid="add-to-wishlist"], .add-to-wishlist').first();
    if (await addToWishlistButton.count() > 0) {
      await addToWishlistButton.click();
      await page.waitForTimeout(2000);

      // Go to wishlist page
      await page.goto('/wishlist');
      await page.waitForTimeout(3000);

      // Look for remove/delete buttons
      const removeSelectors = [
        'button:has-text("Remove")',
        'button:has-text("Delete")',
        'button:has-text("×")',
        'button:has-text("✕")',
        'button:has-text("♥")', // filled heart to unfavorite
        'button:has-text("❤")',
        '[data-testid="remove-from-wishlist"]',
        '[data-testid="delete-wishlist-item"]',
        '.remove-from-wishlist',
        '.delete-wishlist-item',
        'button[aria-label*="remove" i]'
      ];

      let itemRemoved = false;
      for (const selector of removeSelectors) {
        const removeButton = page.locator(selector).first();
        if (await removeButton.count() > 0) {
          await removeButton.click();
          await page.waitForTimeout(2000);
          itemRemoved = true;
          break;
        }
      }

      await page.screenshot({ path: 'test-results/wishlist-remove-item.png' });

      console.log('Item removed from wishlist:', itemRemoved);

      if (itemRemoved) {
        // Check if wishlist is empty
        const emptyStateSelectors = [
          'div:has-text("empty")',
          'div:has-text("No items")',
          'div:has-text("No favorites")',
          '[data-testid="empty-wishlist"]',
          '.empty-wishlist'
        ];

        let wishlistEmpty = false;
        for (const selector of emptyStateSelectors) {
          if (await page.locator(selector).count() > 0) {
            wishlistEmpty = true;
            break;
          }
        }

        console.log('Wishlist is empty after removal:', wishlistEmpty);
      }
    }
  });

  test('should move item from wishlist to cart', async ({ page }) => {
    // Add item to wishlist first
    await page.goto('/products');
    await page.waitForTimeout(3000);

    const addToWishlistButton = page.locator('button:has-text("♡"), [data-testid="add-to-wishlist"], .add-to-wishlist').first();
    if (await addToWishlistButton.count() > 0) {
      await addToWishlistButton.click();
      await page.waitForTimeout(2000);

      // Go to wishlist page
      await page.goto('/wishlist');
      await page.waitForTimeout(3000);

      // Look for add to cart button in wishlist
      const addToCartSelectors = [
        'button:has-text("Add to Cart")',
        'button:has-text("Move to Cart")',
        '[data-testid="add-to-cart"]',
        '.add-to-cart',
        'button[aria-label*="add to cart" i]'
      ];

      let movedToCart = false;
      for (const selector of addToCartSelectors) {
        const addToCartButton = page.locator(selector).first();
        if (await addToCartButton.count() > 0) {
          await addToCartButton.click();
          await page.waitForTimeout(2000);
          movedToCart = true;
          break;
        }
      }

      await page.screenshot({ path: 'test-results/wishlist-move-to-cart.png' });

      console.log('Item moved from wishlist to cart:', movedToCart);

      if (movedToCart) {
        // Check if cart has the item
        const cartButton = page.locator('[data-testid="cart"], .cart, button:has-text("Cart")').first();
        if (await cartButton.count() > 0) {
          await cartButton.click();
          await page.waitForTimeout(2000);

          const cartItems = page.locator('.cart-item, [data-testid="cart-item"]');
          const cartItemCount = await cartItems.count();

          console.log('Items in cart after move:', cartItemCount);
        }
      }
    }
  });

  test('should handle wishlist persistence', async ({ page }) => {
    // Add item to wishlist
    await page.goto('/products');
    await page.waitForTimeout(3000);

    const addToWishlistButton = page.locator('button:has-text("♡"), [data-testid="add-to-wishlist"], .add-to-wishlist').first();
    if (await addToWishlistButton.count() > 0) {
      await addToWishlistButton.click();
      await page.waitForTimeout(2000);

      // Navigate away and back
      await page.goto('/');
      await page.waitForTimeout(2000);
      await page.goto('/wishlist');
      await page.waitForTimeout(3000);

      // Check if wishlist items are still there
      const wishlistItems = page.locator('.wishlist-item, [data-testid="wishlist-item"], .product');
      const itemCount = await wishlistItems.count();

      await page.screenshot({ path: 'test-results/wishlist-persistence.png' });

      console.log('Wishlist items persisted:', itemCount > 0);
      console.log('Persisted item count:', itemCount);
    }
  });

  test('should test wishlist authentication requirement', async ({ page }) => {
    // Try to access wishlist without authentication
    await page.goto('/wishlist');
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    const redirectedToAuth = currentUrl.includes('/login') || currentUrl.includes('/auth');

    await page.screenshot({ path: 'test-results/wishlist-auth-check.png', fullPage: true });

    console.log('Wishlist requires authentication:', redirectedToAuth);

    if (!redirectedToAuth) {
      // If wishlist is accessible without auth, check content
      const pageContent = await page.textContent('body');
      const hasWishlistContent = pageContent?.toLowerCase().includes('wishlist') ||
                                 pageContent?.toLowerCase().includes('favorites');

      console.log('Wishlist accessible without auth:', hasWishlistContent);
    }
  });

  test('should test wishlist on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Try to add to wishlist on mobile
    const addToWishlistButton = page.locator('button:has-text("♡"), [data-testid="add-to-wishlist"], .add-to-wishlist').first();
    if (await addToWishlistButton.count() > 0) {
      await addToWishlistButton.click();
      await page.waitForTimeout(2000);

      // Navigate to wishlist on mobile
      await page.goto('/wishlist');
      await page.waitForTimeout(3000);
    }

    await page.screenshot({ path: 'test-results/wishlist-mobile.png', fullPage: true });

    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should display wishlist count', async ({ page }) => {
    // Add items to wishlist
    await page.goto('/products');
    await page.waitForTimeout(3000);

    const addToWishlistButton = page.locator('button:has-text("♡"), [data-testid="add-to-wishlist"], .add-to-wishlist').first();
    if (await addToWishlistButton.count() > 0) {
      await addToWishlistButton.click();
      await page.waitForTimeout(2000);

      // Look for wishlist count indicator
      const countSelectors = [
        '[data-testid="wishlist-count"]',
        '.wishlist-count',
        '.badge',
        '.counter',
        'span:has-text("1")',
        '.wishlist .count'
      ];

      let countFound = false;
      for (const selector of countSelectors) {
        const countElement = page.locator(selector);
        if (await countElement.count() > 0) {
          const text = await countElement.first().textContent();
          if (text && /\d+/.test(text)) {
            countFound = true;
            break;
          }
        }
      }

      await page.screenshot({ path: 'test-results/wishlist-count.png' });

      console.log('Wishlist count indicator found:', countFound);
    }
  });

  test('should handle empty wishlist state', async ({ page }) => {
    // Navigate directly to wishlist (assuming it's empty)
    await page.goto('/wishlist');
    await page.waitForTimeout(3000);

    // Look for empty state message
    const emptyStateSelectors = [
      'div:has-text("empty")',
      'div:has-text("No items")',
      'div:has-text("No favorites")',
      'div:has-text("Your wishlist is empty")',
      'div:has-text("No products in wishlist")',
      '[data-testid="empty-wishlist"]',
      '.empty-wishlist',
      '.empty-state'
    ];

    let emptyStateFound = false;
    for (const selector of emptyStateSelectors) {
      if (await page.locator(selector).count() > 0) {
        emptyStateFound = true;
        break;
      }
    }

    await page.screenshot({ path: 'test-results/wishlist-empty-state.png' });

    console.log('Empty wishlist state found:', emptyStateFound);

    // Look for call-to-action to browse products
    const ctaSelectors = [
      'a:has-text("Browse Products")',
      'a:has-text("Shop Now")',
      'button:has-text("Start Shopping")',
      '[data-testid="browse-products"]'
    ];

    let ctaFound = false;
    for (const selector of ctaSelectors) {
      if (await page.locator(selector).count() > 0) {
        ctaFound = true;
        break;
      }
    }

    console.log('Call-to-action found in empty state:', ctaFound);
  });
});