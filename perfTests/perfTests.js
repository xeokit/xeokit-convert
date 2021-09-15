#!/usr/bin/env node

const httpServer = require('http-server');
const convert2xkt = require("../dist/convert2xkt.cjs.js");
const fs = require('fs');
const rimraf = require("rimraf");
const path = require("path");
const puppeteer = require('puppeteer');
const package = require('../package.json');

const config = JSON.parse(fs.readFileSync("./perfTests/perfTests.config.json"));

const firefoxOptions = {
    product: 'firefox',
    extraPrefsFirefox: {
        // Enable additional Firefox logging from its protocol implementation
        // 'remote.log.level': 'Trace',
    },
    dumpio: true,
    headless: false,
    args: [`--window-size=${config.screenshotSize[0]},${config.screenshotSize[1]}`, '--disable-infobars'],
    defaultViewport: {
        width: config.screenshotSize[0],
        height: config.screenshotSize[1]
    }
};

const chromeOptions = {
    product: 'chrome',
    headless: false,
    args: [`--window-size=${config.screenshotSize[0]},${config.screenshotSize[1]}`, '--disable-infobars'],
    defaultViewport: {
        width: config.screenshotSize[0],
        height: config.screenshotSize[1]
    }
};

performanceTest().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});

async function performanceTest() {

    console.log("[perfTests] Beginning performance test");

    const testStats = {
        convert2xkt: package.version,
        xeokit: package.devDependencies["@xeokit/xeokit-sdk"],
        modelStats: {}
    };

    convertModels(testStats).then(() => {
        testModels(testStats).then(() => {
            const statsMarkdown = statsToMarkdown(testStats);
            fs.writeFileSync("perfTestResults.json", JSON.stringify(testStats, null, "\t"));
            fs.writeFileSync(config.testReportPath, statsMarkdown);
            console.log("[perfTests] Finished performance test.");
            process.exit(0);
        }, (err) => {
            console.log("[perfTests] ERROR:" + err + "\n");
            process.exit(-1);
        });
    })
}

function convertModels(testStats) {

    return new Promise(function (resolve, reject) {

        console.log("[perfTests] Begin converting models to XKT..");

        const modelStats = testStats.modelStats;

        rimraf.sync(config.outputDir);

        fs.mkdirSync(config.outputDir);

        let i = 0;

        function next() {

            const fileInfo = config.sourceFiles[i];
            const modelId = fileInfo.modelId;
            const modelSrc = fileInfo.modelSrc;
            const metaModelSrc = fileInfo.metaModelSrc;
            const xktDest = `${config.outputDir}/${modelId}/model.xkt`;
            const objectPropsDest = "";

            console.log(`\n[perfTests] Converting ${modelId}\n`);

            fs.mkdirSync(`${config.outputDir}/${modelId}`);

            const stats = {
                modelSrc: modelSrc
            };

            if (metaModelSrc) {
                stats.metaModelSrc = metaModelSrc;
            }

            stats.xktDest = xktDest;

            modelStats[modelId] = stats;

            convert(modelSrc, metaModelSrc, xktDest, objectPropsDest, stats).then(() => {
                    i++;
                    if (i < config.sourceFiles.length) {
                        next();
                    } else {
                        console.log("[perfTests] Finished converting models to XKT.");
                        resolve();
                    }
                },
                (errMsg) => {
                    reject(errMsg);
                });
        }

        next();
    });
}

function convert(modelSrc, metaModelSrc, xktDest, objectPropsDest, stats) {
    const xktDestDir = path.dirname(xktDest);
    if (config.enableoutputPropertySets) {
        const objectPropsDir = `${xktDestDir}/props/`;
        if (!fs.existsSync(objectPropsDir)) {
            fs.mkdirSync(objectPropsDir);
        }
    }
    return convert2xkt({
        source: modelSrc,
        metaModelSource: metaModelSrc,
        outputXKTModel: async function (xktModel) {
        },
        outputXKT: async function (xktData) {
            fs.writeFileSync(xktDest, xktData);
        },
        outputPropertySets: config.enableoutputPropertySets ? async function (id, props) {
            await fs.writeFileSync(`${objectPropsDir}/${id}.json`, JSON.stringify(props, null, "\t"));
        } : null,
        stats,
        log: (msg) => {
            console.log(msg)
        }
    });
}

