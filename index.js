const jsdom = require("jsdom");
const fs = require('fs');
const {ReportRenameAction} = require("./ReportRenameAction");
const {ReportGetTradesAction} = require("./ReportGetTradesAction");
const {ReportGetCashFlowAction} = require("./ReportGetCashFlowAction");
const {JSDOM} = jsdom;

const ANALYZE_FILE_COUNT_LIMIT = 10;

const ENABLED_ACTIONS = {
    reportsRenaming: 1,
    tradesGetting: 1,
    cashFlowGetting: 1,
};

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
    const folder = 'C:\\Users\\Ilya\\Downloads\\мик 2019';
    const cashFlows = [];
    const files = fs.readdirSync(folder).slice(-ANALYZE_FILE_COUNT_LIMIT);

    let fileNo = 0;

    for (let file of files) {
        let filepath = `${folder}\\${file}`;
        let jsDom = await loadJsDom(filepath);

        if (ENABLED_ACTIONS.reportsRenaming) {
            new ReportRenameAction(jsDom, filepath).tryRun();
        }

        if (ENABLED_ACTIONS.cashFlowGetting) {
            let cashFlow = new ReportGetCashFlowAction(jsDom).tryRun();
            cashFlows.push(cashFlow);
        }

        if (ENABLED_ACTIONS.tradesGetting) {
            const trades = new ReportGetTradesAction(jsDom).tryRun();
        }

        console.log(files.length - fileNo, filepath);
        fileNo += 1;
    }

    logCashFlows(cashFlows);
}

runAnalyzing().then(() => {
    console.log('done');
});



