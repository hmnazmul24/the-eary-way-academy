import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

type TypingCertificateType = {
  name: string;
  speed: string;
  userId: string;
};
export async function createTypingCertificate({
  name,
  speed,
  userId,
}: TypingCertificateType) {
  // Load the background PDF
  const backgroundPdfBytes = await fetch("/certificate/typing.pdf").then(
    (res) => res.arrayBuffer()
  );

  // Load the background PDF document
  const pdfDoc = await PDFDocument.load(backgroundPdfBytes);

  // Load the custom font (italic)
  // const fontBytes = await fetchFont("/fonts/custom.ttf"); // Replace with the path to your italic font file
  const customFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const NamecustomFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const speedCustomFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Access the first page of the PDF
  const pages = pdfDoc.getPages();
  const doc = pages[0]; // Assuming the first page is the background

  doc.drawText(name, {
    x: 280,
    y: 312,
    size: 30,
    font: NamecustomFont, // Use the custom italic font
    color: rgb(0, 0, 0),
  });
  doc.drawText(`${speed} WPM`, {
    x: 288,
    y: 205,
    size: 30,
    font: speedCustomFont, // Use the custom italic font
    color: rgb(0, 0, 0),
  });
  doc.drawText(userId, {
    x: 145,
    y: 40,
    size: 23,
    font: customFont, // Use the custom italic font
    color: rgb(0, 0, 0),
  });

  // Save the final PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });

  // Trigger a download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `typing.pdf`;
  link.click();
}

//.................................office design ...........................
type DesignCertificateType = {
  name: string;
  session: string;
  userId: string;
};
export async function createDesignCertificate({
  name,
  session,
  userId,
}: DesignCertificateType) {
  // Load the background PDF
  const backgroundPdfBytes = await fetch(
    "/certificate/office_design_certificate.pdf"
  ).then((res) => res.arrayBuffer());

  // Load the background PDF document
  const pdfDoc = await PDFDocument.load(backgroundPdfBytes);

  // Load the custom font (italic)
  // const fontBytes = await fetchFont("/fonts/custom.ttf"); // Replace with the path to your italic font file
  const customFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const NamecustomFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Access the first page of the PDF
  const pages = pdfDoc.getPages();
  const doc = pages[0]; // Assuming the first page is the background

  doc.drawText(name, {
    x: 60,
    y: 332,
    size: 35,
    font: NamecustomFont, // Use the custom italic font
    color: rgb(0, 0, 0),
  });
  doc.drawText(session, {
    x: 60,
    y: 295,
    size: 16,
    font: NamecustomFont, // Use the custom italic font
    color: rgb(0, 0, 0),
  });

  doc.drawText(userId, {
    x: 155,
    y: 27,
    size: 23,
    font: customFont, // Use the custom italic font
    color: rgb(0, 0, 0),
  });

  // Save the final PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });

  // Trigger a download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `design.pdf`;
  link.click();
}
