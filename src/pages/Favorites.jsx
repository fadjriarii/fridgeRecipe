import { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import RecipeCard from '../components/RecipeCard';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const storedFavorites = loadFromLocalStorage('favorites', []);
      setFavorites(storedFavorites);
    } catch (err) {
      setError('Gagal memuat resep favorit. Silakan muat ulang.');
      console.error('Kesalahan memuat favorit:', err);
    }
  }, []);

  const removeFavorite = (id) => {
    try {
      const updatedFavorites = favorites.filter(recipe => recipe.id !== id);
      setFavorites(updatedFavorites);
      saveToLocalStorage('favorites', updatedFavorites);
    } catch (err) {
      setError('Gagal menghapus resep favorit. Silakan coba lagi.');
      console.error('Kesalahan menghapus favorit:', err);
    }
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center p-4 bg-red-100 text-red-700 rounded">
        {error}
        <button 
          onClick={() => {
            setError(null);
            const storedFavorites = loadFromLocalStorage('favorites', []);
            setFavorites(storedFavorites);
          }} 
          className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Resep Favorit Anda</h1>
      
      {favorites.length === 0 ? (
        <p className="text-center text-gray-600">Belum ada resep favorit.</p>
      ) : (
        <TransitionGroup className="space-y-6">
          {favorites.map((recipe) => (
            <CSSTransition
              key={recipe.id}
              timeout={300}
              classNames="recipe-item"
            >
              <div className="recipe-item">
                <RecipeCard
                  recipe={recipe}
                  onFavoriteClick={removeFavorite}
                  buttonText="Hapus dari Favorit"
                  buttonClassName="text-red-600 hover:text-red-800"
                />
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      )}

      <style>{`
        .recipe-item-enter {
          opacity: 0;
          transform: scale(0.9);
        }
        .recipe-item-enter-active {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 300ms, transform 300ms;
        }
        .recipe-item-exit {
          opacity: 1;
        }
        .recipe-item-exit-active {
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
    </div>
  );
}

export default Favorites;