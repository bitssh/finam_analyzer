const {BaseReportAction} = require('./BaseReportAction');

const path = require('path');
const fs = require('fs');

class ReportRenameAction extends BaseReportAction {
    constructor(jsDom, filepath) {
        super(jsDom);
        this.filepath = filepath;
    }
    run() {
        const dir = path.dirname(this.filepath);
        const newFileExt = '.html';
        fs.renameSync(this.filepath, `${dir}\\${this.reportName}${newFileExt}`);
    }
}

exports.ReportRenameAction = ReportRenameAction;
