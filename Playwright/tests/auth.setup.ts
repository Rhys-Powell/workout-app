import { test as setup, expect } from '@playwright/test';
import path from 'path';
import userCredentials from '../.auth/userCredentials.json';

const authFile = path.join(__dirname, '../.auth/user.json');
const testUser = 'Api Tester Admin1';

const getCredentials = () => {
  if (process.env.ENV === 'dev') {
    return {
      auth0_username: process.env.API_TESTER_ADMIN1_USERNAME,
      auth0_password: process.env.API_TESTER_ADMIN1_PASSWORD,
      username: testUser,
    };
  } else {
    return userCredentials[testUser];
  }
};

setup('authenticate', async ({ page }) => {
  const { auth0_username, auth0_password, username } = getCredentials();
  if (!auth0_username || !auth0_password) {
    throw new Error(
      'Missing API_TESTER_ADMIN1_USERNAME or API_TESTER_ADMIN1_PASSWORD environment variable.'
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