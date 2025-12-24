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
            if (!slug) slug = 'section';
            var base = slug, i = 2;
            while (document.getElementById(slug)) { slug = base + '-' + i++; }
            h.id = slug;
          }
          h.style.scrollMarginTop = '90px';
        });

        // Create layout wrapper once
        if (!main.querySelector('.support-layout')) {
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

          // Highlight active heading
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
      }
    } catch (e) { /* no-op */ }

    // 2) Transform sections (H2 blocks) into collapsible two-column rows
    //    Skip this on the Support home page
    if (document.body.classList.contains('support-home')) {
      return;
    }
    var contentRoot = main.querySelector('.support-content') || main;
    if (contentRoot.querySelector('.support-step')) {
      // Already transformed
      return;
    }

    var sections = [];
    var nodes = Array.from(contentRoot.children);
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].tagName && nodes[i].tagName.toLowerCase() === 'h2') {
        var h = nodes[i];
        var block = { heading: h, nodes: [] };
        i++;
        while (i < nodes.length && !(nodes[i].tagName && nodes[i].tagName.toLowerCase() === 'h2')) {
          block.nodes.push(nodes[i]);
          i++;
        }
        i--; // step back one because for-loop will increment
        sections.push(block);
      }
    }

    // Add toolbar for expand/collapse all (only if there is at least one transformed section with an image)
    var toolbar = null;
    if (sections.length) {
      var toolbar = document.createElement('div');
      toolbar.className = 'support-toolbar';

      var expandBtn = document.createElement('button');
      expandBtn.type = 'button';
      expandBtn.className = 'btn';
      expandBtn.textContent = 'Expand all';
      expandBtn.addEventListener('click', function(){
        contentRoot.querySelectorAll('details.support-step').forEach(function(d){ d.open = true; });
      });

      var collapseBtn = document.createElement('button');
      collapseBtn.type = 'button';
      collapseBtn.className = 'btn';
      collapseBtn.textContent = 'Collapse all';
      collapseBtn.addEventListener('click', function(){
        contentRoot.querySelectorAll('details.support-step').forEach(function(d){ d.open = false; });
      });

      toolbar.appendChild(expandBtn);
      toolbar.appendChild(collapseBtn);
      contentRoot.insertBefore(toolbar, contentRoot.firstChild);
    }

  var transformedCount = 0;
  sections.forEach(function(sec){
      var img = null;
      var desc = null;
      // find first image node
      for (var j = 0; j < sec.nodes.length; j++) {
        var n = sec.nodes[j];
        if (n.tagName && n.tagName.toLowerCase() === 'img') { img = n; break; }
        // images can be inside paragraphs
        if (n.tagName && n.tagName.toLowerCase() === 'p') {
          var maybeImg = n.querySelector('img');
          if (!img && maybeImg) { img = maybeImg; }
          // a paragraph without image can serve as description
          if (!desc && !maybeImg) { desc = n; }
        }
      }
  if (!img) return; // skip if no image in this section

      var details = document.createElement('details');
      details.className = 'support-step';

      var summary = document.createElement('summary');
      summary.className = 'step-summary';

      var left = document.createElement('div');
      left.className = 'step-left';
      var title = document.createElement('h3');
      title.textContent = sec.heading.textContent;
      left.appendChild(title);
      if (desc) {
        left.appendChild(desc);
      }

      var right = document.createElement('div');
      right.className = 'step-right';
      // Move the image element itself; if it was inside a paragraph, remove that paragraph if empty
      right.appendChild(img);
      if (img.parentElement && img.parentElement.tagName.toLowerCase() === 'p' && img.parentElement.childElementCount === 1) {
        img.parentElement.remove();
      }

      summary.appendChild(left);
      details.appendChild(summary);
      details.appendChild(right);

      // Insert details before heading and remove original nodes
      contentRoot.insertBefore(details, sec.heading);
      // remove the heading and section nodes (they've been absorbed)
      sec.heading.remove();
      sec.nodes.forEach(function(n){ if (n.isConnected && !details.contains(n)) n.remove(); });
      transformedCount++;
    });

    // If no sections were transformed (e.g., a page without images like Troubleshooting), remove the toolbar if it was added
    if (toolbar && transformedCount === 0) {
      toolbar.remove();
    }
  });
})();
