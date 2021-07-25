const express = require('express');
const cors = require("cors");

const app = express();
app.use(cors({ origin: '*' }));
app.use(cors({ credentials: true }));
app.options("*", cors());
const fs = require('fs');
const path = require('path')

const { PDFNet } = require('@pdftron/pdfnet-node'); 
const docxFiller = require('./helpers/docxFiller');

const pdfAttacher = require('./helpers/pdfAttacher');
const saveDoc = require('./helpers/savePDF');

process.env.inputPath = './files/'
process.env.outputPath = './'

app.use(express.json());

app.get('/', (req, res) => {
    res.send('This is eProLend-CreditMemo PDF Generation API');
});


//This merges a PDF inside the credit memo.
app.post('/PDFTronMerge', async (req, res) => {
    const creditMemoJson = req.body;
    try {
        const merge = async () => {
          try {
              await PDFNet.startDeallocateStack();
              let docxFilledDoc = await docxFiller.run(PDFNet,req.body,'creditMemo.docx');
              let pdfAttachedDoc1 = await pdfAttacher.run(PDFNet,'creditMemo.pdf','newsletter.pdf');
              //let pdfAttachedDoc2 = await pdfAttacher.run(PDFNet,'stamp.pdf','main.pdf');
              await saveDoc.runv3(PDFNet,[docxFilledDoc,pdfAttachedDoc1],'finalOutput.pdf')
              await PDFNet.endDeallocateStack();
              } catch (err) {
                  console.log(err);
              }
            };
            PDFNet.runWithCleanup(merge).catch(function(error){console.log('Error: ' + JSON.stringify(error));}).then(function(){PDFNet.shutdown();});
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong: ' + err });
    }
});

//This places images inside the credit memo
app.post('/PDFTronAddImage', (req, res) => {
    let jsonData = {
        "date": "22-July-20201"
        ,"username": "Capture Risk Dev"
        ,"billed_items": {"insert_rows": [["Wireless", "", "$42.34"], ["Long Distance", "", "$12.55"], ["Data", "", "$14.89"]]}
        ,"site_image":{"image_url":"./files/siteImage.jpeg", "width":400, "height":500}
      ,"appraisal_image":{"image_url":"./files/minions_banana_alpha.png", "width":440, "height":440}
    
    }
    process.env.inputPath = './files/'
    process.env.outputPath = './'
    const main = async () => {
        try {
            await PDFNet.startDeallocateStack();
            let docxFilledDoc = await docxFiller.run(PDFNet,jsonData,'document2.docx');
            let pdfAttachedDoc1 = await pdfAttacher.run(PDFNet,'dummyTitle.pdf','newsletter.pdf');
            //let pdfAttachedDoc2 = await pdfAttacher.run(PDFNet,'stamp.pdf','main.pdf');
            await saveDoc.runv3(PDFNet,[docxFilledDoc,pdfAttachedDoc1],'finalOutput.pdf')
           await PDFNet.endDeallocateStack();
        } catch (err) {
            console.log(err);
        }
      };
      PDFNet.runWithCleanup(main).catch(function(error){console.log('Error: ' + JSON.stringify(error));}).then(function(){PDFNet.shutdown();});
})

//This fills the parameters inside the credit memo
app.post('/PDFTronFill' , (req, res) => {
        try {
            const fill = async () => {
                try {
                    const inputPath = path.resolve(__dirname, './output/creditMemo.pdf');
                    const outputPath = path.resolve(__dirname, './output/creditMemoReplaced.pdf');
                    const replaceText = async () => {
                        const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
                        await pdfdoc.initSecurityHandler();
                        const replacer = await PDFNet.ContentReplacer.create();
                        const page = await pdfdoc.getPage(2)
                        await replacer.addString('loanGenericDetails.borrower', req.body.loanGenericDetails.borrower)
                        await replacer.process(page);
                        pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized)
                        console.log("here")
                    }
                
                        PDFNet.runWithCleanup(replaceText).then(() => {
                            fs.readFile(outputPath, (err, data) => {
                                if (err) {
                                    res.statusCode = 500
                                    res.end(err)
                                } else {
                                    res.setHeader('ContentType', 'application/pdf')
                                    res.end(data)
                                }
                            })
                        }).catch(err => {
                            res.statusCode = 500;
                            res.end(err)
                        })
                } catch(err) {
                    console.log(err)
                }
              };
              PDFNet.runWithCleanup(fill).catch(function(error){console.log('Error: ' + JSON.stringify(error));}).then(function(){PDFNet.shutdown();});
        } catch (err) {
            console.error(err);
            res.status(500).json({ err: 'Something went wrong: ' + err });
        }
    }
)

app.listen(4000, () => {
    console.log("Server is running on port 4000.")
})

