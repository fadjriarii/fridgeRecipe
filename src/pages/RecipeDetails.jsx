import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

function RecipeDetails() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch recipe details');
                }

                const data = await response.json();
                setRecipe(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchRecipeDetails();
    }, [id]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
    if (!recipe) return <div className="text-center mt-10">No recipe found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">{recipe.title}</h1>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-auto rounded-lg shadow-md mb-6"
                    />

                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">Nutrition</h2>
                        <ul>
                            <li>Servings: {recipe.servings}</li>
                            <li>Ready in: {recipe.readyInMinutes} minutes</li>
                            <li>Health Score: {recipe.healthScore}</li>
                        </ul>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
                    <ul className="list-disc list-inside mb-6 space-y-2">
                        {recipe.extendedIngredients.map((ingredient) => (
                            <li key={ingredient.id} className="text-gray-700">
                                {ingredient.original}
                            </li>
                        ))}
                    </ul>

                    <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
                    <ol className="list-decimal list-inside space-y-3">
                        {recipe.analyzedInstructions[0]?.steps.map((step) => (
                            <li key={step.number} className="text-gray-700">
                                {step.step}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetails;