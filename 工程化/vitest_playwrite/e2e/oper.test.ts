import { test, expect } from '@playwright/test'

const siteUrl = 'http://localhost:5173'

test('Verify button clicks', async ({ page }) => {
    await page.goto(siteUrl)

    await page.getByRole('button').click()

    await expect(page.getByRole('button')).toHaveText('count is 1')
})
