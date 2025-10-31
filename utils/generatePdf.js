const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const generatePDF = async (workOrder, res) => {
  const html = fs.readFileSync(path.join(__dirname, '../views/workOrder/pdfTemplate.ejs'), 'utf-8');
  const template = require('ejs').render(html, { workOrder, moment: require('moment') });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(template, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px'}
  });

  await browser.close();

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="WorkOrder_${workOrder.itemCode}.pdf"`
  });
  res.send(pdfBuffer);
};

module.exports = generatePDF;