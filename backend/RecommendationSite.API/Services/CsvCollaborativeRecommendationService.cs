using System.Globalization;
using System.Text;
using CsvHelper;
using RecommendationSite.API.Data;
namespace RecommendationSite.API.Services;

public class CsvCollaborativeRecommendationService
{
    private readonly string _filePath;

    public CsvCollaborativeRecommendationService(IWebHostEnvironment env)
    {
        _filePath = Path.Combine(env.ContentRootPath, "Data", "collaborative_filtering_model.csv");
    }

    public List<CollaborativeRecommendation> GetCollaborativeRecommendations()
    {
        using var reader = new StreamReader(_filePath, Encoding.UTF8);  // Fix encoding issue
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        return csv.GetRecords<CollaborativeRecommendation>().ToList();
    }
    
}
