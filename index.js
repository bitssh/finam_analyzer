const jsdom = require("jsdom");
const fs = require('fs');
const {ReportRenameAction} = require("./ReportRenameAction");
const {ReportGetTradesAction} = require("./ReportGetTradesAction");
const {ReportGetCashFlowAction} = require("./ReportGetCashFlowAction");
const {JSDOM} = jsdom;
const folder = 'C:\\Users\\Ilya\\Downloads\\мик 2019';
const cashFlows = [];
const files = fs.readdirSync(folder);

function loadJsDom(filepath) {
    return JSDOM.fromFile(filepath);
}

async function getStats() {
    let fileNo = 0;

    for (let file of files) {
        console.log(files.length - fileNo, file);
        fileNo += 1;

        if (fileNo === 10) {
            break;
        }

        let filepath = `${folder}\\${file}`;
        let jsDom = await loadJsDom(filepath);

        new ReportRenameAction(jsDom, filepath).run();

        // let cashFlow = new ReportGetCashFlowAction(jsDom, filepath).run();
        // cashFlows.push(cashFlow);

        const trades = new ReportGetTradesAction(jsDom).run();
        if (trades.length) {
            console.log(trades);
        }
    }

    if (cashFlows) {

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

getStats().then(() => {
    console.log('done');
});



