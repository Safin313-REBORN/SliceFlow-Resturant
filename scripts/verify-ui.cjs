const puppeteer = require('../server/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    headless: 'new',
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1080 });

  console.log('Navigating to http://localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

  // 1. Capture Light Mode Header & Hero
  const lightHeroPath = '/home/safin313/.gemini/antigravity/scratch/OIBSIP/WebDev-L3-PizzaDelivery/docs/screenshot_light_hero.png';
  await page.screenshot({ path: lightHeroPath });
  console.log('Saved light mode hero screenshot to:', lightHeroPath);

  // 2. Click Theme Toggle Button in Navbar to switch to Dark Mode
  console.log('Toggling theme to Dark Mode...');
  const themeToggle = await page.$('button[aria-label="Toggle theme mode"]');
  if (themeToggle) {
    await themeToggle.click();
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 600)));
  }

  // 3. Capture Dark Mode Header & Hero
  const darkHeroPath = '/home/safin313/.gemini/antigravity/scratch/OIBSIP/WebDev-L3-PizzaDelivery/docs/screenshot_dark_hero.png';
  await page.screenshot({ path: darkHeroPath });
  console.log('Saved dark mode hero screenshot to:', darkHeroPath);

  // 4. Scroll down to Curated Collections / Food Cards in Dark Mode
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 800)));

  const darkCardsPath = '/home/safin313/.gemini/antigravity/scratch/OIBSIP/WebDev-L3-PizzaDelivery/docs/screenshot_dark_cards.png';
  await page.screenshot({ path: darkCardsPath });
  console.log('Saved dark mode cards screenshot to:', darkCardsPath);

  // 5. Scroll down to Footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 800)));

  const darkFooterPath = '/home/safin313/.gemini/antigravity/scratch/OIBSIP/WebDev-L3-PizzaDelivery/docs/screenshot_dark_footer.png';
  await page.screenshot({ path: darkFooterPath });
  console.log('Saved dark mode footer screenshot to:', darkFooterPath);

  // 6. Navigate to /menu page
  await page.goto('http://localhost:5173/menu', { waitUntil: 'networkidle2' });
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 600)));

  const darkMenuPath = '/home/safin313/.gemini/antigravity/scratch/OIBSIP/WebDev-L3-PizzaDelivery/docs/screenshot_dark_menu.png';
  await page.screenshot({ path: darkMenuPath });
  console.log('Saved dark mode menu screenshot to:', darkMenuPath);

  await browser.close();
  console.log('Verification UI run finished successfully!');
})();

