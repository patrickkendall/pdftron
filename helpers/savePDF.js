const { PDFNet } = require('@pdftron/pdfnet-node'); 

exports.run = async (PDFNet, docs, outFileName) => {
  
  const newDoc = docs[0]
  let currentPageCount = await newDoc.getPageCount();
  let currentPage = 1;
  docs.forEach(async (doc)=>{
    if(currentPage!=1){
      console.log('Page Count')
      currentPageCount = await doc.getPageCount();
      console.log('Page Count2',currentPage, currentPageCount,newDoc,doc)
      await newDoc.insertPages(currentPage, doc, 1, currentPageCount, PDFNet.PDFDoc.InsertFlag.e_none);
    }
    currentPage += 1;
  })

  await newDoc.save(outFileName, PDFNet.SDFDoc.SaveOptions.e_remove_unused);
};

exports.runv2 = async (PDFNet, docs, outFileName) => {
  
  const newDoc = await PDFNet.PDFDoc.create();
  newDoc.initSecurityHandler();

  let currentPage = 1;
  currentPageCount = await docs[0].getPageCount();
  console.log(currentPage, currentPageCount, docs[0])
  await newDoc.insertPages(currentPage, docs[0], 1, currentPageCount, PDFNet.PDFDoc.InsertFlag.e_none);

  currentPage += currentPageCount;
  currentPageCount = await docs[1].getPageCount();
  console.log(currentPage, currentPageCount, docs[1]);
  await newDoc.insertPages(currentPage, docs[1], 1, currentPageCount, PDFNet.PDFDoc.InsertFlag.e_none);
  await newDoc.save(outFileName, PDFNet.SDFDoc.SaveOptions.e_remove_unused);
};


exports.runv3 = async (PDFNet, docs, outFileName) => {
  let noDocuments = docs.length;
  let currentPage = 1;
  const newDoc = await PDFNet.PDFDoc.create();
  newDoc.initSecurityHandler();

  for (let i = 0; i < noDocuments; ++i) {
    const currDoc = docs[i]
    const currentPageCount = await currDoc.getPageCount();
    newDoc.insertPages(currentPage, currDoc, 1, currentPageCount, PDFNet.PDFDoc.InsertFlag.e_none);
    currentPage += currentPageCount;
  }

  await newDoc.save(outFileName, PDFNet.SDFDoc.SaveOptions.e_remove_unused);
};
