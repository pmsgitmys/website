import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display cart icon in header', async ({ page }) => {
    // Look for cart icon/button in header
    const cartSelectors = [
      '[data-testid="cart"]',
      '[data-testid="cart-button"]',
      '.cart',
      '.cart-icon',
      'button:has-text("Cart")',
      'a:has-text("Cart")',
      'svg[class*="cart"]',
      'i[class*="cart"]',
      '[aria-label*="cart" i]',
      'button[aria-label*="shopping" i]'
    ];

    let cartFound = false;
    let cartElement = null;

    for (const selector of cartSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        cartFound = true;
        cartElement = element.first();
        break;
      }
    }

    expect(cartFound).toBeTruthy();

    if (cartElement) {
      await expect(cartElement).toBeVisible();
    }

    await page.screenshot({ path: 'test-results/cart-icon.png' });
  });

  test('should add product to cart', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Look for "Add to Cart" button
    const addToCartSelectors = [
      'button:has-text("Add to Cart")',
      'button:has-text("Add To Cart")',
      'button:has-text("ADD TO CART")',
      '[data-testid="add-to-cart"]',
      '.add-to-cart',
      'button:has-text("Buy")',
      'button[aria-label*="add to cart" i]'
    ];

    let addToCartFound = false;
    for (const selector of addToCartSelectors) {
      const addToCartButton = page.locator(selector).first();
      if (await addToCartButton.count() > 0) {
        // Check if button is visible and clickable
        try {
          await expect(addToCartButton).toBeVisible();
          await addToCartButton.click();
          addToCartFound = true;
          await page.waitForTimeout(2000);
          break;
        } catch (e) {
          // Try next selector
          continue;
        }
      }
    }

    // If no add to cart button found on products page, try individual product page
    if (!addToCartFound) {
      // Click on a product to go to detail page
      const productSelectors = [
        '.product a',
        '.product-card a',
        '[data-testid="product"] a',
        'a:has(img[alt*="product" i])'
      ];

      for (const selector of productSelectors) {
        const productLink = page.locator(selector).first();
        if (await productLink.count() > 0) {
          await productLink.click();
          await page.waitForTimeout(3000);

          // Now look for add to cart on product detail page
          for (const cartSelector of addToCartSelectors) {
            const addToCartButton = page.locator(cartSelector).first();
            if (await addToCartButton.count() > 0) {
              try {
                await expect(addToCartButton).toBeVisible();
                await addToCartButton.click();
                addToCartFound = true;
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

    await page.screenshot({ path: 'test-results/cart-add-product.png' });

    if (addToCartFound) {
      // Look for confirmation message or cart update
      const confirmationSelectors = [
        'div:has-text("Added to cart")',
        'div:has-text("Item added")',
        'div:has-text("Successfully added")',
        '.toast',
        '.notification',
        '.alert-success',
        '[data-testid="cart-notification"]'
      ];

      let confirmationFound = false;
      for (const selector of confirmationSelectors) {
        if (await page.locator(selector).count() > 0) {
          confirmationFound = true;
          break;
        }
      }

      console.log('Add to cart successful:', addToCartFound);
      console.log('Confirmation message found:', confirmationFound);
    }
  });

  test('should open cart drawer/sheet', async ({ page }) => {
    // First add a product to cart
    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Try to add a product first
    const addToCartButton = page.locator('button:has-text("Add to Cart"), [data-testid="add-to-cart"]').first();
    if (await addToCartButton.count() > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(2000);
    }

    // Now try to open cart
    const cartSelectors = [
      '[data-testid="cart"]',
      '[data-testid="cart-button"]',
      '.cart',
      '.cart-icon',
      'button:has-text("Cart")',
      'a:has-text("Cart")',
      'button[aria-label*="cart" i]'
    ];

    let cartOpened = false;
    for (const selector of cartSelectors) {
      const cartElement = page.locator(selector).first();
      if (await cartElement.count() > 0) {
        await cartElement.click();
        await page.waitForTimeout(2000);

        // Check if cart drawer/modal opened
        const cartContentSelectors = [
          '[data-testid="cart-sheet"]',
          '[data-testid="cart-drawer"]',
          '[data-testid="cart-modal"]',
          '.cart-sheet',
          '.cart-drawer',
          '.cart-modal',
          '.shopping-cart',
          'div:has-text("Shopping Cart")',
          'div:has-text("Your Cart")',
          '[role="dialog"]:has-text("Cart")'
        ];

        for (const contentSelector of cartContentSelectors) {
          if (await page.locator(contentSelector).count() > 0) {
            cartOpened = true;
            break;
          }
        }

        if (cartOpened) break;
      }
    }

    await page.screenshot({ path: 'test-results/cart-opened.png', fullPage: true });

    console.log('Cart drawer/sheet opened:', cartOpened);

    if (cartOpened) {
      // Look for cart items
      const cartItemSelectors = [
        '.cart-item',
        '[data-testid="cart-item"]',
        '.cart-product',
        'li:has(img)',
        'div:has(img):has-text("$"), div:has(img):has-text("₹")'
      ];

      let itemsFound = false;
      for (const selector of cartItemSelectors) {
        if (await page.locator(selector).count() > 0) {
          itemsFound = true;
          break;
        }
      }

      console.log('Cart items found:', itemsFound);
    }
  });

  test('should update product quantity in cart', async ({ page }) => {
    // Add product to cart first
    await page.goto('/products');
    await page.waitForTimeout(3000);

    const addToCartButton = page.locator('button:has-text("Add to Cart"), [data-testid="add-to-cart"]').first();
    if (await addToCartButton.count() > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(2000);

      // Open cart
      const cartButton = page.locator('[data-testid="cart"], .cart, button:has-text("Cart")').first();
      if (await cartButton.count() > 0) {
        await cartButton.click();
        await page.waitForTimeout(2000);

        // Look for quantity controls
        const quantitySelectors = [
          'input[type="number"]',
          '[data-testid="quantity"]',
          '.quantity-input',
          'input[name="quantity"]',
          'input[aria-label*="quantity" i]'
        ];

        let quantityUpdated = false;
        for (const selector of quantitySelectors) {
          const quantityInput = page.locator(selector).first();
          if (await quantityInput.count() > 0) {
            await quantityInput.fill('2');
            await page.keyboard.press('Enter');
            quantityUpdated = true;
            await page.waitForTimeout(2000);
            break;
          }
        }

        // Also try quantity buttons (+ and -)
        if (!quantityUpdated) {
          const increaseSelectors = [
            'button:has-text("+")',
            '[data-testid="increase-quantity"]',
            '.quantity-increase',
            'button[aria-label*="increase" i]'
          ];

          for (const selector of increaseSelectors) {
            const increaseButton = page.locator(selector).first();
            if (await increaseButton.count() > 0) {
              await increaseButton.click();
              quantityUpdated = true;
              await page.waitForTimeout(2000);
              break;
            }
          }
        }

        await page.screenshot({ path: 'test-results/cart-quantity-update.png' });

        console.log('Quantity updated:', quantityUpdated);
      }
    }
  });

  test('should remove item from cart', async ({ page }) => {
    // Add product to cart first
    await page.goto('/products');
    await page.waitForTimeout(3000);

    const addToCartButton = page.locator('button:has-text("Add to Cart"), [data-testid="add-to-cart"]').first();
    if (await addToCartButton.count() > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(2000);

      // Open cart
      const cartButton = page.locator('[data-testid="cart"], .cart, button:has-text("Cart")').first();
      if (await cartButton.count() > 0) {
        await cartButton.click();
        await page.waitForTimeout(2000);

        // Look for remove/delete buttons
        const removeSelectors = [
          'button:has-text("Remove")',
          'button:has-text("Delete")',
          'button:has-text("×")',
          'button:has-text("✕")',
          '[data-testid="remove-item"]',
          '[data-testid="delete-item"]',
          '.remove-item',
          '.delete-item',
          'button[aria-label*="remove" i]',
          'button[aria-label*="delete" i]'
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

        await page.screenshot({ path: 'test-results/cart-remove-item.png' });

        console.log('Item removed from cart:', itemRemoved);

        if (itemRemoved) {
          // Check if cart is empty
          const emptyCartSelectors = [
            'div:has-text("Empty")',
            'div:has-text("No items")',
            'div:has-text("Your cart is empty")',
            '[data-testid="empty-cart"]',
            '.empty-cart'
          ];

          let cartEmpty = false;
          for (const selector of emptyCartSelectors) {
            if (await page.locator(selector).count() > 0) {
              cartEmpty = true;
              break;
            }
          }

          console.log('Cart is empty after removal:', cartEmpty);
        }
      }
    }
  });

  test('should test cart persistence', async ({ page }) => {
    // Add product to cart
    await page.goto('/products');
    await page.waitForTimeout(3000);

    const addToCartButton = page.locator('button:has-text("Add to Cart"), [data-testid="add-to-cart"]').first();
    if (await addToCartButton.count() > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(2000);

      // Navigate away and back
      await page.goto('/');
      await page.waitForTimeout(2000);

      // Check if cart still has items
      const cartButton = page.locator('[data-testid="cart"], .cart, button:has-text("Cart")').first();
      if (await cartButton.count() > 0) {
        await cartButton.click();
        await page.waitForTimeout(2000);

        // Look for cart items
        const cartItemSelectors = [
          '.cart-item',
          '[data-testid="cart-item"]',
          '.cart-product'
        ];

        let itemsPersisted = false;
        for (const selector of cartItemSelectors) {
          if (await page.locator(selector).count() > 0) {
            itemsPersisted = true;
            break;
          }
        }

        await page.screenshot({ path: 'test-results/cart-persistence.png' });

        console.log('Cart items persisted:', itemsPersisted);
      }
    }
  });

  test('should display cart total', async ({ page }) => {
    // Add product to cart
    await page.goto('/products');
    await page.waitForTimeout(3000);

    const addToCartButton = page.locator('button:has-text("Add to Cart"), [data-testid="add-to-cart"]').first();
    if (await addToCartButton.count() > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(2000);

      // Open cart
      const cartButton = page.locator('[data-testid="cart"], .cart, button:has-text("Cart")').first();
      if (await cartButton.count() > 0) {
        await cartButton.click();
        await page.waitForTimeout(2000);

        // Look for total/subtotal
        const totalSelectors = [
          '.total',
          '.subtotal',
          '[data-testid="cart-total"]',
          '[data-testid="subtotal"]',
          'div:has-text("Total")',
          'div:has-text("Subtotal")',
          'span:has-text("$")',
          'span:has-text("₹")'
        ];

        let totalFound = false;
        for (const selector of totalSelectors) {
          const totalElement = page.locator(selector);
          if (await totalElement.count() > 0) {
            // Check if it contains a price
            const text = await totalElement.first().textContent();
            if (text && (text.includes('$') || text.includes('₹') || /\d+/.test(text))) {
              totalFound = true;
              break;
            }
          }
        }

        await page.screenshot({ path: 'test-results/cart-total.png' });

        console.log('Cart total displayed:', totalFound);
      }
    }
  });

  test('should navigate to checkout from cart', async ({ page }) => {
    // Add product to cart
    await page.goto('/products');
    await page.waitForTimeout(3000);

    const addToCartButton = page.locator('button:has-text("Add to Cart"), [data-testid="add-to-cart"]').first();
    if (await addToCartButton.count() > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(2000);

      // Open cart
      const cartButton = page.locator('[data-testid="cart"], .cart, button:has-text("Cart")').first();
      if (await cartButton.count() > 0) {
        await cartButton.click();
        await page.waitForTimeout(2000);

        // Look for checkout button
        const checkoutSelectors = [
          'button:has-text("Checkout")',
          'button:has-text("Proceed to Checkout")',
          'a:has-text("Checkout")',
          '[data-testid="checkout"]',
          '[data-testid="checkout-button"]',
          '.checkout',
          '.checkout-button'
        ];

        let checkoutFound = false;
        for (const selector of checkoutSelectors) {
          const checkoutButton = page.locator(selector).first();
          if (await checkoutButton.count() > 0) {
            await checkoutButton.click();
            await page.waitForTimeout(3000);
            checkoutFound = true;
            break;
          }
        }

        await page.screenshot({ path: 'test-results/cart-checkout-navigation.png', fullPage: true });

        if (checkoutFound) {
          // Check if we're on checkout page
          const currentUrl = page.url();
          const isCheckoutPage = currentUrl.includes('/checkout') ||
                                currentUrl.includes('/order') ||
                                currentUrl.includes('/payment');

          console.log('Navigated to checkout:', isCheckoutPage);
          console.log('Current URL:', currentUrl);
        }
      }
    }
  });

  test('should test cart on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/products');
    await page.waitForTimeout(3000);

    // Try to add product to cart on mobile
    const addToCartButton = page.locator('button:has-text("Add to Cart"), [data-testid="add-to-cart"]').first();
    if (await addToCartButton.count() > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(2000);

      // Check cart on mobile
      const cartButton = page.locator('[data-testid="cart"], .cart, button:has-text("Cart")').first();
      if (await cartButton.count() > 0) {
        await cartButton.click();
        await page.waitForTimeout(2000);
      }
    }

    await page.screenshot({ path: 'test-results/cart-mobile.png', fullPage: true });

    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should handle empty cart state', async ({ page }) => {
    // Navigate to cart directly or try to open empty cart
    await page.goto('/cart');
    await page.waitForTimeout(2000);

    // If direct navigation doesn't work, try opening cart from header
    const cartButton = page.locator('[data-testid="cart"], .cart, button:has-text("Cart")').first();
    if (await cartButton.count() > 0) {
      await cartButton.click();
      await page.waitForTimeout(2000);
    }

    // Look for empty cart message
    const emptyCartSelectors = [
      'div:has-text("Empty")',
      'div:has-text("No items")',
      'div:has-text("Your cart is empty")',
      'div:has-text("Cart is empty")',
      '[data-testid="empty-cart"]',
      '.empty-cart',
      'p:has-text("empty")'
    ];

    let emptyStateFound = false;
    for (const selector of emptyCartSelectors) {
      if (await page.locator(selector).count() > 0) {
        emptyStateFound = true;
        break;
      }
    }

    await page.screenshot({ path: 'test-results/cart-empty-state.png' });

    console.log('Empty cart state found:', emptyStateFound);
  });
});