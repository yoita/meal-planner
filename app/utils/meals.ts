export type Meal = {
  name: string;
  recipe?: string[];
  ingredients?: string[];
};

export type MealSet = {
  appetizer: Meal;
  mainCourse: Meal;
  dessert: Meal;
};

export type CuisineStyle = 'cantonese' | 'sichuan' | 'hunan' | 'hubei' | 'chongqing' | 'japanese' | 'korean' | 'western' | 'mexican' | 'thai';
export type DiningOption = 'dineOut' | 'takeout' | 'homemade';

type MealsByDiningOption = {
  [key in DiningOption]: Meal[];
};

export const meals: { [key in CuisineStyle]: MealsByDiningOption } = {
  cantonese: {
    dineOut: [
      { name: "烧鹅" },
      { name: "白切鸡" },
      { name: "蜜汁叉烧" },
      { name: "清蒸鱼" },
      { name: "虾饺" },
      { name: "肠粉" },
      { name: "艇仔粥" },
      { name: "咖喱牛腩" }
    ],
    takeout: [
      { name: "叉烧饭" },
      { name: "烧鸭饭" },
      { name: "虾云吞面" },
      { name: "干炒牛河" },
      { name: "咸鱼鸡粒炒饭" },
      { name: "菠萝咕噜肉" },
      { name: "西兰花炒带子" },
      { name: "豉汁蒸排骨" }
    ],
    homemade: [
      {
        name: "葱油鸡",
        recipe: [
          "将鸡肉洗净，放入沸水中汆烫一下，捞出沥干",
          "准备葱、姜、蒜，切成末",
          "锅中放油，爆香葱姜蒜",
          "放入鸡肉，翻炒均匀",
          "加入适量盐、生抽、料酒",
          "加水没过鸡肉，大火煮沸后转小火慢炖15-20分钟",
          "最后撒上葱花即可"
        ],
        ingredients: ["鸡肉", "葱", "姜", "蒜", "盐", "生抽", "料酒"]
      },
      {
        name: "蚝油生菜",
        recipe: [
          "生菜洗净，撕成小块",
          "锅中加水烧开，放入生菜焯水10秒",
          "捞出生菜，沥干水分",
          "另起锅，加入少许油",
          "放入蒜末爆香",
          "加入蚝油、生抽、糖",
          "将酱汁浇在生菜上即可"
        ],
        ingredients: ["生菜", "蒜", "蚝油", "生抽", "糖"]
      },
      {
        name: "腊肠炒饭",
        recipe: [
          "腊肠切丁，提前煮熟的米饭备用",
          "锅中加油，放入腊肠丁煸炒出油",
          "加入蛋液，炒散",
          "放入米饭，翻炒均匀",
          "加入盐、酱油调味",
          "最后撒上葱花即可"
        ],
        ingredients: ["腊肠", "米饭", "鸡蛋", "葱", "盐", "酱油"]
      }
    ]
  },
  // Add other cuisines here...
  sichuan: {
    dineOut: [
      { name: "麻婆豆腐" },
      { name: "宫保鸡丁" },
      { name: "水煮鱼" },
      { name: "夫妻肺片" },
      { name: "回锅肉" },
      { name: "辣子鸡" },
      { name: "鱼香肉丝" },
      { name: "担担面" }
    ],
    takeout: [
      { name: "麻辣香锅" },
      { name: "冒菜" },
      { name: "麻辣烫" },
      { name: "钵钵鸡" },
      { name: "串串香" },
      { name: "蒜泥白肉" },
      { name: "口水鸡" },
      { name: "辣椒炒肉" }
    ],
    homemade: [
      {
        name: "回锅肉",
        recipe: [
          "五花肉切片，焯水后捞出",
          "蒜苗、青椒切段",
          "锅中放油，爆香豆瓣酱",
          "放入五花肉翻炒",
          "加入蒜苗、青椒继续翻炒",
          "加入盐、糖、生抽调味",
          "最后撒上花椒粉即可"
        ],
        ingredients: ["五花肉", "蒜苗", "青椒", "豆瓣酱", "盐", "糖", "生抽", "花椒粉"]
      },
      // Add more Sichuan homemade dishes...
    ]
  },
  // Add other cuisines (hunan, hubei, chongqing, japanese, korean, western, mexican, thai) here...
};

export const getMealSet = (cuisine: CuisineStyle, diningOption: DiningOption): MealSet => {
  const cuisineMeals = meals[cuisine]?.[diningOption];
  
  if (!cuisineMeals || cuisineMeals.length < 3) {
    throw new Error(`Not enough meals for ${cuisine} ${diningOption} to create a balanced set`);
  }

  let mealSet: MealSet;
  do {
    const selectedIndices = new Set<number>();
    while (selectedIndices.size < 3) {
      selectedIndices.add(Math.floor(Math.random() * cuisineMeals.length));
    }

    const [appetizer, mainCourse, dessert] = Array.from(selectedIndices).map(index => cuisineMeals[index]);
    mealSet = { appetizer, mainCourse, dessert };
  } while (!isBalancedMeal(mealSet));

  return mealSet;
};

const isBalancedMeal = (mealSet: MealSet): boolean => {
  const meatDishes = Object.values(mealSet).filter(meal => 
    meal.name.includes('肉') || meal.name.includes('鱼') || 
    meal.name.includes('鸡') || meal.name.includes('牛') || 
    meal.name.includes('猪') || meal.name.includes('虾')
  ).length;
  return meatDishes > 0 && meatDishes < 3;
}

