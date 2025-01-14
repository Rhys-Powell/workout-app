import { test as setup, expect } from '@playwright/test';
import path from 'path';
import userCredentials from '../.auth/userCredentials.json';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  const { auth0_username, auth0_password, username } = userCredentials['Api Tester Admin1']; 
  await page.goto('');
  await page.getByText('Log In').click();
  await page.getByLabel('Email address').fill(auth0_username);
  await page.getByLabel('Password').fill(auth0_password);
  await page.getByText('Continue', { exact: true }).click();
  await page.waitForURL('/profile');
  await expect(page.getByText(`Welcome ${username}`)).toBeVisible();
  await page.context().storageState({ path: authFile });
});