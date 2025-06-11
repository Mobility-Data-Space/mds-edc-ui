import { test, expect } from '@playwright/test';

test('test adding new contract with manual approval', async ({ page }) => {

  await page.goto('http://localhost:3000/data-offers/new');
 
  const randomNumber = `${Math.random()}`.replace("0.", "");
  const policyId = `my-policy-${randomNumber}`;
  await expect(page.locator('label').filter({ hasText: 'Manual Approval' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Manual Approval' })).toBeVisible();
  await page.getByRole('textbox', { name: 'ID' }).click();
  await page.getByRole('textbox', { name: 'ID' }).fill(policyId);
  await page.getByRole('combobox', { name: 'Assets' }).click();
  await page.getByRole('option', { name: 'my-asset', exact: true }).click();
  await page.getByRole('combobox', { name: 'Contract Policy' }).click();
  await page.getByRole('option', { name: 'always-true' }).click();
  await page.getByRole('combobox', { name: 'Access Policy' }).click();
  await page.getByRole('option', { name: 'always-true' }).click();
  await page.getByRole('checkbox', { name: 'Manual Approval' }).check();
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByRole('heading', { name: policyId })).toBeVisible();
});

test('test Approve/Reject columns', async ({ page }) => {
  await page.goto('http://localhost:3000/contract-negotiations/manual-approval');
  await expect(page.getByRole('columnheader', { name: 'Approve' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Reject' })).toBeVisible();
});