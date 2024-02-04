const puppeteer = require('puppeteer');
const url = 'https://www.empresasruc.com/consulta-ruc';
const urlBase = 'https://www.empresasruc.com';
//const ruc = "20462509236";
const ruc = "20600110421";

(async () => {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.setViewport({
        width: 1500,
        height: 1200,
        deviceScaleFactor: 1,
      });

    //await page.goto(url);
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });

    const dataCompany = [];
    await page.waitForSelector(`input[name="ruc-empresa"]`).then(() => page.type(`input[name="ruc-empresa"]`, ruc));
    await page.waitForSelector('.btn-search').then(() => page.click('.btn-search'));


    let  razonSocial = await page.$eval('.result-info a',(element => element.textContent));
    let  href = await page.$eval('.result-info a', (element) => element.getAttribute('href'));
    const urlCompany =  urlBase + href;

    await page.goto(urlCompany);
    const [ addressRuc] = await page.$$eval('h4.widget-list-title', (element) => [element[4].textContent ]);
    const address =  addressRuc == "Padrón y ubigeo" ? null : addressRuc;
    razonSocial = razonSocial == null ?  await page.$eval('.empresa-razon-social',(element => element.textContent.trim())) : razonSocial;
    
    var tmp = {};
    tmp.ruc  = ruc;
    tmp.razonSocial  = razonSocial;
    tmp.address = address;

    dataCompany.push(tmp);
    console.log(dataCompany);
    
    //await browser.close();
})();