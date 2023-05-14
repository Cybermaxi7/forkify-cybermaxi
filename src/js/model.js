// import {async} from 'regenerator-runtime';
import { API_KEY, RES_PER_PAGE } from './config';
import { API_URL } from './config';
import { AJAX, getJSON, sendJSON } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
const createRecipeObject = function(data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    ...(recipe.key && {key: recipe.key})
  };
}
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
  
    state.recipe = createRecipeObject(data)
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
    console.log(state);
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    // https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza&key=<insert your key>
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    // console.log(data);
    const { recipes } = data.data;
    // console.log(recipes);
    state.search.results = recipes.map(recipe => {
      return (state.search.results = {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && {key: recipe.key}),
      });
    });
    state.search.page = 1;
    console.log(state);
  } catch (error) {
    throw error;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  // console.log(page);
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};
export const updateServings = function (newServings) {
  state.recipe?.ingredients.forEach(ing => {
    //newQt = oldQt * newServings / oldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  // update the new servings
  state.recipe.servings = newServings;
};
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add Bookmark
  state.bookmarks.push(recipe);

  //Mark current selected recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  //Store in Localstorage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete Bookmark
  //find index pf bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //Unmark current selected recipe as bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  //Store in Localstorage
  persistBookmarks();
};
export const uploadRecipe = async function (newRecipe) {
  // console.log(Object.entries(newRecipe));
  try {
    const ingredients = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      const ingArr = ing[1].replaceAll(' ', '').split(',');
      if (ingArr.length !== 3)
        throw new Error(
          'Wrong Ingredients format, please use thr correct format :)'
        );
      const [quantity, unit, description] = ingArr;
      return { quantity: quantity ? +quantity : null, unit, description };
    });
  console.log(ingredients);
  const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: newRecipe.cookingTime,
    servings: newRecipe.servings,
    ingredients,
  
  }
  const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe)
  state.recipe = createRecipeObject(data)
  addBookmark(state.recipe)
  } catch (error) {
    throw error;
  }
  
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
  console.log(state.bookmarks);
};
init();
