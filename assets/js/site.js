// Ideaforge site JS
// Collapsible images on Support page
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    if (!document.body.classList.contains('support')) return;
    var main = document.querySelector('.site-main');
    if (!main) return;

    // 1) Build a vertical navigation shelf from H2 headings
    try {
      var headings = Array.from(main.querySelectorAll('h2'));
      if (headings.length > 0) {
        // Ensure each heading has an id
        headings.forEach(function(h){
          if (!h.id) {
            var slug = h.textContent.toLowerCase().trim()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-');
            // avoid empty id
            if (!slug) slug = 'section';
            // ensure unique
            var base = slug, i = 2;
            while (document.getElementById(slug)) { slug = base + '-' + i++; }
            h.id = slug;
          }
          // Improve scroll offset for sticky header
          h.style.scrollMarginTop = '90px';
        });

        // Create layout wrapper
        var layout = document.createElement('div');
        layout.className = 'support-layout';
        var content = document.createElement('div');
        content.className = 'support-content';

        // Move existing children into content
        while (main.firstChild) { content.appendChild(main.firstChild); }

        // Create nav
        var nav = document.createElement('nav');
        nav.className = 'support-nav';
        nav.setAttribute('aria-label', 'On this page');

        var navTitle = document.createElement('div');
        navTitle.className = 'support-nav-title';
        navTitle.textContent = 'On this page';
        nav.appendChild(navTitle);

        var list = document.createElement('ul');
        headings.forEach(function(h){
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = '#' + h.id;
          a.textContent = h.textContent;
          li.appendChild(a);
          list.appendChild(li);
        });
        nav.appendChild(list);

        // Assemble layout
        layout.appendChild(nav);
        layout.appendChild(content);
        main.appendChild(layout);

        // Optional: highlight active heading on scroll (simple)
        var links = Array.from(list.querySelectorAll('a'));
        var observer = new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            if (entry.isIntersecting) {
              var id = entry.target.id;
              links.forEach(function(l){ l.classList.toggle('active', l.getAttribute('href') === '#' + id); });
            }
          });
        }, { rootMargin: '-70% 0px -25% 0px', threshold: [0, 1] });
        headings.forEach(function(h){ observer.observe(h); });
      }
    } catch (e) { /* no-op */ }

    // 2) Make images collapsible
    var images = main.querySelectorAll('img');
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
