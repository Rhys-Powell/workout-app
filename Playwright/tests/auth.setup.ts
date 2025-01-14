import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');
const testUser = 'Api Tester Admin1';

const getCredentials = () => {
  if (process.env.ENV !== 'dev') {
    const userCredentials = require('../.auth/userCredentials.json');
    return userCredentials[testUser];
  } else if (process.env.USER_CREDENTIALS) {
    const userCredentials = JSON.parse(process.env.USER_CREDENTIALS);
    return userCredentials[testUser];
  }
  return {};
};

setup('authenticate', async ({ page }) => {
  const { auth0_username, auth0_password, username } = getCredentials();
  if (!auth0_username || !auth0_password) {
    throw new Error(
      'Missing credentials for this user.'
    )
  }
  await page.goto('');
  await page.getByText('Log In').click();
  await page.getByLabel('Email address').fill(auth0_username);
  await page.getByLabel('Password').fill(auth0_password);
  await page.getByText('Continue', { exact: true }).click();
  await page.waitForURL('/profile');
  await expect(page.getByText(`Welcome ${username}`)).toBeVisible();
  await page.context().storageState({ path: authFile });
});