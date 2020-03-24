const jsdom = require("jsdom");
const fs = require('fs');
const {ReportRenameAction} = require("./ReportRenameAction");
const {ReportGetTradesAction} = require("./ReportGetTradesAction");
const {ReportGetOperationsAction} = require("./ReportGetOperationsAction");
const {ReportGetCashFlowAction} = require("./ReportGetCashFlowAction");
const {SaveAccountDataAction} = require("./SaveAccountDataAction");
const {JSDOM} = jsdom;
const _ = require('lodash');
const {knex} = require("./db");

const ANALYZE_FILE_COUNT_LIMIT = 0;

function loadJsDom(filepath) {
    return JSDOM.fromFile(filepath);
}

function logCashFlows(cashFlows) {
    if (cashFlows && cashFlows.length) {

        cashFlows.sort((data1, data2) => {
            return +data1.reportName.substring(4) - +data2.reportName.substring(4);
        });

        // КвЮ-763585 должен быть первым в списке
        [cashFlows[0], cashFlows[1]] = [cashFlows[1], cashFlows[0]];

        for (let item of cashFlows) {
            console.log(`${item.reportName}\t${item.margin}\t${item.incoming}\t${item.outgoing}\t${item.currencies}`);
        }
    }
}

async function runAnalyzing() {
    const getFileList = (dirPath, recursively) =>
        _.flatten(fs.readdirSync(dirPath, {withFileTypes: true})
            .map(dirent => {
                const path = `${dirPath}/${dirent.name}`;
                return dirent.isDirectory()  ? getFileList(path, recursively) : path;
            })
        );

    let path = 'C:\\Users\\Ilya\\Work\\Работа\\мик 2019\\reports';
    path = path.split('\\').join('/');

    let files = getFileList(path, true).slice(-ANALYZE_FILE_COUNT_LIMIT);
    // console.log(files);

    const cashFlows = [];

    await knex('operations').del();
    await knex('trades').del();

    let fileNo = 0;
    // files = ['КлЮ-947014.html'];
    for (let filepath of files) {
        console.log(files.length - fileNo, filepath);
        fileNo += 1;

        let jsDom = await loadJsDom(filepath);

        new ReportRenameAction(jsDom, filepath).tryRun();

        let account = {};
        let reportGetCashFlowAction = new ReportGetCashFlowAction(jsDom, filepath);
        reportGetCashFlowAction.tryRun();
        account.name = reportGetCashFlowAction.reportName;

        account.cashFlow = new ReportGetCashFlowAction(jsDom).tryRun();
        account.trades = new ReportGetTradesAction(jsDom).tryRun();
        account.operations = new ReportGetOperationsAction(jsDom).tryRun();
        new SaveAccountDataAction(account).tryRun();

    }

    logCashFlows(cashFlows);
}

runAnalyzing().then(() => {
    console.log('done');
});



