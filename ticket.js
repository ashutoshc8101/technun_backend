const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();

doc.pipe(fs.createWriteStream('ticket_id.pdf'))

doc.font('fonts/Montserrat.ttf')
  .fontSize(25)
  .text('Technunctus')

doc.font('fonts/Montserrat.ttf')
  .fontSize(20)
  .text('Ashutosh Chauhan')

doc.save()

doc.end()
