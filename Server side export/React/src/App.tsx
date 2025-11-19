import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';

DocumentEditorContainerComponent.Inject(Toolbar);

function App() {

  let container: DocumentEditorContainerComponent;

  function onClick() {
    if (!container) return;

    const fileName = container.documentEditor?.documentName?.trim();
    const exportFileName = fileName ? `${fileName}.pdf` : 'sample.pdf';

    const sfdt = {
      content: container.documentEditor.serialize(),
      fileName: exportFileName
    };

    const http = new XMLHttpRequest();
    http.open('POST', 'https://localhost:7166/ExportPdf');
    http.setRequestHeader('Content-Type', 'application/json');
    http.responseType = 'blob';

    http.onload = () => {
      if (http.status === 200) {
        const blob = new Blob([http.response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = sfdt.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download PDF:', http.statusText);
      }
    };

    http.onerror = () => {
      console.error('Request failed');
    };

    http.send(JSON.stringify(sfdt));
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