async function testModels(testStats) {

    console.log("[perfTests] Begin testing XKT models in xeokit..");

    let server = httpServer.createServer();
    server.listen(config.serverPort);

    const modelStats = testStats.modelStats;

    for (let i = 0, len = config.sourceFiles.length; i < len; i++) {
        const fileInfo = config.sourceFiles[i];
        const modelId = fileInfo.modelId;
        const stats = modelStats[modelId];
        if (!stats) {
            continue;
        }
        const xktDest = stats.xktDest;
        if (!xktDest) {
            continue;
        }

        const screenshotDir = `${config.outputDir}/${modelId}/screenshot`;
        const screenshotPath = `${screenshotDir}/screenshot.png`;
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir);
        }

        //const browser = await puppeteer.launch(chromeOptions);
        const browser = await puppeteer.launch(firefoxOptions);
        const page = await browser.newPage();
        if (!testStats.browserVersion) {
            testStats.browserVersion = await page.browser().version();
        }
        await page.setDefaultNavigationTimeout(60000000);
        await page.goto(`http://localhost:${config.serverPort}/perfTests/perfTestXKT.html?xktSrc=../${xktDest}`);
        await page.waitForSelector('#percyLoaded')
        const element = await page.$('#percyLoaded')
        const value = await page.evaluate(el => el.innerText, element)
        const pageStats = JSON.parse(value);
        await page.screenshot({path: screenshotPath});
        await page.close();
        await browser.close();
        stats.loadingTime = pageStats.loadingTime;
        stats.fps = pageStats.fps;
        stats.screenshot = "screenshot.png";
    }
    server.close();

    console.log("[perfTests] Finished testing XKT models in xeokit.");
}

function statsToMarkdown(testStats) {
    const modelStats = testStats.modelStats;
    const rows = [];
    rows.push("## convert2xkt Performance Tests");
    rows.push("\n");
    const dateFormat = new Date();
    rows.push(dateFormat.getDate() + ' / ' + dateFormat.getMonth() + ' / ' + dateFormat.getFullYear());
    rows.push("---");
    rows.push("## Notes");
    rows.push("\n");
    rows.push(`* convert2xkt ${testStats.convert2xkt}`);
    rows.push(`* xeokit-sdk ${testStats.xeokit}`);
    rows.push(`* ${testStats.browserVersion}`);
    rows.push("* Positive value for compression ratio is good, negative value not so good.");
    rows.push("* Click thumbnails to view models with xeokit.");
    rows.push("\n");
    rows.push("## Results");
    rows.push("\n");
    rows.push('| Screenshot | Source | Convert Secs | Load Secs | FPS | Objects | Triangles | Vertices | Source kB | XKT kB | Compression |');
    rows.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
    for (let modelId in modelStats) {
        const stats = modelStats[modelId];
        rows.push(`| [![](https://xeokit.github.io/xeokit-convert/assets/models/xkt/${modelId}/screenshot/screenshot.png)](https://xeokit.github.io/xeokit-convert/demos/demoXKT.html?xktSrc=../${stats.xktDest}) | [${modelId}](https://xeokit.github.io/xeokit-convert/demos/demoXKT.html?xktSrc=../${stats.xktDest}) | ${stats.conversionTime} secs | ${stats.loadingTime} secs | ${stats.fps} FPS | ${stats.numObjects} | ${stats.numTriangles} | ${stats.numVertices} | ${stats.sourceSize} Kb | ${stats.xktSize} Kb | ${stats.compressionRatio} |`);
    }
    return rows.join("\n");
}

