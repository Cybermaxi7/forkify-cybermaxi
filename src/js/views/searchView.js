class SearchView {
#parentEl = document.querySelector('.search')
getQuery () {
  const query =  this.#parentEl.querySelector('.search__field').value
  this.#clearInput();
  return query; 
}
#clearInput(){
  return this.#parentEl.querySelector('.search__field').value = '';

}
addHandlerSearch(handler) {
  return this.#parentEl.addEventListener('submit', e => {
    e.preventDefault()
    handler();
  })
}
}
export default new SearchView();