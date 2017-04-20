function onChangeStyle(e) {
  loader.style.opacity = 1;
  var style = parseInt(e.target.value);
  if (style < 0) {
    style = 0;
  }
  if (style > 100) {
    style = 100;
  }
  style = Math.floor(style);
  iframe.src = 'https://enigmeta.s3.amazonaws.com/thesis/pdf/thesis-the-impact-of-generative-design.' + style + '.pdf';
}

var loader = document.getElementById('loader');
var styleSlider = document.getElementById('styleSlider');
styleSlider.addEventListener('change', onChangeStyle);

var iframe = document.querySelector('iframe');

iframe.addEventListener('load', function() {
  loader.style.opacity = 0;
});
