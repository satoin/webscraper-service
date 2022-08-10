import cheerio from 'cheerio';
import puppeteer from 'puppeteer';

// Default ENV parameters
const DEFAULT_PROD = parseInt(process.env.PROD) || false;

// initVirtualBrowser creates a Chromium browser instance via puppeteer and
// returns a promise that resolves the resulting browser with a initialized 
// page.
function initVirtualBrowser(prod = DEFAULT_PROD) {
    // Creates a async promise to initialize the browser instance.
    return new Promise(async (resolve, reject) => {
        // Set initial configuration and append the production configuration if 
        // needed.
        let config = { args: ['--disable-dev-shm-usage', '--disable-gpu'] }
        if (prod) {
            config.args.push('--no-sandbox');
            config.executablePath = '/usr/bin/chromium-browser';
        }

        try {
            // Init and resolve the new browser instance with a new page 
            // initialized.
            const browser = await puppeteer.launch(config); 
            const page = await browser.newPage();
            resolve({ browser, page });
        } catch (e) {
            reject(e);
        }
    });
}

// parseHTML finds the values received as argument in the rules parameter. The 
// rules must contains the following information:
//      - selector: The CSS element selector path.
//      - attr: The attribute name to extract. If attr is not provided, extracts
//        the the html value.
//      - multiple: To parse lists of elements. Default: false.
function parseHTML(html, rules) {
    // Load and parse html content with cheerio
    const $ = cheerio.load(html);

    // Iterate over rules items to find its value on html content
    const result = {}
    Object.keys(rules).forEach(param => {
        const ref = rules[param];

        // If rule item references multiple values, iterate overchilds of item 
        // selector getting its referenced attribute.
        if (ref.multiple) {
            result[param] = $(ref.selector).map(function() {
                let el = $(this);

                if (!!ref.attr) return el.attr(ref.attr)
                return (el.html() || "").trim()
            }).toArray();
        // Else, gets the attribute single value from current html element.
        } else {
            let el = $(ref.selector);
            if (!!ref.attr) result[param] = el.attr(ref.attr)
            else result[param] = (el.html() || "").trim()
        }
    });
    
    return result;
}

// singlePage inits a virtual browser to download the javascript rendered
// version of a single page and extract the params defined into the rules 
// provided. 
async function singlePage(url, rules = null) {
    // Init the virtual browser and compose the URL
    const { browser, page } = await initVirtualBrowser();

    // Navigate to the URL, get its HTML and parse it.
    await page.goto(url);
    const html = await page.content();
    const data = parseHTML(html, rules);

    // Close browser instance and return retrieved data.
    await browser.close();
    return data;
}

export { singlePage };