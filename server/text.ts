import PdfPrinter from "pdfmake";
import { Alignment } from "pdfmake/interfaces";
import fs from "fs";
import { Invoice } from "./src/types"; // Assuming Invoice is properly defined in types

// Define fonts for PDFMake
const fonts = {
  Roboto: {
    normal: "./font/Roboto-Regular.ttf",
    bold: "./font/Roboto-Bold.ttf",
    italics: "./font/Roboto-Italic.ttf",
    bolditalics: "./font/Roboto-BoldItalic.ttf",
  },
};

const printer = new PdfPrinter(fonts);

// Define the InvoiceMaker class
class InvoiceMaker {
  invoice: Invoice;

  constructor(invoice: Invoice) {
    this.invoice = invoice;
  }

  headerType1() {
    return { text: "Your Company Name", style: "companyHeader" };
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
        fillColor: (rowIndex: number) =>
          rowIndex % 2 === 0 ? "#f3f3f3" : null,
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

  [key: string]: any;

  generatePDF(
    headerType: string,
    clientInfoType: string,
    tableType: string,
    footerType: string,
    fileName: string
  ) {
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

    const pdfDoc = printer.createPdfKitDocument(docDefinition as any);
    pdfDoc.pipe(fs.createWriteStream(`./invoice/${fileName}`));
    pdfDoc.end();
  }
}

// Define the InvoiceHelper class
class InvoiceHelper {
  invoiceData: Invoice;
  invoiceMaker: InvoiceMaker;

  constructor(invoiceData: Invoice) {
    this.invoiceData = invoiceData;
    this.invoiceMaker = new InvoiceMaker(invoiceData);
  }

  // Helper function to map combinations
  getCombination(
    headerType: number,
    clientInfoType: number,
    tableType: number,
    footerType: number
  ) {
    const headerMap: { [key: number]: string } = {
      1: "headerType1",
      2: "headerType2",
      3: "headerType3",
    };

    const clientInfoMap: { [key: number]: string } = {
      1: "clientInfoType1",
      2: "clientInfoType2",
      3: "clientInfoType3",
    };

    const tableMap: { [key: number]: string } = {
      1: "tableType1",
      2: "tableType2",
      3: "tableType3",
    };

    const footerMap: { [key: number]: string } = {
      1: "footerType1",
      2: "footerType2",
      3: "footerType3",
    };

    this.invoiceMaker.generatePDF(
      headerMap[headerType],
      clientInfoMap[clientInfoType],
      tableMap[tableType],
      footerMap[footerType],
      this.getFileName(headerType, clientInfoType, tableType, footerType)
    );
  }

  // Generate a file name based on combination
  getFileName(
    headerType: number,
    clientInfoType: number,
    tableType: number,
    footerType: number
  ) {
    return `invoice_header${headerType}_clientInfo${clientInfoType}_table${tableType}.pdf`;
  }

  // Generate all combinations of invoices
  generateAllCombinations() {
    for (let headerType = 1; headerType <= 3; headerType++) {
      for (let clientInfoType = 1; clientInfoType <= 3; clientInfoType++) {
        for (let tableType = 1; tableType <= 3; tableType++) {
          for (let footerType = 1; footerType <= 3; footerType++) {
            this.getCombination(
              headerType,
              clientInfoType,
              tableType,
              footerType
            );
          }
        }
      }
    }
  }
}

export default InvoiceHelper;

const invoiceData: Invoice = {
  _id: "123456789",
  clientInfo: {
    name: "John Doe",
    email: "john@example.com",
    address: "123 Main St, Anytown, USA",
  },
  items: [
    { description: "Website Design", quantity: 1, price: 500, subtotal: 500 },
    { description: "Hosting (1 year)", quantity: 1, price: 100, subtotal: 100 },
  ],
  jobDescription: "Website development and hosting services.",
  totalAmount: 600,
  dueDate: new Date(),
  ownerEmail: "john@example.com",
  ownerName: "John Doe",
  serviceName: "Website Development",
  status: "unpaid",
  userId: "123456789",
  createdAt: new Date(),
  paymentLink: "https://example.com/payments/123456789",
  updatedAt: new Date(),
};
const invoiceMaker = new InvoiceHelper(invoiceData);

invoiceMaker.getCombination(1, 2, 3, 1);
