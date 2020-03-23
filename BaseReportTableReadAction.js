const {BaseReportAction} = require('./BaseReportAction');
const _ = require('lodash');

class BaseReportTableReadAction extends BaseReportAction {

    constructor(...args) {
        super(...args);
        this.tableNode = this.getReportTableNode(this.getTableCaptionNodeText());
        this.recordFields = this.getRecordFieldNames();
        this.recordFieldsFloat = this.getFloatRecordFieldNames();
    }
    getTableCaptionNodeText() {
        throw new Error('getTableCaptionNodeText method must be implemented');
    }
    getRecordFieldNames() {
        throw new Error('getRecordFieldNames method must be implemented');
    }
    getReportTableNode (tableCaption) {
        const captionNode = this.getReportNode(`/html/body/*[text()="${tableCaption}"]`);
        return _.get(captionNode, 'nodes[0].nextSibling');
    }
    validateTable() {
        if (!this.tableNode) {
            throw new Error('table not found');
        }
    }
    getColIndex (columnName) {
        return this.recordFields.findIndex((column) => column === columnName);
    }
    getRowCellValue(rowNode, columnName) {
        const cell = rowNode.cells[this.getColIndex(columnName)];
        let result = cell ? cell.textContent.trim() : null;
        if (result && this.recordFieldsFloat.includes(columnName)) {
            result = this.parseFloatValue(result);
        }
        return result;
    }
    readRow (row) {
        const record = {};
        for (let column of this.recordFields) {
            record[column] = this.getRowCellValue(row, column);
        }
        return {record};
    }
    run() {
        this.validateTable();
        const records = [];
        for (let i = 1; i < this.tableNode.rows.length; i += 1) {
            let { record, doBreak } = this.readRow(this.tableNode.rows[i]);
            if (doBreak) break;
            records.push(record);
        }
        return records;

    }
}

exports.BaseReportTableReadAction = BaseReportTableReadAction;
