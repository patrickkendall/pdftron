exports.run = async (PDFNet,templateFileName,clientFileName) => {
    console.log('Pdf attach function started')
    const sampleDoc = await PDFNet.PDFDoc.createFromFilePath(  `${process.env.inputPath}${templateFileName}`);
    const clientDoc = await PDFNet.PDFDoc.createFromFilePath(  `${process.env.inputPath}${clientFileName}`);

    sampleDoc.initSecurityHandler();
    clientDoc.initSecurityHandler();

    const sampleDocIterator = await sampleDoc.getPageIterator();
    const clientDocIterator = await clientDoc.getPageIterator();

    console.log('Insert Dummy pages for stamping')
    const pageCount = await clientDoc.getPageCount();
    console.log('sampleDoc page count', pageCount)
    const stamper = await PDFNet.Stamper.create(PDFNet.Stamper.SizeType.e_relative_scale, 1, 0.9);
    const srcPage = await clientDoc.getPage(7);
    await srcPage.getCropBox();
    const media_box = await PDFNet.Rect.init(20, 20, 600.88, 800.69);
    await srcPage.setMediaBox(media_box);
    const pgSet = await PDFNet.PageSet.createRange(7, 7);
    console.log(pgSet)
    await stamper.stampPage(sampleDoc, srcPage, pgSet);
    return sampleDoc
    //await sampleDoc.save(  'pdfAttached1.pdf', PDFNet.SDFDoc.SaveOptions.e_linearized);
}
