import { useState, useEffect } from 'react';
import CollaborativeRecommendation from '../components/CollaborativeRecommendation';

type ArticleSummary = {
  articleId: number;
  articleTitle: string;
};

function RecommendationPage() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null
  );
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          'http://localhost:4000/api/CollaborativeRecommendation/articles'
        );
        if (!response.ok) throw new Error('Failed to fetch item IDs.');
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError('An error occurred while fetching item IDs.');
      }
    };

    fetchArticles();
  }, [selectedArticleId]); // ✅ Run only on initial mount

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <h2>News Article Recommender</h2>

      {/* Dropdown to select Item ID */}
      <div>
        <label>
          Select Article:
          <br />
          <select
            value={selectedArticleId ?? ''}
            onChange={(e) => setSelectedArticleId(String(e.target.value))}
          >
            {/* Only show placeholder if nothing is selected */}
            {selectedArticleId === null && (
              <option value="" disabled hidden>
                Select an Article
              </option>
            )}
            {articles.map((a) => (
              <option key={a.articleId} value={a.articleId}>
                {a.articleTitle}
              </option>
            ))}
          </select>
        </label>
      </div>
      <br />

      {/* Display error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Show recommendation for selected article */}
      {selectedArticleId !== null && (
        <CollaborativeRecommendation itemId={selectedArticleId} />
      )}
    </div>
  );
}

export default RecommendationPage;
