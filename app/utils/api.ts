import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_RECIPE_API_KEY;
const BASE_URL = 'https://api.example.com/v1';

export async function fetchRecipes(cuisine: string, mealType: string) {
  try {
    const response = await axios.get(`${BASE_URL}/recipes`, {
      params: {
        cuisine: cuisine,
        mealType: mealType,
        apiKey: API_KEY
      }
    });
    return response.data.recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

