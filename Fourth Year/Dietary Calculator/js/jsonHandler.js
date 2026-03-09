export const jsonDerulo = '../assets/json/restaurant_foods.json';

export function pagkaen(restaurantName, foodName, calories) {
  this.restaurantName = restaurantName;
  this.foodName = foodName;
  this.calories = calories;
}
export async function getAllRestaurants() {
    try {
      const response = await fetch(jsonDerulo); // Fetch the JSON data
      if (!response.ok) {
        throw new Error('Failed to fetch JSON data');
      }
      const data = await response.json(); // Parse the JSON data
      const restaurantNames = data.map((entry) => entry.restaurant);
      return restaurantNames;
    } catch (error) {
      console.error('Error getting restaurants:', error);
      return [];
    }
  }

export async function fetchJSONData() {
  try {
    const response = await fetch(jsonDerulo);
    if (!response.ok) {
      throw new Error('NO RESPONSE !!! WTH');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getRestaurantFoods(restaurantName) {
  const data = await fetchJSONData();
  
  if (!data) {
    console.log("RESTAURANT "+restaurantName+" IS NOT FOUND!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    return [];
  }

  const restaurant = data.find((entry) => entry.restaurant === restaurantName);
  const foodItems = restaurant ? restaurant.foodItems : [];
  
  const foods = foodItems.map((item) => new pagkaen(restaurantName, item.foodName, item.calories));
  return foods;
}


function getCalories(foodItems) {
  const totalCalories = foodItems.reduce((total, item) => (total + (item.calories || 0)), 0);
  return totalCalories;
}