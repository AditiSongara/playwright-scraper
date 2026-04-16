const express = require('express');
const { chromium } = require('playwright');

const app = express();

app.get('/scrape', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({ error: "URL is required" });
  }

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(5000);

    const html = await page.content();
    const text = await page.innerText('body');

    await browser.close();

    res.json({ success: true, html, text });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log('Server running'));