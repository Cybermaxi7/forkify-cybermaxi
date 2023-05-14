import icons from '../../img/icons.svg';

export default class View {
  _data;
  _errorMsg = `Sorry 😢, We couldn't find that recipe, Please search for another!🙏`;
  _message = 'success';

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
   
    this._data = data;
    // this._clear();
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElement = Array.from(newDOM.querySelectorAll('*'));
    const curElement = Array.from(this._parentElement.querySelectorAll('*'));

    newElement.forEach((newEl, i) => {
      const curEl = curElement[i];
      // console.log(newEl.isEqualNode(curEl));
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim()!=="") {
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          return curEl.setAttribute(attr.name, attr.value);
        })
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner = function () {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
     </div> 
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };
  renderError = function (message = this._errorMsg) {
    const markup = `
    <div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };
  renderMessage = function (message = this._message) {
    const markup = `
    <div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };
}
