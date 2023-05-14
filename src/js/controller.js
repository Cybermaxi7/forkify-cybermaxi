import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import icons from '../img/icons.svg';
import { loadRecipe } from './model.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { CLOSE_MODAL_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const api_key = '8ba8e8df-4f12-4716-be61-ad3fbbe9cc72';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);
    if (!id) return;
    //Load Spinner
    recipeView.renderSpinner();
    //load bookmarks
    bookmarksView.update(model.state.bookmarks);
    //Update results view to show selected option
    resultsView.update(model.getSearchResultPage());
    // 1. Load Recipe
    await model.loadRecipe(id);

    const { recipe } = model.state;
    // 2. Render Recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    // recipeView.renderError();
    console.log(error);
  }
  // controlServings()
};
// window.addEventListener('hashchange', controlRecipes)
// window.addEventListener('load', controlRecipes)

const controlSearchResults = async function () {
  try {
    // 1. Get value from input field
    query = searchView.getQuery();
    if (!query) return;
    //2. Load Search Results
    resultsView.renderSpinner();
    await model.loadSearchResults(query);

    //3. display result

    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    //Display Pagination
    paginationView.render(model.state.search);
    //3. Render Search Results
    // recipeView.render(model.state.search.results[0]);
  } catch (error) {
    console.log(error);
    resultsView.renderError();
  }
};
const controlPagination = function (goToPage) {
  // New Result

  resultsView.render(model.getSearchResultPage(goToPage));

  //Display Pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipeView
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add / Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);

  //Update the recipe view
  recipeView.update(model.state.recipe);

  //Render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);

  //Upload recipes
  try {
    //Load spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //Show success message
    addRecipeView.renderMessage();

    //Render Bookmarks
    bookmarksView.render(model.state.bookmarks)

    //Change Id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`)
    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, CLOSE_MODAL_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
    console.log(error);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

const clearBoookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBoookmarks()