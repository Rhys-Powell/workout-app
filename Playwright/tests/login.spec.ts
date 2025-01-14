import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
  await expect(page.getByText(`Welcome`)).toBeVisible();
});