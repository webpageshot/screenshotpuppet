const fs = require("fs").promises;
const puppeteer = require("puppeteer");
const path = require("path");

async function captureScreenshot() {
    let browser = null;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto("https://coup.aappb.org", { waitUntil: 'networkidle2' });

        async function screenshotDOMElement(selector, padding = 10) {
            const rect = await page.evaluate(selector => {
                const element = document.querySelector(selector);
                const { x, y, width, height } = element.getBoundingClientRect();
                console.log("width", width)
                console.log("height", height)
                return { left: x, top: y, width: width - 15, height: height - 20, id: element.id };
            }, selector);

            return await page.screenshot({
                path: path.join(__dirname, './images/preview.png'),
                clip: {
                    x: rect.left - padding,
                    y: rect.top - padding,
                    width: rect.width + padding * 2,
                    height: rect.height + padding * 2
                }
            });
        }

        await screenshotDOMElement('#culmulativegraph', 16);
        const currentDate = new Date();
        await fs.writeFile(path.join(__dirname, 'log.txt'), `\n Updated graph preview on : ${currentDate.toString()}`, 'utf-8')
        console.log("\n 🕟 Updated log file")


    } catch (err) {
        console.log(`❌ Error: ${err.message}`);
    } finally {
        await browser.close();
        console.log(`\n🎉 Captured Graph `);
    }
}

captureScreenshot();