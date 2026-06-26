const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log("Navigating to login page...");
    await page.goto('http://localhost:5173/login');
    
    // Login
    await page.type('input[name="email"]', 'tickettester@gmail.com');
    await page.type('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    console.log("Waiting for navigation...");
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    console.log("Current URL:", page.url());
    
    console.log("Navigating to Create Ticket page...");
    await page.goto('http://localhost:5173/user/tickets/new');
    await page.waitForSelector('input[name="title"]');
    
    console.log("Filling form...");
    await page.type('input[name="title"]', 'Puppeteer Test Ticket');
    await page.type('textarea', 'This is a test from puppeteer');
    await page.type('input[name="location"]', 'Room 500');
    
    // Select category and priority
    await page.select('select[name="categoryId"]', '1');
    await page.select('select[name="priority"]', 'HIGH');
    
    console.log("Submitting form...");
    await page.click('button[type="submit"]');
    
    // Wait for success message or error
    await new Promise(r => setTimeout(r, 1500));
    
    const pageContent = await page.evaluate(() => document.body.innerText);
    if (pageContent.includes('Ticket TKT-')) {
      console.log('SUCCESS: Ticket created successfully!');
    } else if (pageContent.includes('Failed to create ticket')) {
      console.log('ERROR ON PAGE:', pageContent);
    } else {
      console.log('UNKNOWN RESULT. PAGE TEXT:', pageContent);
    }
    
  } catch (err) {
    console.error('Puppeteer test failed:', err);
  } finally {
    await browser.close();
  }
})();
