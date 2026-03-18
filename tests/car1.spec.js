const { test, expect } = require('@playwright/test');
const path = require('path');

const BASE = 'file:///' + path.resolve(__dirname, '..').replace(/\\/g, '/');

test.describe('car1.html — Car Racing Game (클래식)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/car1.html');
  });

  test('페이지 타이틀 확인', async ({ page }) => {
    await expect(page).toHaveTitle('Car Racing Game');
  });

  test('게임 제목 h1 표시', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });

  test('게임 컨테이너 존재', async ({ page }) => {
    const container = page.locator('#game-container');
    await expect(container).toBeAttached();
  });

  test('UI 섹션 존재', async ({ page }) => {
    const ui = page.locator('#ui');
    await expect(ui).toBeAttached();
  });

  test('정보 텍스트 존재', async ({ page }) => {
    const info = page.locator('#info');
    await expect(info).toBeAttached();
  });

  test('메시지 박스 초기 상태 hidden', async ({ page }) => {
    const message = page.locator('#message');
    await expect(message).toBeAttached();

    // 초기에는 숨겨져 있어야 함
    const isHidden = await message.evaluate(el => {
      const style = getComputedStyle(el);
      return style.display === 'none' || el.style.display === 'none';
    });
    expect(isHidden).toBe(true);
  });

});
