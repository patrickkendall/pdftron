const pdfAttacher = require('./handlers/pdf_attacher');
const saveDoc = require('./handlers/savePDFDoc');



exports.generateReport =async ()=>{
    console.log('PDF report generator started')
    let marketAnalysisDoc = await pdfAttacher.runStamper('stamp.pdf','main.pdf')
   // await saveDoc.run(marketAnalysisDoc)
    console.log('Report finished')
}

exports.generateReport();