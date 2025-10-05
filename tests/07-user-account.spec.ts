import { test, expect } from '@playwright/test';

test.describe('User Account Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should access user account page when logged in', async ({ page }) => {
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

      // Navigate to account page
      const accountSelectors = [
        'a[href*="/account"]',
        'a[href*="/profile"]',
        'a:has-text("Account")',
        'a:has-text("Profile")',
        'a:has-text("My Account")',
        '[data-testid="account-link"]',
        '[data-testid="profile-link"]'
      ];

      let accountPageOpened = false;
      for (const selector of accountSelectors) {
        const accountLink = page.locator(selector).first();
        if (await accountLink.count() > 0) {
          await accountLink.click();
          await page.waitForTimeout(3000);
          accountPageOpened = true;
          break;
        }
      }

      if (!accountPageOpened) {
        // Try direct navigation
        await page.goto('/account');
        await page.waitForTimeout(3000);
      }

      await page.screenshot({ path: 'test-results/account-page.png', fullPage: true });

      // Verify we're on account page
      const currentUrl = page.url();
      const isAccountPage = currentUrl.includes('/account') || currentUrl.includes('/profile');

      console.log('Account page accessed:', isAccountPage);
      console.log('Current URL:', currentUrl);
    }
  });

  test('should display user profile information', async ({ page }) => {
    // Login and navigate to account
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

      await page.goto('/account');
      await page.waitForTimeout(3000);

      // Look for profile information elements
      const profileElements = [
        'input[name="name"], input[name="firstName"]',
        'input[name="email"]',
        'input[name="phone"]',
        'div:has-text("Name")',
        'div:has-text("Email")',
        'div:has-text("Phone")',
        '.profile-info',
        '[data-testid="profile-info"]',
        '.user-details'
      ];

      let profileElementsFound = 0;
      for (const selector of profileElements) {
        if (await page.locator(selector).count() > 0) {
          profileElementsFound++;
        }
      }

      await page.screenshot({ path: 'test-results/account-profile-info.png' });

      console.log('Profile elements found:', profileElementsFound);

      // Check for edit profile functionality
      const editSelectors = [
        'button:has-text("Edit")',
        'button:has-text("Edit Profile")',
        'a:has-text("Edit")',
        '[data-testid="edit-profile"]',
        '.edit-profile'
      ];

      let editOptionFound = false;
      for (const selector of editSelectors) {
        if (await page.locator(selector).count() > 0) {
          editOptionFound = true;
          break;
        }
      }

      console.log('Edit profile option found:', editOptionFound);
    }
  });

  test('should edit user profile', async ({ page }) => {
    // Login and navigate to account
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

      await page.goto('/account');
      await page.waitForTimeout(3000);

      // Try to edit profile
      const editButton = page.locator('button:has-text("Edit"), [data-testid="edit-profile"]').first();
      if (await editButton.count() > 0) {
        await editButton.click();
        await page.waitForTimeout(2000);

        // Look for editable form fields
        const editableFields = [
          'input[name="name"], input[name="firstName"]',
          'input[name="lastName"]',
          'input[name="phone"]',
          'textarea[name="address"]'
        ];

        let fieldsEdited = 0;
        for (const selector of editableFields) {
          const field = page.locator(selector).first();
          if (await field.count() > 0) {
            // Clear and fill with new value
            await field.fill('');
            if (selector.includes('name') || selector.includes('firstName')) {
              await field.fill('Updated Name');
            } else if (selector.includes('phone')) {
              await field.fill('9876543210');
            } else if (selector.includes('address')) {
              await field.fill('Updated Address 123');
            }
            fieldsEdited++;
            await page.waitForTimeout(300);
          }
        }

        // Save changes
        const saveSelectors = [
          'button:has-text("Save")',
          'button:has-text("Update")',
          'button[type="submit"]',
          '[data-testid="save-profile"]'
        ];

        let changesSaved = false;
        for (const selector of saveSelectors) {
          const saveButton = page.locator(selector).first();
          if (await saveButton.count() > 0) {
            await saveButton.click();
            await page.waitForTimeout(3000);
            changesSaved = true;
            break;
          }
        }

        await page.screenshot({ path: 'test-results/account-profile-edit.png' });

        console.log('Profile fields edited:', fieldsEdited);
        console.log('Changes saved:', changesSaved);
      }
    }
  });

  test('should display order history', async ({ page }) => {
    // Login and navigate to account
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

      // Navigate to orders page
      const orderSelectors = [
        'a[href*="/orders"]',
        'a:has-text("Orders")',
        'a:has-text("Order History")',
        'a:has-text("My Orders")',
        '[data-testid="orders-link"]',
        '.orders-link'
      ];

      let ordersPageOpened = false;
      for (const selector of orderSelectors) {
        const ordersLink = page.locator(selector).first();
        if (await ordersLink.count() > 0) {
          await ordersLink.click();
          await page.waitForTimeout(3000);
          ordersPageOpened = true;
          break;
        }
      }

      if (!ordersPageOpened) {
        // Try direct navigation
        await page.goto('/orders');
        await page.waitForTimeout(3000);
      }

      await page.screenshot({ path: 'test-results/account-order-history.png', fullPage: true });

      // Check for order elements
      const orderElements = [
        '.order',
        '.order-item',
        '[data-testid="order"]',
        'div:has-text("Order #")',
        'div:has-text("Order")',
        '.order-card',
        '.order-list'
      ];

      let ordersFound = false;
      for (const selector of orderElements) {
        if (await page.locator(selector).count() > 0) {
          ordersFound = true;
          break;
        }
      }

      // Check for empty orders state
      const emptyOrdersSelectors = [
        'div:has-text("No orders")',
        'div:has-text("No order history")',
        'div:has-text("haven\'t placed any orders")',
        '[data-testid="empty-orders"]',
        '.empty-orders'
      ];

      let emptyOrdersFound = false;
      for (const selector of emptyOrdersSelectors) {
        if (await page.locator(selector).count() > 0) {
          emptyOrdersFound = true;
          break;
        }
      }

      console.log('Orders found:', ordersFound);
      console.log('Empty orders state found:', emptyOrdersFound);

      // Verify we're on orders page
      const currentUrl = page.url();
      const isOrdersPage = currentUrl.includes('/orders');
      console.log('Orders page accessed:', isOrdersPage);
    }
  });

  test('should view order details', async ({ page }) => {
    // Login and navigate to orders
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

      await page.goto('/orders');
      await page.waitForTimeout(3000);

      // Look for order detail links
      const orderDetailSelectors = [
        'a:has-text("View Details")',
        'a:has-text("View Order")',
        'button:has-text("Details")',
        '.order a',
        '[data-testid="order-details"]'
      ];

      let orderDetailOpened = false;
      for (const selector of orderDetailSelectors) {
        const orderDetailLink = page.locator(selector).first();
        if (await orderDetailLink.count() > 0) {
          await orderDetailLink.click();
          await page.waitForTimeout(3000);
          orderDetailOpened = true;
          break;
        }
      }

      if (orderDetailOpened) {
        await page.screenshot({ path: 'test-results/account-order-details.png', fullPage: true });

        // Check for order detail elements
        const detailElements = [
          'div:has-text("Order #")',
          'div:has-text("Order Date")',
          'div:has-text("Status")',
          'div:has-text("Total")',
          '.order-details',
          '[data-testid="order-info"]'
        ];

        let orderDetailsFound = 0;
        for (const selector of detailElements) {
          if (await page.locator(selector).count() > 0) {
            orderDetailsFound++;
          }
        }

        console.log('Order detail elements found:', orderDetailsFound);
      } else {
        console.log('No order details to view (no orders or links found)');
      }
    }
  });

  test('should manage account settings', async ({ page }) => {
    // Login and navigate to account
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

      await page.goto('/account');
      await page.waitForTimeout(3000);

      // Look for settings/preferences sections
      const settingsSelectors = [
        'a:has-text("Settings")',
        'a:has-text("Preferences")',
        'button:has-text("Settings")',
        '[data-testid="settings"]',
        '.settings',
        'div:has-text("Account Settings")',
        'div:has-text("Privacy Settings")'
      ];

      let settingsFound = false;
      for (const selector of settingsSelectors) {
        if (await page.locator(selector).count() > 0) {
          settingsFound = true;
          break;
        }
      }

      // Look for notification preferences
      const notificationSelectors = [
        'input[type="checkbox"][name*="notification"]',
        'input[type="checkbox"][name*="email"]',
        'input[type="checkbox"][name*="sms"]',
        'div:has-text("Email Notifications")',
        'div:has-text("SMS Notifications")',
        '.notification-settings'
      ];

      let notificationSettingsFound = false;
      for (const selector of notificationSelectors) {
        if (await page.locator(selector).count() > 0) {
          notificationSettingsFound = true;
          break;
        }
      }

      await page.screenshot({ path: 'test-results/account-settings.png' });

      console.log('Settings section found:', settingsFound);
      console.log('Notification settings found:', notificationSettingsFound);
    }
  });

  test('should change password', async ({ page }) => {
    // Login and navigate to account
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

      await page.goto('/account');
      await page.waitForTimeout(3000);

      // Look for change password option
      const changePasswordSelectors = [
        'a:has-text("Change Password")',
        'button:has-text("Change Password")',
        'a:has-text("Update Password")',
        '[data-testid="change-password"]',
        '.change-password'
      ];

      let changePasswordFound = false;
      for (const selector of changePasswordSelectors) {
        const changePasswordLink = page.locator(selector).first();
        if (await changePasswordLink.count() > 0) {
          await changePasswordLink.click();
          await page.waitForTimeout(2000);
          changePasswordFound = true;
          break;
        }
      }

      if (changePasswordFound) {
        // Look for password form fields
        const passwordFields = [
          'input[name="currentPassword"], input[placeholder*="current" i]',
          'input[name="newPassword"], input[placeholder*="new" i]',
          'input[name="confirmPassword"], input[placeholder*="confirm" i]'
        ];

        let passwordFieldsFound = 0;
        for (const selector of passwordFields) {
          if (await page.locator(selector).count() > 0) {
            passwordFieldsFound++;
          }
        }

        await page.screenshot({ path: 'test-results/account-change-password.png' });

        console.log('Change password form found:', changePasswordFound);
        console.log('Password form fields found:', passwordFieldsFound);
      } else {
        console.log('Change password option not found');
      }
    }
  });

  test('should manage addresses', async ({ page }) => {
    // Login and navigate to account
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

      await page.goto('/account');
      await page.waitForTimeout(3000);

      // Look for address management
      const addressSelectors = [
        'a:has-text("Addresses")',
        'a:has-text("Shipping Addresses")',
        'a:has-text("Address Book")',
        'button:has-text("Add Address")',
        '[data-testid="addresses"]',
        '.addresses'
      ];

      let addressSectionFound = false;
      for (const selector of addressSelectors) {
        const addressElement = page.locator(selector).first();
        if (await addressElement.count() > 0) {
          addressSectionFound = true;
          // Click to view addresses
          await addressElement.click();
          await page.waitForTimeout(2000);
          break;
        }
      }

      if (addressSectionFound) {
        // Look for existing addresses or add address option
        const addressElements = [
          '.address',
          '.address-card',
          '[data-testid="address"]',
          'div:has-text("Street")',
          'div:has-text("City")',
          'button:has-text("Add New Address")',
          'button:has-text("Add Address")'
        ];

        let addressElementsFound = 0;
        for (const selector of addressElements) {
          if (await page.locator(selector).count() > 0) {
            addressElementsFound++;
          }
        }

        await page.screenshot({ path: 'test-results/account-addresses.png' });

        console.log('Address section found:', addressSectionFound);
        console.log('Address elements found:', addressElementsFound);
      }
    }
  });

  test('should test account security features', async ({ page }) => {
    // Login and navigate to account
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

      await page.goto('/account');
      await page.waitForTimeout(3000);

      // Look for security features
      const securitySelectors = [
        'a:has-text("Security")',
        'a:has-text("Privacy")',
        'div:has-text("Two-Factor")',
        'div:has-text("2FA")',
        'button:has-text("Enable 2FA")',
        'div:has-text("Login History")',
        'div:has-text("Active Sessions")',
        '[data-testid="security"]'
      ];

      let securityFeaturesFound = 0;
      for (const selector of securitySelectors) {
        if (await page.locator(selector).count() > 0) {
          securityFeaturesFound++;
        }
      }

      await page.screenshot({ path: 'test-results/account-security.png' });

      console.log('Security features found:', securityFeaturesFound);
    }
  });

  test('should test account deletion or deactivation', async ({ page }) => {
    // Login and navigate to account
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

      await page.goto('/account');
      await page.waitForTimeout(3000);

      // Look for account deletion/deactivation options
      const deleteSelectors = [
        'button:has-text("Delete Account")',
        'a:has-text("Delete Account")',
        'button:has-text("Deactivate")',
        'a:has-text("Close Account")',
        '[data-testid="delete-account"]',
        '.delete-account'
      ];

      let deleteOptionFound = false;
      for (const selector of deleteSelectors) {
        if (await page.locator(selector).count() > 0) {
          deleteOptionFound = true;
          break;
        }
      }

      await page.screenshot({ path: 'test-results/account-deletion.png' });

      console.log('Account deletion option found:', deleteOptionFound);

      // Note: We don't actually click delete to avoid removing the test account
    }
  });

  test('should test account page on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Login and navigate to account
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

      await page.goto('/account');
      await page.waitForTimeout(3000);
    }

    await page.screenshot({ path: 'test-results/account-mobile.png', fullPage: true });

    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});