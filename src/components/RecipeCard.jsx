import PropTypes from 'prop-types';

function RecipeCard({ recipe, onFavoriteClick, buttonText, buttonClassName }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{recipe.name}</h3>
      <p className="text-gray-600">{recipe.description}</p>
      <button 
        className={`mt-4 ${buttonClassName}`}
        onClick={() => onFavoriteClick(recipe.id)}
      >
        {buttonText}
      </button>
    </div>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onFavoriteClick: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonClassName: PropTypes.string.isRequired,
};

export default RecipeCard;