import { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = loadFromLocalStorage('favorites', []);
    setFavorites(storedFavorites);
  }, []);

  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter(recipe => recipe.id !== id);
    setFavorites(updatedFavorites);
    saveToLocalStorage('favorites', updatedFavorites);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Favorite Recipes</h1>
      
      {favorites.length === 0 ? (
        <p className="text-center text-gray-600">No favorite recipes yet.</p>
      ) : (
        <div className="space-y-6">
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onFavoriteClick={removeFavorite}
              buttonText="Remove from Favorites"
              buttonClassName="text-red-600 hover:text-red-800"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;