using System.Text;
using UglyToad.PdfPig;

var root = @"D:\CulinaryBlog\5 file";
var output = new StringBuilder();
var files = Directory.GetFiles(root, "*.pdf").OrderBy(path => path).ToList();
foreach (var path in files)
{
    output.AppendLine($"===== {Path.GetFileName(path)} =====");
    using var pdf = PdfDocument.Open(path);
    foreach (var page in pdf.GetPages())
    {
        output.AppendLine(page.Text);
        output.AppendLine();
    }
}

File.WriteAllText(Path.Combine(root, "all-5-files.txt"), output.ToString());
Console.WriteLine($"Extracted {files.Count} PDFs, {output.Length} characters.");
