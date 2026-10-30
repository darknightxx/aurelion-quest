const { boot } = require('./lib');
(async () => {
  const { page, close } = await boot({ start: false });
  console.log(await page.evaluate(() => Object.entries(ITEMS).filter(([k, v]) => v.kind === 'cos' && /ฟักทอง|แม่มด|ซานต้า|กวาง|ค้างคาว|ผี|หิมะ|แวมไพร์|มัมมี่|ปีศาจ|กระต่าย|ดอกไม้|ไทย|โคม|หัวใจ|กุหลาบ|น้ำ|ดาว|เทวดา|ทอง/.test(v.name)).map(([k, v]) => k + ':' + v.slot + ':' + v.name).join('\n')));
  await close();
})();
