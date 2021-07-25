const fs = require("fs")

exports.run = async (PDFNet, jsonData, docxFilename) => {
    const options = new PDFNet.Convert.OfficeToPDFOptions();
    options.setTemplateParamsJson(JSON.stringify( jsonData));
	let buffer = fs.readFileSync(`${process.env.inputPath}${docxFilename}`);
	const buf = await PDFNet.Convert.office2PDFBuffer(buffer,options);
    const doc = await PDFNet.PDFDoc.createFromBuffer(buf);
    return doc
  };



