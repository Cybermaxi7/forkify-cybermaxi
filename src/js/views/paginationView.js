import View from './View';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      return handler(goToPage);
    });
  }
  _generateMarkupBtnNext(currPage) {
    return `
    <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
    <span>Page ${currPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
  }
  _generateMarkupBtnPrev(currPage) {
    return `
      <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currPage - 1}</span>
    </button>`;
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Page 1 and there are other pages
    if (currPage === 1 && numPages > 1) return this._generateMarkupBtnNext(currPage);

    //Last page
    if (currPage === numPages && numPages > 1) return this._generateMarkupBtnPrev(currPage);
    
      
    // Other pages
    if (currPage < numPages) {
      return `${this._generateMarkupBtnPrev(
        currPage
      )} ${this._generateMarkupBtnNext(currPage)}`;
    }
    //Only one page
    return '';
  }

  
}
export default new PaginationView();
