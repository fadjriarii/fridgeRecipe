import PropTypes from 'prop-types';

function RecipeCard({ 
  recipe, 
  onFavoriteClick, 
  onViewDetailsClick,
  buttonText, 
  detailsButtonText,
  buttonClassName,
  detailsButtonClassName 
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <img 
        src={recipe.image} 
        alt={recipe.title} 
        className="w-full h-48 object-cover rounded-t-lg mb-4"
      />
      <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
      <div className="flex justify-between mb-4">
        <p className="text-gray-600">Used Ingredients: {recipe.usedIngredientCount}</p>
        <p className="text-gray-600">Missed Ingredients: {recipe.missedIngredientCount}</p>
      </div>
      <div className="flex space-x-2">
        <button 
          className={`flex-1 ${buttonClassName}`}
          onClick={() => onFavoriteClick(recipe.id)}
        >
          {buttonText}
        </button>
        <button 
          className={`flex-1 ${detailsButtonClassName}`}
          onClick={() => onViewDetailsClick(recipe.id)}
        >
          {detailsButtonText}
        </button>
      </div>
    </div>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    usedIngredientCount: PropTypes.number,
    missedIngredientCount: PropTypes.number,
  }).isRequired,
  onFavoriteClick: PropTypes.func.isRequired,
  onViewDetailsClick: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  detailsButtonText: PropTypes.string.isRequired,
  buttonClassName: PropTypes.string,
  detailsButtonClassName: PropTypes.string,
};

export default RecipeCard;