import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import RecipeCard from '../components/RecipeCard';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';

// TODO Replace with actual API call
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes/findByIngredients';

function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (ingredients) => {
    if (!SPOONACULAR_API_KEY) {
      setError('API key is missing. Please set up your environment variables.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${SPOONACULAR_BASE_URL}?ingredients=${encodeURIComponent(ingredients)}&number=10&ranking=2&ignorePantry=true&apiKey=${SPOONACULAR_API_KEY}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch recipes');
      }

      const data = await response.json();
      
      // Transform Spoonacular API response to match our app's structure
      const transformedRecipes = data.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        usedIngredientCount: recipe.usedIngredientCount,
        missedIngredientCount: recipe.missedIngredientCount,
        likes: recipe.likes
      }));

      setRecipes(transformedRecipes);
    } catch (error) {
      console.error('Recipe search error:', error);
      setError(error.message || 'An unexpected error occurred while searching for recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = (recipeId) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      const favorites = loadFromLocalStorage('favorites', []);
      
      // Prevent duplicate favorites
      const isDuplicate = favorites.some(fav => fav.id === recipeId);
      if (!isDuplicate) {
        const updatedFavorites = [...favorites, recipe];
        saveToLocalStorage('favorites', updatedFavorites);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Find Recipes with Your Ingredients</h1>
      
      <SearchForm 
        ingredients={ingredients}
        onIngredientsChange={setIngredients}
        onSubmit={handleSearch}
        loading={loading}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center my-4">
          <p>Searching for recipes...</p>
        </div>
      )}

      {!loading && recipes.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Recommended Recipes</h2>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onFavoriteClick={handleAddToFavorites}
              buttonText="Add to Favorites"
              buttonClassName="text-blue-600 hover:text-blue-800"
            />
          ))}
        </div>
      )}

      {!loading && recipes.length === 0 && ingredients && (
        <p className="text-center text-gray-600">No recipes found for these ingredients.</p>
      )}
    </div>
  );
}

export default Home;