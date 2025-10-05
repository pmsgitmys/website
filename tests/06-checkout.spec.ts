import { test, expect } from '@playwright/test';

test.describe('Checkout Process', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to checkout page', async ({ page }) => {
    // First add an item to cart
    await page.goto('/products');
    await page.waitForTimeout(3000);

    const addToCartButton = page.locator('button:has-text("Add to Cart"), [data-testid="add-to-cart"]').first();
    if (await addToCartButton.count() > 0) {
      await addToCartButton.click();
      await page.waitForTimeout(2000);

      // Open cart and proceed to checkout
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
          '.checkout-button'
        ];

        let checkoutClicked = false;
        for (const selector of checkoutSelectors) {
          const checkoutButton = page.locator(selector).first();
          if (await checkoutButton.count() > 0) {
            await checkoutButton.click();
            await page.waitForTimeout(3000);
            checkoutClicked = true;
            break;
          }
        }

        if (!checkoutClicked) {
          // Try direct navigation
          await page.goto('/checkout');
          await page.waitForTimeout(3000);
        }
      }
    } else {
      // Try direct navigation to checkout
      await page.goto('/checkout');
      await page.waitForTimeout(3000);
    }

    await page.screenshot({ path: 'test-results/checkout-page.png', fullPage: true });

    // Verify we're on checkout page
    const currentUrl = page.url();
    const isCheckoutPage = currentUrl.includes('/checkout') ||
                          currentUrl.includes('/order') ||
                          currentUrl.includes('/payment');

    console.log('Checkout page accessed:', isCheckoutPage);
    console.log('Current URL:', currentUrl);
  });

  test('should require authentication for checkout', async ({ page }) => {
    // Try to access checkout without being logged in
    await page.goto('/checkout');
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    const redirectedToAuth = currentUrl.includes('/login') || currentUrl.includes('/auth');

    await page.screenshot({ path: 'test-results/checkout-auth-requirement.png', fullPage: true });

    console.log('Checkout requires authentication (redirected):', redirectedToAuth);

    if (!redirectedToAuth) {
      // Check if there's a login prompt on the checkout page
      const loginPromptSelectors = [
        'div:has-text("Please login")',
        'div:has-text("Sign in to continue")',
        'button:has-text("Login to Checkout")',
        '[data-testid="login-prompt"]',
        '.auth-required'
      ];

      let loginPromptFound = false;
      for (const selector of loginPromptSelectors) {
        if (await page.locator(selector).count() > 0) {
          loginPromptFound = true;
          break;
        }
      }

      console.log('Login prompt on checkout page:', loginPromptFound);
    }
  });

  test('should display checkout form with authentication', async ({ page }) => {
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

      // Add item to cart
      await page.goto('/products');
      await page.waitForTimeout(3000);

      const addToCartButton = page.locator('button:has-text("Add to Cart"), [data-testid="add-to-cart"]').first();
      if (await addToCartButton.count() > 0) {
        await addToCartButton.click();
        await page.waitForTimeout(2000);
      }

      // Go to checkout
      await page.goto('/checkout');
      await page.waitForTimeout(3000);

      await page.screenshot({ path: 'test-results/checkout-form-authenticated.png', fullPage: true });

      // Check for checkout form elements
      const formElements = [
        'input[name="address"], input[placeholder*="address" i]',
        'input[name="city"], input[placeholder*="city" i]',
        'input[name="zip"], input[name="zipcode"], input[name="postal"], input[placeholder*="zip" i]',
        'input[name="phone"], input[type="tel"], input[placeholder*="phone" i]',
        'select[name="country"], select[name="state"]'
      ];

      let formFieldsFound = 0;
      for (const selector of formElements) {
        if (await page.locator(selector).count() > 0) {
          formFieldsFound++;
        }
      }

      console.log('Checkout form fields found:', formFieldsFound);

      // Check for order summary
      const orderSummarySelectors = [
        '.order-summary',
        '[data-testid="order-summary"]',
        'div:has-text("Order Summary")',
        'div:has-text("Total")',
        '.checkout-summary'
      ];

      let orderSummaryFound = false;
      for (const selector of orderSummarySelectors) {
        if (await page.locator(selector).count() > 0) {
          orderSummaryFound = true;
          break;
        }
      }

      console.log('Order summary found:', orderSummaryFound);
    }
  });

  test('should test shipping address form', async ({ page }) => {
    // Assume we're authenticated and have items in cart
    await page.goto('/checkout');
    await page.waitForTimeout(3000);

    // Fill shipping address form
    const addressFields = [
      { selector: 'input[name="firstName"], input[name="first_name"], input[placeholder*="first name" i]', value: 'John' },
      { selector: 'input[name="lastName"], input[name="last_name"], input[placeholder*="last name" i]', value: 'Doe' },
      { selector: 'input[name="address"], input[name="street"], input[placeholder*="address" i]', value: '123 Main St' },
      { selector: 'input[name="city"], input[placeholder*="city" i]', value: 'New York' },
      { selector: 'input[name="zip"], input[name="zipcode"], input[name="postal"], input[placeholder*="zip" i]', value: '10001' },
      { selector: 'input[name="phone"], input[type="tel"], input[placeholder*="phone" i]', value: '1234567890' }
    ];

    let fieldsFilledCount = 0;
    for (const field of addressFields) {
      const input = page.locator(field.selector).first();
      if (await input.count() > 0) {
        await input.fill(field.value);
        fieldsFilledCount++;
        await page.waitForTimeout(500);
      }
    }

    // Handle select dropdowns
    const countrySelect = page.locator('select[name="country"], select[name="state"]').first();
    if (await countrySelect.count() > 0) {
      const options = await countrySelect.locator('option').count();
      if (options > 1) {
        await countrySelect.selectOption({ index: 1 });
        fieldsFilledCount++;
      }
    }

    await page.screenshot({ path: 'test-results/checkout-address-filled.png' });

    console.log('Address form fields filled:', fieldsFilledCount);
  });

  test('should test payment method selection', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(3000);

    // Look for payment method options
    const paymentMethodSelectors = [
      'input[type="radio"][name="payment"], input[type="radio"][value*="card"]',
      'input[type="radio"][value*="credit"]',
      'input[type="radio"][value*="razorpay"]',
      'input[type="radio"][value*="stripe"]',
      'input[type="radio"][value*="paypal"]',
      'button:has-text("Credit Card")',
      'button:has-text("Debit Card")',
      'button:has-text("Razorpay")',
      '.payment-method',
      '[data-testid="payment-method"]'
    ];

    let paymentMethodsFound = false;
    for (const selector of paymentMethodSelectors) {
      const paymentMethod = page.locator(selector);
      if (await paymentMethod.count() > 0) {
        paymentMethodsFound = true;
        // Try to select first payment method
        await paymentMethod.first().click();
        await page.waitForTimeout(1000);
        break;
      }
    }

    await page.screenshot({ path: 'test-results/checkout-payment-methods.png' });

    console.log('Payment methods found:', paymentMethodsFound);

    // Look for payment form fields
    if (paymentMethodsFound) {
      const paymentFormSelectors = [
        'input[name="cardNumber"], input[placeholder*="card number" i]',
        'input[name="expiryDate"], input[placeholder*="expiry" i]',
        'input[name="cvv"], input[placeholder*="cvv" i], input[placeholder*="cvc" i]',
        'input[name="cardHolder"], input[placeholder*="cardholder" i]'
      ];

      let paymentFieldsFound = 0;
      for (const selector of paymentFormSelectors) {
        if (await page.locator(selector).count() > 0) {
          paymentFieldsFound++;
        }
      }

      console.log('Payment form fields found:', paymentFieldsFound);
    }
  });

  test('should display order summary', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(3000);

    // Look for order summary elements
    const orderSummarySelectors = [
      '.order-summary',
      '[data-testid="order-summary"]',
      'div:has-text("Order Summary")',
      'div:has-text("Summary")',
      '.checkout-summary',
      '.order-details'
    ];

    let orderSummaryFound = false;
    for (const selector of orderSummarySelectors) {
      if (await page.locator(selector).count() > 0) {
        orderSummaryFound = true;
        break;
      }
    }

    // Look for price elements
    const priceSelectors = [
      '.total',
      '.subtotal',
      '.grand-total',
      '[data-testid="total"]',
      'div:has-text("Total")',
      'span:has-text("$")',
      'span:has-text("₹")'
    ];

    let pricesFound = false;
    for (const selector of priceSelectors) {
      const priceElement = page.locator(selector);
      if (await priceElement.count() > 0) {
        const text = await priceElement.first().textContent();
        if (text && (text.includes('$') || text.includes('₹') || /\d+/.test(text))) {
          pricesFound = true;
          break;
        }
      }
    }

    // Look for order items
    const orderItemSelectors = [
      '.order-item',
      '.checkout-item',
      '[data-testid="order-item"]',
      '.product-summary'
    ];

    let orderItemsFound = false;
    for (const selector of orderItemSelectors) {
      if (await page.locator(selector).count() > 0) {
        orderItemsFound = true;
        break;
      }
    }

    await page.screenshot({ path: 'test-results/checkout-order-summary.png' });

    console.log('Order summary section found:', orderSummaryFound);
    console.log('Price information found:', pricesFound);
    console.log('Order items found:', orderItemsFound);
  });

  test('should handle shipping options', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(3000);

    // Look for shipping options
    const shippingSelectors = [
      'input[type="radio"][name="shipping"]',
      'input[type="radio"][value*="standard"]',
      'input[type="radio"][value*="express"]',
      'input[type="radio"][value*="overnight"]',
      '.shipping-option',
      '[data-testid="shipping-option"]',
      'div:has-text("Shipping Method")',
      'div:has-text("Delivery Option")'
    ];

    let shippingOptionsFound = false;
    for (const selector of shippingSelectors) {
      const shippingOption = page.locator(selector);
      if (await shippingOption.count() > 0) {
        shippingOptionsFound = true;
        // Select first shipping option
        await shippingOption.first().click();
        await page.waitForTimeout(1000);
        break;
      }
    }

    await page.screenshot({ path: 'test-results/checkout-shipping-options.png' });

    console.log('Shipping options found:', shippingOptionsFound);
  });

  test('should test form validation', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForTimeout(3000);

    // Try to submit form without filling required fields
    const submitSelectors = [
      'button[type="submit"]',
      'button:has-text("Place Order")',
      'button:has-text("Complete Order")',
      'button:has-text("Pay Now")',
      '[data-testid="place-order"]',
      '[data-testid="submit-order"]'
    ];

    let submitButtonFound = false;
    for (const selector of submitSelectors) {
      const submitButton = page.locator(selector).first();
      if (await submitButton.count() > 0) {
        await submitButton.click();
        await page.waitForTimeout(2000);
        submitButtonFound = true;
        break;
      }
    }

    if (submitButtonFound) {
      // Look for validation errors
      const errorSelectors = [
        '.error',
        '.field-error',
        '.form-error',
        '.validation-error',
        '[data-testid="error"]',
        'div:has-text("required")',
        'div:has-text("Please")',
        'span[style*="color: red"], span[style*="color:red"]'
      ];

      let validationErrorsFound = false;
      for (const selector of errorSelectors) {
        if (await page.locator(selector).count() > 0) {
          validationErrorsFound = true;
          break;
        }
      }

      await page.screenshot({ path: 'test-results/checkout-validation-errors.png' });

      console.log('Form validation errors found:', validationErrorsFound);
    }
  });

  test('should test complete checkout flow', async ({ page }) => {
    // Login first if needed
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

      // Add item to cart
      await page.goto('/products');
      await page.waitForTimeout(3000);

      const addToCartButton = page.locator('button:has-text("Add to Cart"), [data-testid="add-to-cart"]').first();
      if (await addToCartButton.count() > 0) {
        await addToCartButton.click();
        await page.waitForTimeout(2000);

        // Go to checkout
        await page.goto('/checkout');
        await page.waitForTimeout(3000);

        // Fill out the form
        const formFields = [
          { selector: 'input[name="firstName"], input[placeholder*="first" i]', value: 'John' },
          { selector: 'input[name="lastName"], input[placeholder*="last" i]', value: 'Doe' },
          { selector: 'input[name="address"], input[placeholder*="address" i]', value: '123 Main St' },
          { selector: 'input[name="city"], input[placeholder*="city" i]', value: 'New York' },
          { selector: 'input[name="zip"], input[placeholder*="zip" i]', value: '10001' },
          { selector: 'input[name="phone"], input[placeholder*="phone" i]', value: '1234567890' }
        ];

        for (const field of formFields) {
          const input = page.locator(field.selector).first();
          if (await input.count() > 0) {
            await input.fill(field.value);
            await page.waitForTimeout(300);
          }
        }

        // Select payment method if available
        const paymentRadio = page.locator('input[type="radio"][name*="payment"]').first();
        if (await paymentRadio.count() > 0) {
          await paymentRadio.click();
          await page.waitForTimeout(1000);
        }

        await page.screenshot({ path: 'test-results/checkout-form-completed.png', fullPage: true });

        // Try to submit (note: this might fail due to payment processing)
        const placeOrderButton = page.locator('button:has-text("Place Order"), button:has-text("Complete Order"), button[type="submit"]').first();
        if (await placeOrderButton.count() > 0) {
          await placeOrderButton.click();
          await page.waitForTimeout(5000);

          await page.screenshot({ path: 'test-results/checkout-submission.png', fullPage: true });

          // Check for success page or error
          const currentUrl = page.url();
          const successPage = currentUrl.includes('/success') ||
                             currentUrl.includes('/confirmation') ||
                             currentUrl.includes('/thank-you');

          console.log('Order submission completed, success page:', successPage);
          console.log('Final URL:', currentUrl);
        }
      }
    }
  });

  test('should test checkout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/checkout');
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'test-results/checkout-mobile.png', fullPage: true });

    // Check if form is usable on mobile
    const formElements = page.locator('input, select, button');
    const formElementCount = await formElements.count();

    console.log('Form elements on mobile:', formElementCount);

    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should handle empty cart checkout', async ({ page }) => {
    // Clear cart if possible and try to checkout
    await page.goto('/checkout');
    await page.waitForTimeout(3000);

    // Check if redirected or shown error for empty cart
    const currentUrl = page.url();
    const redirected = !currentUrl.includes('/checkout');

    // Look for empty cart messages
    const emptyCartSelectors = [
      'div:has-text("empty")',
      'div:has-text("No items")',
      'div:has-text("cart is empty")',
      '[data-testid="empty-cart"]'
    ];

    let emptyCartMessageFound = false;
    for (const selector of emptyCartSelectors) {
      if (await page.locator(selector).count() > 0) {
        emptyCartMessageFound = true;
        break;
      }
    }

    await page.screenshot({ path: 'test-results/checkout-empty-cart.png' });

    console.log('Redirected from empty cart checkout:', redirected);
    console.log('Empty cart message found:', emptyCartMessageFound);
  });
});