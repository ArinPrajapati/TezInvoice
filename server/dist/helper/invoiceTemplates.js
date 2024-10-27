"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdfmake_1 = __importDefault(require("pdfmake"));
const fs_1 = __importDefault(require("fs"));
const fonts = {
    Roboto: {
        normal: "./font/Roboto-Regular.ttf",
        bold: "./font/Roboto-Bold.ttf",
        italics: "./font/Roboto-Italic.ttf",
        bolditalics: "./font/Roboto-BoldItalic.ttf",
    },
};
const printer = new pdfmake_1.default(fonts);
class InvoiceMaker {
    constructor(invoice) {
        this.invoice = invoice;
        this.fileName = `invoice-${invoice._id}.pdf`;
    }
    headerType1() {
        return { text: this.invoice.serviceName, style: "companyHeader" };
    }
    headerType2() {
        return { text: "INVOICE", style: "invoiceTitle", margin: [0, 10, 0, 30] };
    }
    headerType3() {
        return {
            columns: [
                { text: "Invoice", style: "invoiceTitle" },
                { text: `Invoice ID: ${this.invoice._id}`, style: "subheader" },
            ],
            margin: [0, 10, 0, 30],
        };
    }
    clientInfoType1() {
        return [
            { text: `Client: ${this.invoice.clientInfo.name}`, style: "subheader" },
            { text: `Email: ${this.invoice.clientInfo.email}` },
            { text: `Address: ${this.invoice.clientInfo.address}` },
        ];
    }
    clientInfoType2() {
        return [
            {
                text: `Client Name: ${this.invoice.clientInfo.name}`,
                style: "subheader",
            },
            { text: `Client Email: ${this.invoice.clientInfo.email}` },
            {
                text: `Client Address: ${this.invoice.clientInfo.address}`,
                margin: [0, 0, 0, 20],
            },
        ];
    }
    clientInfoType3() {
        return [
            {
                text: "Client Information",
                style: "subheader",
                margin: [0, 0, 0, 5],
            },
            { text: `Name: ${this.invoice.clientInfo.name}` },
            { text: `Email: ${this.invoice.clientInfo.email}` },
            {
                text: `Address: ${this.invoice.clientInfo.address}`,
                margin: [0, 0, 0, 20],
            },
        ];
    }
    tableType1() {
        return {
            table: {
                headerRows: 1,
                widths: ["*", "auto", "auto", "auto"],
                body: [
                    [
                        { text: "Description", style: "tableHeader" },
                        { text: "Quantity", style: "tableHeader", alignment: "center" },
                        { text: "Price", style: "tableHeader", alignment: "right" },
                        { text: "Subtotal", style: "tableHeader", alignment: "right" },
                    ],
                    ...this.invoice.items.map((item) => [
                        item.description,
                        { text: item.quantity, alignment: "center" },
                        { text: `$${item.price.toFixed(2)}`, alignment: "right" },
                        { text: `$${item.subtotal.toFixed(2)}`, alignment: "right" },
                    ]),
                    [
                        {
                            text: "Total Amount",
                            colSpan: 3,
                            alignment: "right",
                            bold: true,
                        },
                        {},
                        {},
                        {
                            text: `$${this.invoice.totalAmount.toFixed(2)}`,
                            alignment: "right",
                            bold: true,
                        },
                    ],
                ],
            },
            layout: "lightHorizontalLines",
        };
    }
    tableType2() {
        return {
            table: {
                headerRows: 1,
                widths: ["*", "auto", "auto", "auto"],
                body: [
                    [
                        { text: "Description", style: "tableHeader" },
                        { text: "Quantity", style: "tableHeader", alignment: "center" },
                        { text: "Unit Price", style: "tableHeader", alignment: "right" },
                        { text: "Total Price", style: "tableHeader", alignment: "right" },
                    ],
                    ...this.invoice.items.map((item) => [
                        item.description,
                        { text: item.quantity, alignment: "center" },
                        { text: `$${item.price.toFixed(2)}`, alignment: "right" },
                        { text: `$${item.subtotal.toFixed(2)}`, alignment: "right" },
                    ]),
                ],
            },
            layout: {
                fillColor: (rowIndex) => rowIndex % 2 === 0 ? "#f3f3f3" : null,
            },
        };
    }
    tableType3() {
        return {
            table: {
                headerRows: 1,
                widths: ["auto", "*", "auto", "auto"],
                body: [
                    [
                        { text: "#", style: "tableHeader", alignment: "center" },
                        { text: "Item", style: "tableHeader" },
                        { text: "Price", style: "tableHeader", alignment: "right" },
                        { text: "Subtotal", style: "tableHeader", alignment: "right" },
                    ],
                    ...this.invoice.items.map((item, index) => [
                        { text: index + 1, alignment: "center" },
                        item.description,
                        { text: `$${item.price.toFixed(2)}`, alignment: "right" },
                        { text: `$${item.subtotal.toFixed(2)}`, alignment: "right" },
                    ]),
                ],
            },
            layout: "noBorders",
        };
    }
    footerType1() {
        return {
            text: "Thank you for your business!",
            alignment: "center",
            margin: [0, 20, 0, 0],
        };
    }
    footerType2() {
        return {
            text: "Thank you for your business!",
            alignment: "center",
            margin: [0, 20, 0, 0],
        };
    }
    footerType3() {
        return {
            text: "Thank you for your business!",
            alignment: "center",
            margin: [0, 20, 0, 0],
        };
    }
    generatePDF(headerType, clientInfoType, tableType, footerType, fileName) {
        const dir = "./public/pdf";
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        const docDefinition = {
            content: [
                this[headerType](),
                { text: "Client Information", margin: [0, 20, 0, 10] },
                ...this[clientInfoType](),
                { text: "Job Description", style: "subheader", margin: [0, 20, 0, 10] },
                { text: this.invoice.jobDescription },
                { text: "Items", style: "subheader", margin: [0, 20, 0, 10] },
                this[tableType](),
                this[footerType](),
            ],
            styles: {
                companyHeader: {
                    fontSize: 22,
                    bold: true,
                    color: "#333",
                    alignment: "center",
                    margin: [0, 0, 0, 30],
                },
                invoiceTitle: {
                    fontSize: 26,
                    bold: true,
                    alignment: "center",
                    color: "#333",
                },
                subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
                tableHeader: {
                    bold: true,
                    fontSize: 12,
                    color: "black",
                    fillColor: "#f3f3f3",
                    margin: [0, 5],
                },
            },
            defaultStyle: {
                font: "Roboto",
                fontSize: 12,
                color: "#333",
            },
        };
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs_1.default.createWriteStream(`./public/pdf/${fileName}`, { flags: "w" }));
        pdfDoc.end();
    }
}
class InvoiceHelper {
    constructor(invoiceData) {
        this.invoiceData = invoiceData;
        this.invoiceMaker = new InvoiceMaker(invoiceData);
    }
    getCombination(headerType, clientInfoType, tableType, footerType) {
        const headerMap = {
            1: "headerType1",
            2: "headerType2",
            3: "headerType3",
        };
        const clientInfoMap = {
            1: "clientInfoType1",
            2: "clientInfoType2",
            3: "clientInfoType3",
        };
        const tableMap = {
            1: "tableType1",
            2: "tableType2",
            3: "tableType3",
        };
        const footerMap = {
            1: "footerType1",
            2: "footerType2",
            3: "footerType3",
        };
        this.invoiceMaker.generatePDF(headerMap[headerType], clientInfoMap[clientInfoType], tableMap[tableType], footerMap[footerType], this.invoiceMaker.fileName);
    }
    generateAllCombinations() {
        for (let headerType = 1; headerType <= 3; headerType++) {
            for (let clientInfoType = 1; clientInfoType <= 3; clientInfoType++) {
                for (let tableType = 1; tableType <= 3; tableType++) {
                    for (let footerType = 1; footerType <= 3; footerType++) {
                        this.getCombination(headerType, clientInfoType, tableType, footerType);
                    }
                }
            }
        }
    }
}
exports.default = InvoiceHelper;
