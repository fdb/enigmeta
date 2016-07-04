var URL = 'http://lin.debleser.be:3000/render';

function onChangeStyle(e) {
  loader.style.opacity = 1;
  iframe.src = URL + '?style=' + e.target.value;
}

var loader = document.getElementById('loader');
var styleSlider = document.getElementById('styleSlider');
styleSlider.addEventListener('change', onChangeStyle);

var iframe = document.querySelector('iframe');

iframe.addEventListener('load', function() {
  loader.style.opacity = 0;
});
