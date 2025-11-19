import {
  DocumentEditorContainerComponent, Toolbar, type ImageFormat
} from '@syncfusion/ej2-react-documenteditor';

import {
  PdfBitmap,
  PdfDocument,
  PdfPageOrientation,
  PdfPageSettings,
  PdfSection,
  SizeF,
} from '@syncfusion/ej2-pdf-export';

DocumentEditorContainerComponent.Inject(Toolbar);

function App() {

  let container: DocumentEditorContainerComponent;

  // Export the document as pdf in client-side
  function onClick() {
    let obj = container;
    let pdfdocument: PdfDocument = new PdfDocument();
    let count: number = obj.documentEditor.pageCount;
    obj.documentEditor.documentEditorSettings.printDevicePixelRatio = 2;
    let loadedPage = 0;
    for (let i = 1; i <= count; i++) {
      setTimeout(() => {
        let format: ImageFormat = 'image/jpeg' as ImageFormat;
        // Getting pages as image
        let image = obj.documentEditor.exportAsImage(i, format);
        image.onload = function () {
          let imageHeight = parseInt(
            image.style.height.toString().replace('px', '')
          );
          let imageWidth = parseInt(
            image.style.width.toString().replace('px', '')
          );
          let section: PdfSection = pdfdocument.sections.add() as PdfSection;
          let settings: PdfPageSettings = new PdfPageSettings(0);
          if (imageWidth > imageHeight) {
            settings.orientation = PdfPageOrientation.Landscape;
          }
          settings.size = new SizeF(imageWidth, imageHeight);
          (section as PdfSection).setPageSettings(settings);
          let page = section.pages.add();
          let graphics = page.graphics;
          let imageStr = image.src.replace('data:image/jpeg;base64,', '');
          let pdfImage = new PdfBitmap(imageStr);
          graphics.drawImage(pdfImage, 0, 0, imageWidth, imageHeight);
          loadedPage++;
          if (loadedPage == count) {
            // Exporting the document as pdf
            pdfdocument.save(
              (obj.documentEditor.documentName === ''
                ? 'sample'
                : obj.documentEditor.documentName) + '.pdf'
            );
          }
        };
      }, 500);
    }
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}
      >
        <h2 style={{ margin: 0 }}>Document Editor</h2>
        <button
          id="export"
          onClick={onClick}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            color: '#333',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'border-color 0.3s, color 0.3s'
          }}
        >
          Export as PDF
        </button>
      </div>
      <DocumentEditorContainerComponent
        id="container"
        ref={(scope: DocumentEditorContainerComponent) => {
          container = scope;
        }}
        height={'590px'}
        serviceUrl="https://document.syncfusion.com/web-services/docx-editor/api/documenteditor/"
        enableToolbar={true}
      />
    </div>
  );
}
export default App;