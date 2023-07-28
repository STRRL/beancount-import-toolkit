import * as PDFJS from "pdfjs-dist"

PDFJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry");

export default async function extractTextFromPDF(pdfBytes: Uint8Array): Promise<string> {
    let pdfDoc = await PDFJS.getDocument({
        data: pdfBytes,
        cMapUrl: `//cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS.version}/cmaps/`,
        cMapPacked: true,
    }).promise;
    let allText = "";
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        let page = await pdfDoc.getPage(i);
        let textContent = await page.getTextContent();
        let pageText = textContent.items.map(item => {
            let line = "";
            if ("str" in item){
                line += item.str as string;
            }
            if ("hasEOL" in item && item.hasEOL){
                line += "\n";
            }
            return line;
        }).join(" ");
        allText += pageText;
    }
    return allText;
}
