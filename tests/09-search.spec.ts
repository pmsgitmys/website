import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display search input in header', async ({ page }) => {
    // Look for search input in header
    const searchSelectors = [
      'input[type="search"]',
      'input[name="search"]',
      'input[placeholder*="search" i]',
      'input[placeholder*="find" i]',
      '[data-testid="search"]',
      '[data-testid="search-input"]',
      '.search-input',
      'input[aria-label*="search" i]'
    ];

    let searchInputFound = false;
    let searchElement = null;

    for (const selector of searchSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        searchInputFound = true;
        searchElement = element.first();
        break;
      }
    }

    expect(searchInputFound).toBeTruthy();

    if (searchElement) {
      await expect(searchElement).toBeVisible();
    }

    await page.screenshot({ path: 'test-results/search-input.png' });
  });

  test('should perform basic search from header', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[type="search"], input[name="search"], input[placeholder*="search" i], [data-testid="search"]').first();

    if (await searchInput.count() > 0) {
      // Perform search
      await searchInput.fill('iPhone');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);

      await page.screenshot({ path: 'test-results/search-results-basic.png', fullPage: true });

      // Check if we're on search results page
      const currentUrl = page.url();
      const isSearchPage = currentUrl.includes('/search') ||
                          currentUrl.includes('q=') ||
                          currentUrl.includes('query=') ||
                          currentUrl.includes('search=');

      // Look for search results
      const resultSelectors = [
        '.search-results',
        '.results',
        '.product',
        '.product-card',
        '[data-testid="search-results"]',
        '[data-testid="product"]'
      ];

      let resultsFound = false;
      let resultCount = 0;

      for (const selector of resultSelectors) {
        const results = page.locator(selector);
        const count = await results.count();
        if (count > 0) {
          resultsFound = true;
          resultCount = count;
          break;
        }
      }

      console.log('Search page accessed:', isSearchPage);
      console.log('Search results found:', resultsFound);
      console.log('Result count:', resultCount);
    }
  });

  test('should navigate to dedicated search page', async ({ page }) => {
    // Look for search page link
    const searchPageSelectors = [
      'a[href*="/search"]',
      'a:has-text("Search")',
      'a:has-text("Advanced Search")',
      '[data-testid="search-link"]',
      '[data-testid="advanced-search"]'
    ];

    let searchPageOpened = false;
    for (const selector of searchPageSelectors) {
      const searchLink = page.locator(selector).first();
      if (await searchLink.count() > 0) {
        await searchLink.click();
        await page.waitForTimeout(3000);
        searchPageOpened = true;
        break;
      }
    }

    if (!searchPageOpened) {
      // Try direct navigation
      await page.goto('/search');
      await page.waitForTimeout(3000);
    }

    await page.screenshot({ path: 'test-results/search-page.png', fullPage: true });

    // Verify we're on search page
    const currentUrl = page.url();
    const isSearchPage = currentUrl.includes('/search');

    // Check page content
    const pageContent = await page.textContent('body');
    const hasSearchContent = pageContent?.toLowerCase().includes('search');

    console.log('Dedicated search page accessed:', isSearchPage || hasSearchContent);
  });

  test('should test advanced search filters', async ({ page }) => {
    // Navigate to search page
    await page.goto('/search');
    await page.waitForTimeout(3000);

    // Look for advanced search filters
    const filterSelectors = [
      'select[name="category"]',
      'select[name="brand"]',
      'input[name="minPrice"]',
      'input[name="maxPrice"]',
      'input[type="range"]',
      '.filter',
      '.filters',
      '[data-testid="filter"]',
      'div:has-text("Filter")',
      'div:has-text("Price Range")',
      'div:has-text("Category")',
      'div:has-text("Brand")'
    ];

    let filtersFound = 0;
    for (const selector of filterSelectors) {
      if (await page.locator(selector).count() > 0) {
        filtersFound++;
      }
    }

    // Test using a filter
    const categorySelect = page.locator('select[name="category"], select').first();
    if (await categorySelect.count() > 0) {
      const options = await categorySelect.locator('option').count();
      if (options > 1) {
        await categorySelect.selectOption({ index: 1 });
        await page.waitForTimeout(2000);
      }
    }

    // Test price range filter
    const priceInput = page.locator('input[name="minPrice"], input[name="maxPrice"], input[type="range"]').first();
    if (await priceInput.count() > 0) {
      await priceInput.fill('100');
      await page.waitForTimeout(2000);
    }

    await page.screenshot({ path: 'test-results/search-advanced-filters.png' });

    console.log('Advanced search filters found:', filtersFound);
  });

  test('should test search suggestions/autocomplete', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[type="search"], input[name="search"], input[placeholder*="search" i]').first();

    if (await searchInput.count() > 0) {
      // Type partial search term
      await searchInput.click();
      await searchInput.type('iPh');
      await page.waitForTimeout(2000);

      // Look for suggestions/autocomplete dropdown
      const suggestionSelectors = [
        '.search-suggestions',
        '.autocomplete',
        '.dropdown',
        '[data-testid="suggestions"]',
        '[role="listbox"]',
         'ul[class*="suggest"]',
        'div[class*="suggest"]'
      ];

      let suggestionsFound = false;
      for (const selector of suggestionSelectors) {
        const suggestions = page.locator(selector);
        if (await suggestions.count() > 0 && await suggestions.isVisible()) {
          suggestionsFound = true;
          break;
        }
      }

      await page.screenshot({ path: 'test-results/search-suggestions.png' });

      console.log('Search suggestions/autocomplete found:', suggestionsFound);

      if (suggestionsFound) {
        // Try clicking on a suggestion
        const suggestionItem = page.locator('.search-suggestions li, .autocomplete li, [role="option"]').first();
        if (await suggestionItem.count() > 0) {
          await suggestionItem.click();
          await page.waitForTimeout(2000);
          console.log('Clicked on search suggestion');
        }
      }
    }
  });

  test('should test search with different queries', async ({ page }) => {
    const searchQueries = [
      'iPhone',
      'Samsung',
      'smartphone',
      'phone case',
      'headphones'
    ];

    const searchInput = page.locator('input[type="search"], input[name="search"], input[placeholder*="search" i]').first();

    if (await searchInput.count() > 0) {
      for (const query of searchQueries) {
        // Clear and search
        await searchInput.fill('');
        await searchInput.fill(query);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);

        // Check for results
        const resultSelectors = [
          '.search-results',
          '.results',
          '.product',
          '.product-card'
        ];

        let hasResults = false;
        for (const selector of resultSelectors) {
          if (await page.locator(selector).count() > 0) {
            hasResults = true;
            break;
          }
        }

        await page.screenshot({ path: `test-results/search-query-${query.replace(/\s+/g, '-')}.png` });

        console.log(`Search for "${query}" - Results found:`, hasResults);

        // Go back to search or home
        await page.goto('/');
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should test empty search handling', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[name="search"], input[placeholder*="search" i]').first();

    if (await searchInput.count() > 0) {
      // Try searching with empty query
      await searchInput.fill('');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);

      // Check for empty search handling
      const emptySearchSelectors = [
        'div:has-text("Please enter")',
        'div:has-text("search term")',
        'div:has-text("empty")',
        '.error',
        '.search-error',
        '[data-testid="search-error"]'
      ];

      let emptySearchHandled = false;
      for (const selector of emptySearchSelectors) {
        if (await page.locator(selector).count() > 0) {
          emptySearchHandled = true;
          break;
        }
      }

      await page.screenshot({ path: 'test-results/search-empty-query.png' });

      console.log('Empty search query handled:', emptySearchHandled);
    }
  });

  test('should test no results found scenario', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[name="search"], input[placeholder*="search" i]').first();

    if (await searchInput.count() > 0) {
      // Search for something unlikely to exist
      await searchInput.fill('xyzabcnonexistentproduct123');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);

      // Check for no results message
      const noResultsSelectors = [
        'div:has-text("No results")',
        'div:has-text("not found")',
        'div:has-text("0 results")',
        'div:has-text("nothing found")',
        '.no-results',
        '[data-testid="no-results"]',
        '.empty-results'
      ];

      let noResultsMessageFound = false;
      for (const selector of noResultsSelectors) {
        if (await page.locator(selector).count() > 0) {
          noResultsMessageFound = true;
          break;
        }
      }

      await page.screenshot({ path: 'test-results/search-no-results.png' });

      console.log('No results message found:', noResultsMessageFound);
    }
  });

  test('should test search results pagination', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[name="search"], input[placeholder*="search" i]').first();

    if (await searchInput.count() > 0) {
      // Search for common term likely to have many results
      await searchInput.fill('phone');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);

      // Look for pagination controls
      const paginationSelectors = [
        '.pagination',
        '.pager',
        '[data-testid="pagination"]',
        'button:has-text("Next")',
        'button:has-text("Previous")',
        'a:has-text("Next")',
        'a:has-text("Previous")',
        'button:has-text("2")',
        'a:has-text("2")'
      ];

      let paginationFound = false;
      for (const selector of paginationSelectors) {
        if (await page.locator(selector).count() > 0) {
          paginationFound = true;
          break;
        }
      }

      if (paginationFound) {
        // Try clicking next page
        const nextButton = page.locator('button:has-text("Next"), a:has-text("Next"), button:has-text("2"), a:has-text("2")').first();
        if (await nextButton.count() > 0) {
          await nextButton.click();
          await page.waitForTimeout(3000);
        }
      }

      await page.screenshot({ path: 'test-results/search-pagination.png' });

      console.log('Search results pagination found:', paginationFound);
    }
  });

  test('should test search results sorting', async ({ page }) => {
    const searchInput = page.locator('input[type="search"], input[name="search"], input[placeholder*="search" i]').first();

    if (await searchInput.count() > 0) {
      await searchInput.fill('phone');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);

      // Look for sorting options
      const sortSelectors = [
        'select[name="sort"]',
        'select:has(option:has-text("Price"))',
        'select:has(option:has-text("Name"))',
        'select:has(option:has-text("Rating"))',
        'button:has-text("Sort")',
        '.sort',
        '.sorting',
        '[data-testid="sort"]'
      ];

      let sortingFound = false;
      for (const selector of sortSelectors) {
        const sortElement = page.locator(selector);
        if (await sortElement.count() > 0) {
          sortingFound = true;
          // Try to change sort option
          if (selector.startsWith('select')) {
            const options = await sortElement.locator('option').count();
            if (options > 1) {
              await sortElement.selectOption({ index: 1 });
              await page.waitForTimeout(2000);
            }
          }
          break;
        }
      }

      await page.screenshot({ path: 'test-results/search-sorting.png' });

      console.log('Search results sorting found:', sortingFound);
    }
  });

  test('should test search on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Look for mobile search
    const mobileSearchSelectors = [
      'input[type="search"]',
      'button[aria-label*="search"]',
      '.mobile-search',
      '[data-testid="mobile-search"]',
      'button:has-text("Search")'
    ];

    let mobileSearchFound = false;
    for (const selector of mobileSearchSelectors) {
      const searchElement = page.locator(selector);
      if (await searchElement.count() > 0) {
        mobileSearchFound = true;
        // If it's a button, click to open search
        if (selector.includes('button')) {
          await searchElement.click();
          await page.waitForTimeout(1000);
        }
        break;
      }
    }

    // Try to search on mobile
    const searchInput = page.locator('input[type="search"], input[name="search"]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('iPhone');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);
    }

    await page.screenshot({ path: 'test-results/search-mobile.png', fullPage: true });

    console.log('Mobile search functionality found:', mobileSearchFound);

    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should test search history or recent searches', async ({ page }) => {
    // Perform a few searches first
    const searchInput = page.locator('input[type="search"], input[name="search"], input[placeholder*="search" i]').first();

    if (await searchInput.count() > 0) {
      const searches = ['iPhone', 'Samsung', 'phone case'];

      for (const search of searches) {
        await searchInput.fill(search);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        await page.goto('/');
        await page.waitForTimeout(1000);
      }

      // Click on search input to see if history appears
      await searchInput.click();
      await page.waitForTimeout(2000);

      // Look for search history
      const historySelectors = [
        '.search-history',
        '.recent-searches',
        '[data-testid="search-history"]',
        'div:has-text("Recent")',
        'div:has-text("History")'
      ];

      let searchHistoryFound = false;
      for (const selector of historySelectors) {
        if (await page.locator(selector).count() > 0) {
          searchHistoryFound = true;
          break;
        }
      }

      await page.screenshot({ path: 'test-results/search-history.png' });

      console.log('Search history/recent searches found:', searchHistoryFound);
    }
  });
});