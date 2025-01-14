import { expect, Page, test } from '@playwright/test';

const EXERCISE = 'Running';

test.beforeEach(async ({ page }) => {
    
    await page.goto('/profile');
    const currentUserId = await page.evaluate(() => localStorage['currentUserId']);
    await page.goto(`/users/${currentUserId}/exercises`);
});

test.describe('Exercise', () => {
    test('should display message if no exercises exist', async ({ page }) => {
        await expect(page.getByText('No exercises found')).toBeVisible();
    });
    
    test('should add an exercise', async ({ page }) => {
        addExercise(page);
        await expect(page.getByText(EXERCISE)).toBeVisible(); 
    });

    test('should delete an exercise', async ({ page }) => {
        addExercise(page);
        deleteExercise(page);
        await expect(page.getByText(EXERCISE)).not.toBeVisible();
    });
});

async function addExercise(page: Page) {
    await page.getByText('Create exercise').click();
    await page.getByLabel('Exercise Name').fill(EXERCISE);
    await page.getByRole('button', { name: /submit/i }).click();
}

async function deleteExercise(page: Page) {
    await page.getByText(EXERCISE).click();
    await page.getByRole('button', { name: /delete/i }).click();
}