import { test, expect } from 'playwright/test';

// Basic end-to-end flow for categories tree
// NOTE: This test assumes the development server and Supabase backend are running.
test.skip('manage categories tree', async ({ page }) => {
    await page.goto('http://localhost:5173/categories');

    await page.getByRole('button', { name: 'New category' }).click();
    await page.getByPlaceholder('Name').fill('Parent');
    await page.getByRole('button', { name: /create/i }).click();

    await expect(page.getByText('Parent')).toBeVisible();

    await page.getByLabel('add', { exact: true }).first().click();
    await page.getByPlaceholder('Name').fill('Child');
    await page.getByRole('button', { name: /create/i }).click();

    await expect(page.getByText('Child')).toBeVisible();

    // Rename
    await page.getByLabel('rename').last().click();
    await page.getByDisplayValue('Child').fill('Child2');
    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByText('Child2')).toBeVisible();

    // Delete
    await page.getByLabel('delete').last().click();
    await page.getByRole('button', { name: /confirm/i }).click();

    await expect(page.getByText('Child2')).not.toBeVisible();
});
