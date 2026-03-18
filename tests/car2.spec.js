const { test, expect } = require('@playwright/test');
const path = require('path');

const BASE = 'file:///' + path.resolve(__dirname, '..').replace(/\\/g, '/');

test.describe('car2.html — Car Quest 2 게임', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/car2.html');
  });

  test('페이지 타이틀 확인', async ({ page }) => {
    await expect(page).toHaveTitle('Car Quest 2');
  });

  test('HUD — 레벨 표시 (1 / 5)', async ({ page }) => {
    const level = page.locator('#h-level');
    await expect(level).toBeVisible();
    await expect(level).toContainText('1 / 5');
  });

  test('HUD — 목숨 표시 (♥ ♥ ♥)', async ({ page }) => {
    const lives = page.locator('#h-lives');
    await expect(lives).toBeVisible();
    await expect(lives).toContainText('♥ ♥ ♥');
  });

  test('HUD — 타이머 표시', async ({ page }) => {
    const timer = page.locator('#h-time');
    await expect(timer).toBeVisible();
  });

  test('HUD — 베스트 타임 표시', async ({ page }) => {
    const best = page.locator('#h-best');
    await expect(best).toBeVisible();
  });

  test('SVG 게임 캔버스 존재', async ({ page }) => {
    const game = page.locator('#game');
    await expect(game).toBeVisible();

    const width = await game.getAttribute('width');
    const height = await game.getAttribute('height');
    expect(width).toBe('600');
    expect(height).toBe('600');
  });

  test('시작 오버레이 표시', async ({ page }) => {
    const overlay = page.locator('#overlay');
    await expect(overlay).toBeVisible();
  });

  test('시작 오버레이 — CAR QUEST 2 타이틀', async ({ page }) => {
    const title = page.locator('.ov-title');
    await expect(title).toContainText('CAR QUEST 2');
  });

  test('시작 오버레이 — START 버튼 또는 Enter 안내 텍스트 존재', async ({ page }) => {
    const overlay = page.locator('#overlay');
    const text = await overlay.textContent();
    // 게임 시작 방법 안내가 있어야 함
    const hasEnter = text.includes('Enter') || text.includes('START') || text.includes('시작');
    expect(hasEnter).toBe(true);
  });

  test('레벨 배너 존재', async ({ page }) => {
    const banner = page.locator('#level-banner');
    await expect(banner).toBeAttached();
  });

  test('Enter 키 입력 시 오버레이 숨김 (게임 시작)', async ({ page }) => {
    const overlay = page.locator('#overlay');
    await expect(overlay).toBeVisible();

    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // 오버레이가 숨겨지거나 display:none 상태여야 함
    const isHidden = await overlay.evaluate(el => {
      const style = getComputedStyle(el);
      return style.display === 'none' || style.visibility === 'hidden' || el.style.display === 'none';
    });
    expect(isHidden).toBe(true);
  });

  test('게임 시작 후 타이머 동작 확인', async ({ page }) => {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    const timer = page.locator('#h-time');
    const time1 = await timer.textContent();
    await page.waitForTimeout(1000);
    const time2 = await timer.textContent();

    // 1초 후 타이머가 변경되어야 함
    expect(time1).not.toBe(time2);
  });

  test('게임 시작 후 R키 누르면 레벨 재시작', async ({ page }) => {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    // R 키로 재시작
    await page.keyboard.press('r');
    await page.waitForTimeout(300);

    // HUD가 초기 상태로 돌아와야 함 (목숨 3개)
    const lives = page.locator('#h-lives');
    await expect(lives).toContainText('♥ ♥ ♥');
  });

  test('방향키 입력 이벤트 처리 확인', async ({ page }) => {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    // 키 입력 시 에러 없이 동작해야 함
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(200);
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(200);
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(200);

    // 충돌이나 에러 없이 HUD가 표시되어야 함
    await expect(page.locator('#hud')).toBeVisible();
  });

});
