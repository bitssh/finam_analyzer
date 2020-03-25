const jsdom = require("jsdom");
const fs = require('fs');
const {ReportRenameAction} = require("./ReportRenameAction");
const {ReportGetTradesAction} = require("./ReportGetTradesAction");
const {ReportGetOperationsAction} = require("./ReportGetOperationsAction");
const {ReportGetCashFlowAction} = require("./ReportGetCashFlowAction");
const {CombinedAccountsDataSaver} = require("./CombinedAccountsDataSaver");
const {JSDOM} = jsdom;
const _ = require('lodash');

const ANALYZE_FILE_COUNT_LIMIT = 0;

function loadJsDom(filepath) {
    return JSDOM.fromFile(filepath);
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

    const accounts = [];
    let fileNo = 0;
    for (let filepath of files) {
        console.log(files.length - fileNo, filepath);
        fileNo += 1;

        let jsDom = await loadJsDom(filepath);

        new ReportRenameAction(jsDom, filepath).tryRun();

        let account = {};
        let reportGetCashFlowAction = new ReportGetCashFlowAction(jsDom);
        account.cashFlow = reportGetCashFlowAction.tryRun();
        account.name = reportGetCashFlowAction.reportName;

        account.trades = new ReportGetTradesAction(jsDom).tryRun();
        account.operations = new ReportGetOperationsAction(jsDom).tryRun();
        accounts.push(account);
    }
    return accounts;
}

runAnalyzing().then((accounts) => {
    new CombinedAccountsDataSaver(accounts).run().then(() => {
        console.log('done');
    });

});



