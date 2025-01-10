'use client'

import { useState, useEffect, useRef } from 'react'
import { meals, CuisineStyle, DiningOption, Meal, MealSet, getMealSet } from '../utils/meals'

export default function Dashboard() {
  const [mealSet, setMealSet] = useState<MealSet | null>(null)
  const [cuisine, setCuisine] = useState<CuisineStyle>('sichuan')
  const [diningOption, setDiningOption] = useState<DiningOption>('takeout')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dislikedMeals, setDislikedMeals] = useState<Set<string>>(new Set())
  const dislikeCountRef = useRef<{ [key: string]: number }>({})

  useEffect(() => {
    const storedPreferences = localStorage.getItem('userPreferences')
    if (storedPreferences) {
      const { cuisine: storedCuisine, diningOption: storedDiningOption } = JSON.parse(storedPreferences)
      setCuisine(storedCuisine as CuisineStyle)
      setDiningOption(storedDiningOption as DiningOption)
    }
    const storedDislikedMeals = localStorage.getItem('dislikedMeals')
    if (storedDislikedMeals) {
      setDislikedMeals(new Set(JSON.parse(storedDislikedMeals)))
    }
  }, [])

  const generateMealSet = () => {
    setLoading(true)
    setError(null)
    try {
      let newMealSet: MealSet;
      let attempts = 0;
      const maxAttempts = 10;
      do {
        newMealSet = getMealSet(cuisine, diningOption);
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error("无法生成符合条件的菜单，请尝试其他选项。");
        }
      } while (
        (dislikedMeals.has(newMealSet.appetizer.name) && dislikeCountRef.current[newMealSet.appetizer.name] > 0) ||
        (dislikedMeals.has(newMealSet.mainCourse.name) && dislikeCountRef.current[newMealSet.mainCourse.name] > 0) ||
        (dislikedMeals.has(newMealSet.dessert.name) && dislikeCountRef.current[newMealSet.dessert.name] > 0)
      );
      
      // 减少不喜欢的计数
      Object.keys(dislikeCountRef.current).forEach(meal => {
        if (dislikeCountRef.current[meal] > 0) {
          dislikeCountRef.current[meal]--;
        }
        if (dislikeCountRef.current[meal] === 0) {
          dislikedMeals.delete(meal);
        }
      });
      
      setMealSet(newMealSet)
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生未知错误");
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('userPreferences', JSON.stringify({ cuisine, diningOption }))
    generateMealSet()
  }

  const handleCuisineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCuisine(e.target.value as CuisineStyle)
    setMealSet(null)
  }

  const handleDiningOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDiningOption(e.target.value as DiningOption)
    setMealSet(null)
  }

  const handleFeedback = (mealName: string, isLiked: boolean) => {
    if (!isLiked) {
      const newDislikedMeals = new Set(dislikedMeals)
      newDislikedMeals.add(mealName)
      setDislikedMeals(newDislikedMeals)
      dislikeCountRef.current[mealName] = 10
      localStorage.setItem('dislikedMeals', JSON.stringify([...newDislikedMeals]))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">每日菜单推荐</div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">选择您的用餐偏好</h1>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="mb-4">
                <label htmlFor="diningOption" className="block text-sm font-medium text-gray-700 mb-2">
                  选择用餐场景
                </label>
                <select
                  id="diningOption"
                  value={diningOption}
                  onChange={handleDiningOptionChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:border-indigo-500"
                >
                  <option value="dineOut">外出就餐</option>
                  <option value="takeout">外卖</option>
                  <option value="homemade">自己做</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">
                  选择菜系
                </label>
                <select
                  id="cuisine"
                  value={cuisine}
                  onChange={handleCuisineChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:border-indigo-500"
                >
                  <option value="cantonese">粤菜 (Cantonese)</option>
                  <option value="sichuan">川菜 (Sichuan)</option>
                  <option value="hunan">湘菜 (Hunan)</option>
                  <option value="hubei">鄂菜 (Hubei)</option>
                  <option value="chongqing">重庆菜 (Chongqing)</option>
                  <option value="japanese">日本料理 (Japanese)</option>
                  <option value="korean">韩国料理 (Korean)</option>
                  <option value="western">西餐 (Western)</option>
                  <option value="mexican">墨西哥菜 (Mexican)</option>
                  <option value="thai">泰国菜 (Thai)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? '加载中...' : '生成推荐菜单'}
              </button>
            </form>
            {error && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            {mealSet && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg shadow">
                <p className="text-sm text-green-600 font-medium mb-3">今日推荐菜单</p>
                <div className="space-y-3">
                  {Object.values(mealSet).map((meal, index) => (
                    <div key={index} className="mt-4 bg-white rounded-lg shadow-sm p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-green-900">{meal.name}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleFeedback(meal.name, true)}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition-colors duration-200"
                            aria-label="喜欢"
                          >
                            👍
                          </button>
                          <button
                            onClick={() => handleFeedback(meal.name, false)}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50 transition-colors duration-200"
                            aria-label="不喜欢"
                          >
                            👎
                          </button>
                        </div>
                      </div>
                      {diningOption === 'homemade' && (
                        <>
                          <div className="mt-2">
                            <h3 className="text-md font-medium text-green-800">做法：</h3>
                            <ol className="list-decimal list-inside mt-1">
                              {meal.recipe?.map((step, stepIndex) => (
                                <li key={stepIndex} className="text-sm text-green-700">{step}</li>
                              ))}
                            </ol>
                          </div>
                          <div className="mt-2">
                            <h3 className="text-md font-medium text-green-800">所需食材：</h3>
                            <ul className="list-disc list-inside mt-1">
                              {meal.ingredients?.map((ingredient, ingredientIndex) => (
                                <li key={ingredientIndex} className="text-sm text-green-700">{ingredient}</li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

