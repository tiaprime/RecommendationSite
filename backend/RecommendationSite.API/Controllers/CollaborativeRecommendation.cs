using RecommendationSite.API.Data;
using RecommendationSite.API.Services;

namespace RecommendationSite.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[Route("api/[controller]")]
[ApiController]
public class CollaborativeRecommendationController : ControllerBase
{
    private readonly CsvCollaborativeRecommendationService _csvService;

    public CollaborativeRecommendationController(CsvCollaborativeRecommendationService csvService)
    {
        _csvService = csvService;
    }

    [HttpGet]
    public ActionResult<CollaborativeRecommendation> GetCollaborativeRecommendation([FromQuery] string itemId)
    {
        var recommendation = _csvService.GetCollaborativeRecommendations()
            .FirstOrDefault(a => a.ArticleId == itemId);

        if (recommendation == null)
        {
            return NotFound();
        }

        return Ok(recommendation);
    }

    
    [HttpGet("articles")]
    public ActionResult<IEnumerable<object>> GetArticles()
    {
        var data = _csvService.GetCollaborativeRecommendations()
            .Select(a => new { a.ArticleId, a.ArticleTitle });

        return Ok(data);
    }

}