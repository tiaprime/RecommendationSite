import { useState, useEffect } from 'react';

function RecommendationPage() {
  // State to store the list of item IDs from the backend
  const [itemIds, setItemIds] = useState([]);

  // State to store the selected item ID
  const [selectedItemId, setSelectedItemId] = useState('');

  // State to store recommendation results from different models
  const [recommendations, setRecommendations] = useState({
    collaborative: [], // Collaborative Filtering model results
    content: [], // Content-Based Filtering model results
    azureML: [], // Azure ML model results
  });

  // State to manage loading status while fetching recommendations or item IDs
  const [loading, setLoading] = useState(false);

  // State to store and display errors
  const [error, setError] = useState('');

  // Fetch itemIds from the backend when the component mounts
  useEffect(() => {
    const fetchItemIds = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/itemIds');
        if (!response.ok) {
          throw new Error('Failed to fetch item IDs.');
        }
        const data = await response.json();
        setItemIds(data);
      } catch (err) {
        setError('An error occurred while fetching item IDs.');
      }
    };

    fetchItemIds();
  }, []);

  // Function to fetch recommendations based on the selected item ID
  const handleFetchRecommendations = async () => {
    // Ensure an item ID is selected before making the request
    if (!selectedItemId) {
      setError('Please select a valid Item ID.');
      return;
    }

    // Set loading state to true while fetching data
    setLoading(true);
    setError('');

    try {
      // Fetch recommendations from the backend API using the selected itemId
      const response = await fetch(
        `http://localhost:5000/api/recommendations/itemId=${selectedItemId}`
      );

      // Throw an error if the request was unsuccessful
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations.');
      }

      // Parse the JSON response
      const data = await response.json();

      // Update the recommendations state with the fetched data
      setRecommendations({
        collaborative: data.collaborative || [], // Defaults to empty array if undefined
        content: data.content || [],
        azureML: data.azureML || [],
      });
    } catch (err) {
      // Capture and display any errors that occur
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      // Reset loading state after the request is complete
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <h2>News Article Recommender</h2>

      {/* Dropdown to select Item ID */}
      <div>
        <label>
          Select Item ID:
          <br />
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
          >
            <option value="">Select an Item</option>
            {itemIds.map((itemId) => (
              <option key={itemId} value={itemId}>
                {itemId}
              </option>
            ))}
          </select>
        </label>
      </div>
      <br />

      {/* Button to fetch recommendations, disabled when loading */}
      <button onClick={handleFetchRecommendations} disabled={loading}>
        {loading ? 'Fetching...' : 'Get Recommendations'}
      </button>

      {/* Display error message if an error occurs */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <br />
      <br />

      {/* Section to display Collaborative Filtering recommendations */}
      <div>
        <h3>Collaborative Filtering Recommendations</h3>
        <ul>
          {recommendations.collaborative.map((id, index) => (
            <li key={index}>{id}</li>
          ))}
        </ul>
      </div>

      {/* Section to display Content-Based Filtering recommendations */}
      <div>
        <h3>Content-Based Recommendations</h3>
        <ul>
          {recommendations.content.map((id, index) => (
            <li key={index}>{id}</li>
          ))}
        </ul>
      </div>

      {/* Section to display Azure ML recommendations */}
      <div>
        <h3>Azure ML Recommendations</h3>
        <ul>
          {recommendations.azureML.map((id, index) => (
            <li key={index}>{id}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RecommendationPage;
