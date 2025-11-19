using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using PdfExport.Models;
using EJ2DocumentEditor = Syncfusion.EJ2.DocumentEditor;
using Syncfusion.DocIORenderer;

namespace PdfExport.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        // Model to receive PDF export request data
        public class PdfExportRequest
        {
            public required string Content { get; set; }
            public required string FileName { get; set; }
        }

        // API endpoint to export Word document as PDF
        [AcceptVerbs("Post")]
        [HttpPost]
        [Route("ExportPdf")]
        public FileStreamResult ExportPdf([FromBody] PdfExportRequest data)
        {
            // Convert the SFDX content to a WordDocument instance
            Syncfusion.DocIO.DLS.WordDocument wordDocument = EJ2DocumentEditor.WordDocument.Save(data.Content);

            // Instantiate DocIORenderer for Word to PDF conversion
            DocIORenderer render = new DocIORenderer();

            // Convert the Word document to a PDF document
            Syncfusion.Pdf.PdfDocument pdfDocument = render.ConvertToPDF(wordDocument);

            // Create a memory stream to hold the PDF file
            Stream stream = new MemoryStream();

            // Save the PDF document to the stream
            pdfDocument.Save(stream);
            stream.Position = 0;

            // Clean up resources
            pdfDocument.Close();
            wordDocument.Close();

            // Return the PDF file as a downloadable stream
            return new FileStreamResult(stream, "application/pdf")
            {
                FileDownloadName = data.FileName
            };
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
