import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Pastikan Anda sudah menginstall react-router-dom
import SearchForm from '../components/SearchForm';
import RecipeCard from '../components/RecipeCard';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';

const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes/findByIngredients';

function Home() {
  const navigate = useNavigate(); // Hook untuk navigasi
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
      const url = `${SPOONACULAR_BASE_URL}?ingredients=${encodeURIComponent(ingredients)}&number=10&ranking=2&ignorePantry=true&apiKey=${SPOONACULAR_API_KEY}`;
      console.log('Request URL:', url);

      const response = await fetch(url);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(errorData || 'Failed to fetch recipes');
      }

      const data = await response.json();
      
      console.log('Received data:', data);
      
      if (!data || data.length === 0) {
        setError('No recipes found for the given ingredients');
        setRecipes([]);
        return;
      }

      const transformedRecipes = data.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        usedIngredientCount: recipe.usedIngredientCount,
        missedIngredientCount: recipe.missedIngredientCount,
        likes: recipe.likes || 0
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
      
      const isDuplicate = favorites.some(fav => fav.id === recipeId);
      if (!isDuplicate) {
        const updatedFavorites = [...favorites, recipe];
        saveToLocalStorage('favorites', updatedFavorites);
      }
    }
  };

  const handleViewRecipeDetails = (recipeId) => {
    navigate(`/recipe/${recipeId}`); // Navigasi ke halaman detail resep
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
              onViewDetailsClick={handleViewRecipeDetails}
              buttonText="Add to Favorites"
              detailsButtonText="View Recipe"
              buttonClassName="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              detailsButtonClassName="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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