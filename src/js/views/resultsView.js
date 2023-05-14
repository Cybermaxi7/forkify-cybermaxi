import View from './View';
import icons from '../../img/icons.svg';
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMsg = `Sorry 😢, We couldn't find that recipe, Please search for another!🙏`;
  _message = 'success';

  _generateMarkup() {
    // console.log(this._data);
    return this._data.map(result => previewView.render(result, false)).join();
  }
  
}
export default new ResultsView();
