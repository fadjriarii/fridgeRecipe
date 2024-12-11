import { useState, useCallback } from 'react';

// Utility for input validation
const validateIngredients = (ingredientsInput) => {
  // Trim and remove empty entries
  const ingredients = ingredientsInput
    .split(',')
    .map(ingredient => ingredient.trim())
    .filter(ingredient => ingredient.length > 0);

  // Validate minimum and maximum ingredients
  if (ingredients.length === 0) {
    throw new Error('Please enter at least one ingredient');
  }
  if (ingredients.length > 10) {
    throw new Error('Maximum 10 ingredients allowed');
  }

  // Optional: Add more specific validation (e.g., no special characters)
  const invalidIngredients = ingredients.filter(ingredient => 
    /[^a-zA-Z\s]/.test(ingredient)
  );

  if (invalidIngredients.length > 0) {
    throw new Error(`Invalid ingredients: ${invalidIngredients.join(', ')}`);
  }

  return ingredients;
};

// Custom hook for caching API results
const useRecipeCache = () => {
  const [cache, setCache] = useState({});

  const getCachedRecipes = useCallback((key) => {
    return cache[key];
  }, [cache]);

  const setCachedRecipes = useCallback((key, recipes) => {
    setCache(prevCache => ({
      ...prevCache,
      [key]: {
        data: recipes,
        timestamp: Date.now()
      }
    }));
  }, []);

  const isCacheValid = useCallback((key) => {
    const cachedItem = cache[key];
    // Cache valid for 1 hour
    return cachedItem && (Date.now() - cachedItem.timestamp) < 3600000;
  }, [cache]);

  return { getCachedRecipes, setCachedRecipes, isCacheValid };
};

// Centralized error handling utility
class APIError extends Error {
  constructor(message, status, details = {}) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}
// TODO Replace with your actual backend API endpoint
// API Service with enhanced error handling and retry mechanism
const RecipeService = {
  async fetchRecipes(ingredients, authToken = null) {
    // Use environment variable for API endpoint
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://default-api-endpoint.com';
    
    // Configure fetch options
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
      },
      body: JSON.stringify({ ingredients })
    };

    // Retry configuration
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(`${API_BASE_URL}/recipes`, fetchOptions);

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new APIError(
            'Failed to fetch recipes', 
            response.status, 
            errorBody
          );
        }

        return await response.json();
      } catch (error) {
        // Log error for debugging
        console.error(`Attempt ${attempt} failed:`, error);

        // Final attempt
        if (attempt === MAX_RETRIES) {
          throw error;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
      }
    }
  }
};

// Main Recipe Finder Component
function RecipeFinder() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use recipe cache hook
  const { getCachedRecipes, setCachedRecipes, isCacheValid } = useRecipeCache();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate ingredients before API call
      const validatedIngredients = validateIngredients(ingredients);
      
      // Create cache key
      const cacheKey = validatedIngredients.sort().join(',');

      // Check cache first
      if (isCacheValid(cacheKey)) {
        const cachedRecipes = getCachedRecipes(cacheKey);
        setRecipes(cachedRecipes.data);
        setLoading(false);
        return;
      }

      // Fetch recipes
      const data = await RecipeService.fetchRecipes(validatedIngredients);
      
      // Cache results
      setCachedRecipes(cacheKey, data.recipes);
      
      setRecipes(data.recipes);
    } catch (err) {
      // Detailed error handling
      if (err instanceof APIError) {
        switch (err.status) {
          case 400:
            setError('Invalid request. Please check your ingredients.');
            break;
          case 401:
            setError('Authentication required. Please log in.');
            break;
          case 403:
            setError('You do not have permission to access this resource.');
            break;
          case 404:
            setError('No recipes found for these ingredients.');
            break;
          case 429:
            setError('Too many requests. Please try again later.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(err.message || 'An unexpected error occurred');
        }
      } else if (err.message.includes('ingredient')) {
        // Specific input validation errors
        setError(err.message);
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-6">Find Recipes</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients (comma separated)"
            className="input-field flex-1 p-2 border rounded"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search Recipes'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="recipe-results grid md:grid-cols-2 gap-4">
        {recipes.map((recipe, index) => (
          <div 
            key={index} 
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
            <p className="text-gray-600 mb-4">{recipe.description}</p>
            <ul className="list-disc list-inside">
              {recipe.ingredients.slice(0, 5).map((ingredient, idx) => (
                <li key={idx} className="text-sm">{ingredient}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeFinder;

