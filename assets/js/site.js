// Ideaforge site JS
// Collapsible images on Support page
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    if (!document.body.classList.contains('support')) return;
    var container = document.querySelector('.site-main');
    if (!container) return;
    var images = container.querySelectorAll('img');
    images.forEach(function(img){
      // Skip if already inside a collapsible
      if (img.closest('details.img-collapsible')) return;
      var details = document.createElement('details');
      details.className = 'img-collapsible';
      var summary = document.createElement('summary');
      var alt = img.getAttribute('alt') || 'image';
      summary.textContent = 'Show image: ' + alt;
      // Insert wrapper before image
      img.parentNode.insertBefore(details, img);
      details.appendChild(summary);
      details.appendChild(img);
    });
  });
})();
