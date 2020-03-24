const {BaseReportAction} = require('./BaseReportAction');
const _ = require('lodash');

function getCellValue(cell) {
    return cell ? cell.textContent.trim() : null;
}

class BaseReportTableReadAction extends BaseReportAction {

    constructor(...args) {
        super(...args);
        this.tableNode = this.getReportTableNode(this.getTableCaptionNodeText());
        this.fieldsMeta = this.getFieldsMeta();
    }
    getTableCaptionNodeText() {
        throw new Error('getTableCaptionNodeText method must be implemented');
    }
    getFieldsMeta() {
        throw new Error('getHeaderMeta method must be implemented');
    }
    getReportTableNode (tableCaption) {
        const captionNode = this.getReportNode(`/html/body/*[text()="${tableCaption}"]`);
        return _.get(captionNode, 'nodes[0].nextSibling');
    }
    validateTable() {
        // if (!this.tableNode) {
        //     throw new Error('table not found');
        // }
    }
    getColIndex (columnName) {
        return this.recordFields.findIndex((column) => column === columnName);
    }
    readRow (row) {
        const result = {};
        for (let column of this.recordFields) {
            result[column] = this.getRowCellValue(row, column);
        }
        return result;
    }
    run() {
        this.validateTable();
        if (!this.tableNode)
            return [];

        return this.readRows(this.getHeaderMeta());
    }

    getHeaderMeta() {
        const headerCaptions = Array.from(this.tableNode.rows[0].cells)
            .map(cell => getCellValue(cell).replace(/\s+/g, ' '));

        const fieldsMeta = Object.assign({}, this.fieldsMeta);
        _.each(fieldsMeta, fieldMeta => {
            fieldMeta.columnIndex = headerCaptions.findIndex(caption => caption.startsWith(fieldMeta.columnName));
            if (fieldMeta.columnIndex === -1 && !fieldMeta.optional) {
                throw new Error(`required column "${fieldMeta.columnName}" not found`);
            }
        });
        return fieldsMeta;
    }

    readRows(headerMeta) {
        const records = [];
        let value;
        _.each(this.tableNode.rows, row => {
            let record = {};
            if (row.rowIndex === 0) {
                return;
            }
            _.each(headerMeta, (columnMeta, key) => {
                if (columnMeta.columnIndex === -1)
                    return;
                value = getCellValue(row.cells[columnMeta.columnIndex]);
                if (columnMeta.numeric) {
                    value = value ? this.parseFloatValue(value) : 0;
                }
                record[key] = value;

                if (columnMeta.columnIndex === 0) {
                    if (value) {
                        records.push(record);
                    } else
                        return false;
                }
            });


        });
        return records;
    }
}

exports.BaseReportTableReadAction = BaseReportTableReadAction;
