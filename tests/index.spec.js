const { test, expect } = require('@playwright/test');
const path = require('path');

const BASE = 'file:///' + path.resolve(__dirname, '..').replace(/\\/g, '/');

test.describe('index.html — 랜딩 페이지', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/index.html');
  });

  test('페이지 타이틀 확인', async ({ page }) => {
    await expect(page).toHaveTitle('Car Quest 2 — 도로를 달려라');
  });

  test('네비게이션 로고 표시', async ({ page }) => {
    const logo = page.locator('.nav-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toContainText('CAR QUEST 2');
  });

  test('네비게이션 PLAY NOW 버튼 → car2.html로 이동', async ({ page }) => {
    const playBtn = page.locator('.nav-play');
    await expect(playBtn).toBeVisible();
    await expect(playBtn).toHaveAttribute('href', 'car2.html');
  });

  test('히어로 섹션 타이틀 표시', async ({ page }) => {
    const title = page.locator('.hero-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('CAR QUEST 2');
  });

  test('히어로 서브타이틀 표시', async ({ page }) => {
    const sub = page.locator('.hero-title-sub');
    await expect(sub).toContainText('DRIVE · NAVIGATE · SURVIVE');
  });

  test('히어로 배지 표시', async ({ page }) => {
    const badge = page.locator('.hero-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('바닐라 JS + SVG 게임');
  });

  test('지금 플레이 CTA 버튼 → car2.html로 이동', async ({ page }) => {
    const cta = page.locator('.btn-primary');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', 'car2.html');
    await expect(cta).toContainText('지금 플레이');
  });

  test('게임 소개 보기 링크 → #features로 이동', async ({ page }) => {
    const link = page.locator('.btn-secondary');
    await expect(link).toHaveAttribute('href', '#features');
  });

  test('도로 프리뷰 SVG 애니메이션 존재', async ({ page }) => {
    const roadPreview = page.locator('.road-preview');
    await expect(roadPreview).toBeVisible();
    const svg = roadPreview.locator('svg');
    await expect(svg).toBeVisible();
  });

  test('피처 섹션 존재 및 6개 카드 표시', async ({ page }) => {
    const featSection = page.locator('#features');
    await expect(featSection).toBeAttached();

    const cards = page.locator('.feat-card');
    await expect(cards).toHaveCount(6);
  });

  test('피처 카드 항목 이름 확인', async ({ page }) => {
    const names = await page.locator('.feat-name').allTextContents();
    expect(names).toContain('부드러운 이동');
    expect(names).toContain('가짜 분기 함정');
    expect(names).toContain('3목숨 시스템');
    expect(names).toContain('베스트 타임 기록');
    expect(names).toContain('합성 사운드');
    expect(names).toContain('순수 SVG 그래픽');
  });

  test('키보드 조작키 4개 표시', async ({ page }) => {
    const keys = page.locator('.key');
    await expect(keys).toHaveCount(4);

    await expect(page.locator('.key-up')).toContainText('↑');
    await expect(page.locator('.key-left')).toContainText('←');
    await expect(page.locator('.key-down')).toContainText('↓');
    await expect(page.locator('.key-right')).toContainText('→');
  });

  test('레벨 목록 5개 표시', async ({ page }) => {
    const levels = page.locator('.level-item');
    await expect(levels).toHaveCount(5);
  });

  test('레벨 이름 확인', async ({ page }) => {
    const levelNames = await page.locator('.lv-name').allTextContents();
    expect(levelNames).toContain('STRAIGHT SHOT');
    expect(levelNames).toContain('FIRST CORNER');
    expect(levelNames).toContain('S-CURVE');
    expect(levelNames).toContain('ZIGZAG');
    expect(levelNames).toContain('LABYRINTH');
  });

  test('스탯 섹션 — 5개 통계 항목 표시', async ({ page }) => {
    const stats = page.locator('.stat-item');
    await expect(stats).toHaveCount(5);
  });

  test('스탯 수치 확인', async ({ page }) => {
    const nums = await page.locator('.stat-num').allTextContents();
    expect(nums).toContain('5');   // 레벨 수
    expect(nums).toContain('3');   // 목숨
    expect(nums).toContain('60');  // FPS
  });

  test('최종 CTA 버튼 — PLAY CAR QUEST 2', async ({ page }) => {
    const bigBtn = page.locator('.btn-big');
    await expect(bigBtn).toHaveAttribute('href', 'car2.html');
    await expect(bigBtn).toContainText('PLAY CAR QUEST 2');
  });

  test('클래식 버전 버튼 → car1.html로 이동', async ({ page }) => {
    const outlineBtn = page.locator('.btn-outline');
    await expect(outlineBtn).toHaveAttribute('href', 'car1.html');
    await expect(outlineBtn).toContainText('CLASSIC VER');
  });

  test('푸터 텍스트 확인', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toContainText('CAR QUEST 2');
    await expect(footer).toContainText('VANILLA JS + SVG');
  });

  test('스크롤 후 네비게이션 배경 변경', async ({ page }) => {
    const nav = page.locator('nav');
    const beforeBg = await nav.evaluate(el => getComputedStyle(el).background);

    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(300);

    const afterBg = await nav.evaluate(el => el.style.background);
    expect(afterBg).toContain('0.96');
  });

  test('PLAY NOW 클릭 시 car2.html로 이동', async ({ page }) => {
    await page.locator('.nav-play').click();
    await page.waitForLoadState('load');
    expect(page.url()).toContain('car2.html');
  });

});
