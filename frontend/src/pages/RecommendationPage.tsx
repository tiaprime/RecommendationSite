import { useState } from 'react';

function RecommendationPage() {
  // State to store the user or item ID input
  const [inputId, setInputId] = useState('');

  // State to determine whether the input is for a user or an item
  const [idType, setIdType] = useState('user'); // Can be 'user' or 'item'

  // State to store recommendation results from different models
  const [recommendations, setRecommendations] = useState({
    collaborative: [], // Collaborative Filtering model results
    content: [], // Content-Based Filtering model results
    azureML: [], // Azure ML model results
  });

  // State to manage loading status while fetching recommendations
  const [loading, setLoading] = useState(false);

  // State to store and display errors
  const [error, setError] = useState('');

  // Function to fetch recommendations based on input ID and selected ID type
  const handleFetchRecommendations = async () => {
    // Ensure an ID is provided before making the request
    if (!inputId) {
      setError('Please enter a valid ID.');
      return;
    }

    // Set loading state to true while fetching data
    setLoading(true);
    setError('');

    try {
      // Fetch recommendations from the backend API
      const response = await fetch(
        `http://localhost:5000/api/recommendations?${idType}Id=${inputId}`
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
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred.'
      );
    } finally {
      // Reset loading state after the request is complete
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <h2>News Article Recommender</h2>

      {/* Dropdown to select between User ID and Item ID */}
      <div>
        <label>
          Select ID Type and Number:
          <br />
          <select value={idType} onChange={(e) => setIdType(e.target.value)}>
            <option value="user">User ID</option>
            <option value="item">Item ID</option>
          </select>
        </label>

        {/* Input field to enter User ID or Item ID */}
        <input
          type="text"
          placeholder={`Enter ${idType} ID`}
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
        />
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
