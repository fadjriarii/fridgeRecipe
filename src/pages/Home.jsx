import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import RecipeCard from '../components/RecipeCard';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';

function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    // TODO: Replace with actual API call
    const apiKey = 'YOUR_API_KEY';
    const apiUrl = `https://api.example.com/recipes?ingredients=${ingredients}&apiKey=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(data.recipes);
    } catch (error) {
      console.error('Error:', error.message);
      // Handle error or display a message to the user
    }
  };

  const handleAddToFavorites = (recipeId) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      const favorites = loadFromLocalStorage('favorites', []);
      const updatedFavorites = [...favorites, recipe];
      saveToLocalStorage('favorites', updatedFavorites);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Find Recipes with Your Ingredients</h1>
      
      <SearchForm 
        ingredients={ingredients}
        onIngredientsChange={setIngredients}
        onSubmit={handleSearch}
      />

      {recipes.length > 0 && (
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
    </div>
  );
}

export default Home;