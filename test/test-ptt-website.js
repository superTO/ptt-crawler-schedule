import puppeteer from 'puppeteer';

const TARGET_URL = 'https://www.ptt.cc/bbs/Gossiping/index.html';

const run = async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  try {
    await page.goto(TARGET_URL, { waitUntil: 'networkidle2' });

    // 處理 PTT 年齡驗證
    const over18 = await page.$('button.btn-big');
    if (over18) {
      await over18.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }

    // 等待文章列表出現
    await page.waitForSelector('#main-container', { timeout: 10000 });

    // 擷取畫面
    await page.screenshot({ path: 'ptt-screenshot.png' });

    // 印出第一篇文章標題
    const title = await page.$eval('.r-ent .title a', el => el.textContent.trim());
    console.log('[✅ SUCCESS] First article title:', title);
  } catch (err) {
    console.error('[❌ ERROR]', err.message);
    const html = await page.content();
    console.log('Page HTML (partial):', html.slice(0, 1000)); // debug 用
  } finally {
    await browser.close();
  }
};

run();
