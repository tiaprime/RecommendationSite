namespace DefaultNamespace;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using CsvHelper;
using Microsoft.AspNetCore.Hosting;
using System.Linq;

public class CsvArticleService
{
    private readonly string _filePath;

    public CsvArticleService(IWebHostEnvironment env)
    {
        _filePath = Path.Combine(env.ContentRootPath, "Data", "collaborative_filtering_model.csv");
    }

    public List<CollaborativeRecommendation> GetCollborativeRecommendations()
    {
        using var reader = new StreamReader(_filePath, Encoding.UTF8);  // Fix encoding issue
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        return csv.GetRecords<CollaborativeRecommendation>().ToList();
    }
}
