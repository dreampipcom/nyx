import { test, expect } from '@playwright/test';

test('loads homepage', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});

test('loads signin', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('button', { name: 'Sign in with Github' })).toBeVisible();
});

test('does signin with current nyx branch and hypnos dev', async ({ page }) => {
  // hypnos auth mock
  page.route('https://dp-nyx.vercel.app/api/auth/signin/github**', async (route, request) => {
    const callbackUrl = new URL('https://dp-nyx.vercel.app/?signedIn=true');

    return route.fulfill({
      status: 308,
      headers: {
        Location: callbackUrl,
        'x-TEST': 'true',
      },
    });
  });

  await page.goto('http://localhost:3000/');

  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.getByRole('button', { name: 'Sign in with Github' }).click();

  await expect(page.url()).toContain('signedIn=true');
});
