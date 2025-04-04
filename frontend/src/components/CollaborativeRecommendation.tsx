import { useEffect, useState } from 'react';
import { CollaborativeRecommendation as RecType } from '../types/CollaborativeRecommendation';


function CollaborativeRecommendation({ itemId }: { itemId: string }) {
  const [recommendation, setRecommendation] = useState<RecType | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/CollaborativeRecommendation?itemID=${itemId}`
        );
        if (!response.ok) throw new Error('Failed to fetch recommendation.');
        const data = await response.json();
        setRecommendation(data);
      } catch (err) {
        setError('An error occurred while fetching recommendation.');
      }
    };

    fetchRecommendation();
  }, [itemId]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!recommendation) return <p>Loading recommendation...</p>;

  return (
    <div className="p-4 border rounded shadow mt-4 text-left">
      <h3 className="font-bold text-3xl mb-2">{recommendation.articleTitle}</h3>
      <h3 className="font-bold text-lg mb-2">Collaborative Recommendations: </h3>
      <ul style={{ textAlign: 'left' }}>
        <li>{recommendation.recommendation1}</li>
        <li>{recommendation.recommendation2}</li>
        <li>{recommendation.recommendation3}</li>
        <li>{recommendation.recommendation4}</li>
        <li>{recommendation.recommendation5}</li>
      </ul>
    </div>
  );
}

export default CollaborativeRecommendation;
