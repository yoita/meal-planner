export default function Recipe({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the recipe details based on the ID
  const recipe = {
    name: 'Spaghetti Carbonara',
    ingredients: ['200g spaghetti', '100g pancetta', '2 large eggs', '50g pecorino cheese', 'Black pepper'],
    instructions: [
      'Cook spaghetti according to package instructions.',
      'Fry pancetta until crispy.',
      'Beat eggs with grated cheese and pepper.',
      'Toss hot pasta with pancetta, then quickly stir in egg mixture.',
      'Serve immediately with extra cheese and pepper.'
    ]
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{recipe.name}</h1>
      <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
      <ul className="list-disc pl-5 mb-4">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
      <ol className="list-decimal pl-5">
        {recipe.instructions.map((step, index) => (
          <li key={index} className="mb-2">{step}</li>
        ))}
      </ol>
    </div>
  )
}

