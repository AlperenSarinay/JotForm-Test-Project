const puppeteer = require('puppeteer');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

(async() => {

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-fullscreen', '--no - sandbox', '--disable - setuid - sandbox', '--user - data - dir'],
        defaultViewport: null,
        slowMo: 40,
    });
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
        'Accept-Language': 'bn'
    });
    await page.goto('https://www.jotform.com/login/', { waitUntil: 'load', timeout: 0 });
    await page.evaluate(() => document.getElementById('username').value = "alperensarinay@gmail.com"); // jotform username
    await page.evaluate(() => document.getElementById('password').value = "05323310837"); // Jotform password
    await page.evaluate(() => document.getElementById('loginButton').click());
    await page.waitFor(1000);


    // Form Themes Page

    var pageUrlThemes = ['https://www.jotform.com/theme-store/', 'https://www.jotform.com/theme-store/collection/mobile', 'https://www.jotform.com/theme-store/collection/minimal',
        'https://www.jotform.com/theme-store/collection/minimal', 'https://www.jotform.com/theme-store/collection/fancy_fonts',
        'https://www.jotform.com/theme-store/collection/colorful', 'https://www.jotform.com/theme-store/collection/fun',
        'https://www.jotform.com/theme-store/collection/holidays', 'https://www.jotform.com/theme-store/collection/multiple_pages',
        'https://www.jotform.com/theme-store/collection/fancy_backgrounds', 'https://www.jotform.com/theme-store/collection/big_text',
        'https://www.jotform.com/theme-store/collection/dark', 'https://www.jotform.com/theme-store/collection/transparent',
        'https://www.jotform.com/theme-store/collection/animated', 'https://www.jotform.com/theme-store/collection/wood',
        'https://www.jotform.com/theme-store/collection/light', 'https://www.jotform.com/theme-store/collection/fancy_inputs',
        'https://www.jotform.com/theme-store/collection/clean', 'https://www.jotform.com/theme-store/collection/3d',
        'https://www.jotform.com/theme-store/collection/flat', 'https://www.jotform.com/theme-store/collection/vintage',
        'https://www.jotform.com/theme-store/collection/colorful_backgrounds', 'https://www.jotform.com/theme-store/collection/icon_forms',
        'https://www.jotform.com/theme-store/collection/fancy_buttons', 'https://www.jotform.com/theme-store/collection/large_logo',
        'https://www.jotform.com/theme-store/collection/no_label', 'https://www.jotform.com/theme-store/collection/fancy-headers',
        'https://www.jotform.com/theme-store/collection/survey', 'https://www.jotform.com/theme-store/collection/featured',
        'https://www.jotform.com/theme-store/collection/nature', 'https://www.jotform.com/theme-store/collection/landscapes',
        'https://www.jotform.com/theme-store/collection/recent', 'https://www.jotform.com/theme-store/collection/mothers-day',
        'https://www.jotform.com/theme-store/collection/halloween'
    ];

    await page.goto(pageUrlThemes[0], { waitUntil: 'load', timeout: 0 });

    var p = './screenshots/';
    var flagThemes = 1;
    var selectorThemes = ("[class*=item-thumb]");
    const imgs = await page.$$eval('img[data-original]', imgs => imgs.map(img => img.getAttribute('data-original'))); // all images on the page
    for (var i = 0; i < imgs.length; i++) {
        if (imgs[i] == '') {

            await drawCanvas(page, selectorThemes, i, flagThemes);
            await page.waitFor(500);
            p = p.concat(i);
            p = p.concat('.png');
            await page.screenshot({ path: p });
            await removeCanvas(page, 'canvas', 0);
        }

    }

    selectorThemes = ("[class*=item-thumb]"); // selected class for canvas drawing

    for (var n = 1; n < pageUrlThemes.length; n++) {
        // links to click in the category
        const linkHandler1 = await page.$x('//*[@id="dLabel"]');
        await linkHandler1[0].click();
        await page.waitFor(500);
        await page.goto(pageUrlThemes[n], { waitUntil: 'load' });
        await page.waitFor(10000);
        const imgs1 = await page.$$eval('img[src]', imgs => imgs.map(img => img.getAttribute('src'))); // all images on the page

        for (var a = 1; a < imgs1.length; a++) {
            //loop where non-formal parts are selected
            if (imgs1[a] == '') {
                await drawCanvas(page, selectorThemes, a - 1, flagThemes);
                await page.waitFor(500);
                await page.screenshot({ path: p });
                await removeCanvas(page, 'canvas', 0);
            }
        }
    }


    //UserGuide Page

    await page.goto('https://www.jotform.com/help', { waitUntil: 'load', timeout: 0 });
    var pageurlUserGuide = 'https://www.jotform.com/help';
    const arr = await page.evaluate(() => document.querySelector("#main > section > div > div.clearfix > div.leftPanel > ul").innerText); // the place where the links on the left side of the page are pulled.
    var OBJuserGuide = [];
    var flagUser = 2;
    var UserSelector = "#main > section > div > div.clearfix > div.leftPanel > ul > li";
    OBJuserGuide = arr;
    var OBJuserGuide1 = (OBJuserGuide.toString()).split("\n");
    for (var i = 0; i < OBJuserGuide1.length; i++) {

        await drawCanvas(page, UserSelector, i, flagUser);
        await page.waitFor(500);
        await removeCanvas(page, 'canvas', 0);
        const link = OBJuserGuide1[i];
        await clickByText(page, link); // click on the link 
        await page.waitForNavigation({ waitUntil: 'load' });
        console.log("Current page:", page.url());
        var pageUrlDifferent = page.url();


        if (pageurlUserGuide != pageUrlDifferent) {
            await page.waitFor(500);

            const hrefs = await page.$$eval('a', as => as.map(a => a.href)); // all link on the page

            for (var j = 0; j < hrefs.length; j++) { // loop to check whether the link is broken
                var someUrl = hrefs[j];
                urlExists(someUrl, function(exists) {
                    console.log('"%s" exists?', someUrl, exists);
                });


                page.evaluate(_ => {
                    window.scrollBy(0, 50);
                });
                await page.waitFor(700);
            }
            await page.goto(pageurlUserGuide, { waitUntil: 'load', timeout: 0 });
        }
    }

    UserSelector = ("[class*=help-list-wrapper]") // class inside the page

    for (var i = 0; i < 19; i++) {

        await drawCanvas(page, UserSelector, i, flagUser);
        await page.waitFor(500);
        await removeCanvas(page, 'canvas', 0);
        const linkHandler = await page.$x('//*[@id="chapter-' + i + '"]/a'); // extract classes using java script.
        await linkHandler[0].click(); // click on the link 
        await page.waitForNavigation({ waitUntil: 'load' });
        const hrefs1 = await page.$$eval('a', as => as.map(a => a.href)); // all link on the page

        for (var x = 0; x < hrefs1.length; x++) {
            // loop that checks broken links
            page.evaluate(_ => {
                window.scrollBy(0, 50); //scroll down
            });
            var someUrl = hrefs1[x];
            urlExists(someUrl, function(exists) { // loop to check whether the link is broken
                console.log('"%s" exists?', someUrl, exists);
            });
            await page.waitFor(700);
        }

        await page.goto(pageurlUserGuide, { waitUntil: 'load', timeout: 0 });

    }


    //BLog page 


    await page.goto('https://www.jotform.com/blog/', { waitUntil: 'load', timeout: 0 });
    var pageUrlBlogPage = 'https://www.jotform.com/blog/';
    var ObjBlogPage = [];
    var flagBlog = 3;
    var Text = ['ADVICE', 'PRODUCT', 'BACKSTAGE', 'CUSTOMER STORIES', 'GUIDES', 'EDUCATION', 'HEALTHCARE', 'PHOTOGRAPHERS', 'SUMMER CAMPS', 'GRAPHIC DESIGN', 'NONPROFIST', 'ONLINE PAYMENT', 'INSPECTORS']; // elements to be deleted in array

    const textContent = await page.evaluate(() => document.querySelector('main').innerText); // All articles on the page
    ObjBlogPage = textContent;
    var NewObjBlogPage = (ObjBlogPage.toString()).split("\n");

    for (var i = 0; i < NewObjBlogPage.length; i++) {

        var res = NewObjBlogPage[i].slice(0, 2);
        if (res == 'by') {
            // convert all articles on the link to click
            var Result = NewObjBlogPage[i].toString().match(/\w+\s\w+\s\w+\b/);
            if (Array.isArray(Result)) {
                NewObjBlogPage[i] = Result[0].slice(3, Result[0].length);
            }
        }
        var value;
        for (var k = 0; k < 14; k++) {
            //elements to be deleted
            value = Text[k];
            NewObjBlogPage = NewObjBlogPage.filter(function(item) {
                return item !== value;
            })
        }
    }

    var selectorBlog = ("[class*=box-content]");
    var Draw = 0;
    for (var i = 0; i < NewObjBlogPage.length; i++) {
        // Loop the broken link seeker in clicking on the posts in order
        await drawCanvas(page, selectorBlog, Draw, flagBlog);
        await page.waitFor(500);
        await removeCanvas(page, 'canvas', 0);
        if (i % 2 == 0) { // a conditional to keep the canvas containing the two links constant
            Draw++;
        }
        const link = NewObjBlogPage[i];
        await clickByText(page, link); // click on the link 
        await page.waitForNavigation({ waitUntil: 'load' });
        console.log("Current page:", page.url());
        await page.waitFor(1000);
        const hrefs = await page.$$eval('a', as => as.map(a => a.href)); // all link on the page
        for (var j = 0; j < hrefs.length; j++) {

            var someUrl = hrefs[j];
            urlExists(someUrl, function(exists) { // loop to check whether the link is broken
                console.log('"%s" exists?', someUrl, exists);
            });
            await page.waitFor(800);
        }
        await page.goto(pageUrlBlogPage, { waitUntil: 'load', timeout: 0 });

    }
})();

const escapeXpathString = str => {

    const splitedQuotes = str.replace(/'/g, `', "'", '`);
    return `concat('${splitedQuotes}', '')`;
};

const clickByText = async(page, text) => { // Click-to-text function
    const escapedText = escapeXpathString(text);
    const linkHandlers = await page.$x(`//a[contains(text(), ${escapedText})]`);
    if (linkHandlers.length > 0) {
        await linkHandlers[0].click();
    } else {
        throw new Error(`Link not found: ${text}`);
    }
};

const logErrorAndExit = err => {
    console.log(err);
    process.exit();
};

const urlExists = async(url, callback) => { // broken link check function
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            callback(xhr.status < 400);
        }
    };
    xhr.open('HEAD', url);
    xhr.send();
};

const drawCanvas = async(page, selector, i, flag) => {
    await page.evaluate((selector, i, flag) => {
        scrollTo(0, 0);

        var canvas = document.createElement('canvas'); // eslint-disable-line no-undef  
        const element = Array.from(document.querySelectorAll(selector));

        canvas.width = element[i].getBoundingClientRect().width;
        canvas.height = element[i].getBoundingClientRect().height;
        canvas.style.border = '5px solid #F00';
        canvas.style.left = element[i].getBoundingClientRect().x + 'px';
        canvas.style.top = element[i].getBoundingClientRect().y + 'px';
        canvas.style.zIndex = 1000;
        canvas.style.position = 'absolute';
        let body = document.getElementsByTagName('body')[0]; // eslint-disable-line no-undef
        body.appendChild(canvas);
        var h = element[i].getBoundingClientRect().y; // eslint-disable-line no-undef

        if (flag == 2) {
            h = h / 1.70;

        } else if (flag == 1) {

            if (i == 155 || i == 359) {
                h = h + 2;
            } else {
                h = h / 1.40;
            }
        } else if (flag == 3) {
            h = h / 1.90
        }

        scrollTo(0, h);

    }, selector, i, flag);
};

const removeCanvas = async(page, selector, j) => {
    await page.evaluate((selector, j) => {

        let element = Array.from(document.querySelectorAll(selector)); // eslint-disable-line no-undef        

        element[j].remove();

    }, selector, j);
};

const scrollTo = async(x, y) => {
    await page.evaluate((x, y) => {
        window.scrollTo(parseInt(x || 0, 10), parseInt(y || 0, 10));
    }, x, y);
};

const disableScroll = async() => {
    await page.evaluate(() => {
        var x = window.scrollX;
        var y = window.scrollY;
        window.onscroll = function() { window.scrollTo(x, y); };
    });
};

const enableScroll = async() => {
    await page.evaluate(() => {
        window.onscroll = function() {};
    });
}