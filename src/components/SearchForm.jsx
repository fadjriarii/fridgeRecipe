import { useState } from 'react';
import PropTypes from 'prop-types';

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

  // Validate ingredient names (allow letters, spaces, and some common food-related characters)
  const invalidIngredients = ingredients.filter(ingredient => 
    /[^a-zA-Z\s-]/.test(ingredient)
  );

  if (invalidIngredients.length > 0) {
    throw new Error(`Invalid ingredients: ${invalidIngredients.join(', ')}. Use only letters, spaces, and hyphens.`);
  }

  return ingredients.join(',');
};

function SearchForm({ 
  ingredients, 
  onIngredientsChange, 
  onSubmit, 
  loading = false 
}) {
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    try {
      const validatedIngredients = validateIngredients(ingredients);
      onSubmit(validatedIngredients);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={ingredients}
            onChange={(e) => {
              onIngredientsChange(e.target.value);
              setError(null);
            }}
            placeholder="Enter ingredients (comma separated, e.g. chicken, tomato, cheese)"
            className={`w-full p-3 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>
        <button 
          type="submit" 
          disabled={loading || !ingredients}
          className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Searching...' : 'Find Recipes'}
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Tip: Enter up to 10 ingredients separated by commas
      </p>
    </form>
  );
}
SearchForm.propTypes = {
  ingredients: PropTypes.string.isRequired,
  onIngredientsChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default SearchForm;