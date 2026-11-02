(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Lucide icons are progressively enhanced; content remains readable without the CDN.
  if (window.lucide) window.lucide.createIcons();

  // Current year in footer.
  const year = $('#current-year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile navigation.
  const menuToggle = $('.menu-toggle');
  const primaryNav = $('#primary-nav');
  if (menuToggle && primaryNav) {
    const closeMenu = () => {
      primaryNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Mở menu');
      menuToggle.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';
      if (window.lucide) window.lucide.createIcons();
    };
    menuToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
      menuToggle.innerHTML = isOpen
        ? '<i data-lucide="x" aria-hidden="true"></i>'
        : '<i data-lucide="menu" aria-hidden="true"></i>';
      if (window.lucide) window.lucide.createIcons();
    });
    $$('.nav-link, .nav-cta', primaryNav).forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    document.addEventListener('click', event => {
      if (primaryNav.classList.contains('open') && !primaryNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  // Reveal sections on scroll.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Count-up stats (only counters with verified values are animated).
  const countItems = $$('[data-count]');
  const animateCount = element => {
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target)) return;
    const duration = 900;
    const start = performance.now();
    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased)).padStart(2, '0');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.7 });
    countItems.forEach(item => countObserver.observe(item));
  } else countItems.forEach(animateCount);

  // Product category filters.
  const filterButtons = $$('.filter-btn');
  const productCards = $$('.tool-card');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      productCards.forEach(card => {
        const categories = (card.dataset.category || '').split(/\s+/);
        const visible = filter === 'all' || categories.includes(filter);
        card.hidden = !visible;
      });
    });
  });

  // Product detail dialog.
  const products = {
    clean: {
      kicker: '01 / OPTIMIZATION',
      title: 'HLU Clean Pro',
      icon: 'wand-sparkles',
      description: 'Bộ công cụ hỗ trợ dọn dẹp và tối ưu thiết bị, hướng đến trải nghiệm gọn nhẹ, trực quan và dễ thao tác. Hãy cập nhật mô tả này theo tính năng và nền tảng phát hành chính thức của sản phẩm.',
      tags: ['Tiện ích', 'Tối ưu hệ thống', 'Đang phát triển']
    },
    question: {
      kicker: '02 / LEARNING',
      title: 'Ngân hàng câu hỏi',
      icon: 'book-open-check',
      description: 'Nền tảng hỗ trợ lưu trữ, phân loại và tra cứu ngân hàng câu hỏi. Có thể bổ sung tại đây thông tin về đối tượng sử dụng, môn học, cách tìm kiếm và các chức năng chính khi sản phẩm được hoàn thiện.',
      tags: ['Học tập', 'Tra cứu', 'Đang hoàn thiện']
    },
    ghtt: {
      kicker: '03 / IN DEVELOPMENT',
      title: 'GHTT',
      icon: 'blocks',
      description: 'GHTT là dự án thuộc hệ sinh thái HLU TOOLS. Tên đầy đủ, mục tiêu, tính năng và trạng thái phát hành đang để mở để bạn cập nhật theo thông tin chính thức.',
      tags: ['Dự án mới', 'Thông tin cập nhật']
    }
  };
  const dialog = $('#product-dialog');
  const dialogTitle = $('#dialog-title');
  const dialogDesc = $('#dialog-description');
  const dialogKicker = $('#dialog-kicker');
  const dialogIcon = $('#dialog-icon');
  const dialogTags = $('#dialog-tags');
  const closeDialog = () => { if (dialog?.open) dialog.close(); };

  $$('.detail-trigger').forEach(button => {
    button.addEventListener('click', () => {
      const product = products[button.dataset.product];
      if (!product || !dialog) return;
      dialogKicker.textContent = `HLU TOOLS / ${product.kicker}`;
      dialogTitle.textContent = product.title;
      dialogDesc.textContent = product.description;
      dialogIcon.innerHTML = `<i data-lucide="${product.icon}" aria-hidden="true"></i>`;
      dialogTags.replaceChildren(...product.tags.map(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        return span;
      }));
      if (window.lucide) window.lucide.createIcons();
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    });
  });
  $('.dialog-close')?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) closeDialog();
  });
  $('#dialog-contact')?.addEventListener('click', closeDialog);

  // Contact form is intentionally front-end only; no data is transmitted.
  const contactForm = $('#contact-form');
  const formFeedback = $('#form-feedback');
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const name = $('#contact-name').value.trim();
    formFeedback.textContent = `Cảm ơn ${name}! Đây là bản demo giao diện; biểu mẫu chưa được kết nối để gửi thông tin. Vui lòng thay bằng email hoặc backend chính thức trước khi phát hành.`;
    formFeedback.classList.add('success');
    contactForm.reset();
  });

  // Placeholder social links are kept safe until official URLs are supplied.
  $$('.placeholder-link').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const label = link.dataset.label || 'Liên kết';
      const existing = $('#link-placeholder-notice');
      if (existing) existing.remove();
      const notice = document.createElement('div');
      notice.id = 'link-placeholder-notice';
      notice.setAttribute('role', 'status');
      notice.textContent = `${label}: vui lòng cập nhật đường dẫn chính thức trong index.html.`;
      notice.style.cssText = 'position:fixed;bottom:20px;left:50%;z-index:999;transform:translateX(-50%);max-width:calc(100% - 32px);padding:12px 16px;border:1px solid rgba(0,240,255,.35);border-radius:10px;background:#102238;color:#dff8ff;font-size:12px;box-shadow:0 8px 30px rgba(0,0,0,.35);text-align:center;';
      document.body.append(notice);
      window.setTimeout(() => notice.remove(), 3200);
    });
  });

  // Current section indicator in the sticky navigation.
  const sections = $$('main section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }
})();
