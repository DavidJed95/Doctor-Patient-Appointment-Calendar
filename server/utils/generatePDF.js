const PDFDocument = require('pdfkit');

const generatePDF = (data, title) => {
  const doc = new PDFDocument({ size: 'A4' });

  // Add Title
  doc.fontSize(20).text(title, { align: 'center' });

  // Space out after the title
  doc.moveDown(2);

  // Function to check and handle page breaks
  const checkPageBreak = () => {
    if (doc.y > 800) {
      doc.addPage();
    }
  };

  // Add Table Headers
  doc.fontSize(12).text('User Name', 50, doc.y);
  doc.text('Specialist Name', 200, doc.y);
  doc.text('Specialization', 350, doc.y);
  doc.text('Start Time', 450, doc.y);
  doc.text('End Time', 550, doc.y);
  doc.text('Date', 650, doc.y);
  doc.text('Treatment Name', 750, doc.y);

  doc.moveDown(1);
  checkPageBreak();

  // Add Data Rows
  for (let record of data) {
    doc.text(`${record.userFirstName} ${record.userLastName}`, 50, doc.y);
    doc.text(
      `${record.specialistFirstName} ${record.specialistLastName}`,
      200,
      doc.y,
    );
    doc.text(record.Specialization, 350, doc.y);
    doc.text(record.StartTime, 450, doc.y);
    doc.text(record.EndingTime, 550, doc.y);
    doc.text(record.Date, 650, doc.y);
    doc.text(record.TreatmentName || '-', 750, doc.y);
    doc.moveDown(1);
    checkPageBreak();
  }

  return doc;
};

module.exports = generatePDF;
