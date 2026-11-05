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
    hlutools: {
      kicker: '01 / ECOSYSTEM',
      title: 'HLU TOOLS',
      icon: 'wrench',
      description: 'Ứng dụng gốc của hệ sinh thái HLU, dành cho kỹ thuật viên VNPT: tra cứu Tài liệu, Phần mềm, Firmware, Tin tức và E-Learning, cùng các công cụ hỗ trợ xử lý sự cố thực địa như DHCP Explorer. Link dùng thử sẽ được cập nhật sau.',
      tags: ['KTV VNPT', 'Tra cứu', 'Android', 'Đang sử dụng']
    },
    question: {
      kicker: '02 / LEARNING',
      title: 'HLU QUESTIONS BANK',
      icon: 'book-open-check',
      description: 'Ngân hàng câu hỏi E-Learning cho kỹ thuật viên VNPT: tìm nhanh theo từ khóa, phân loại theo chủ đề, dữ liệu được tổng hợp từ nhiều nguồn. Đang chạy tại hlutools.github.io/e-learning, tra cứu được cả khi offline sau khi đã tải trang. Link dùng thử sẽ được cập nhật sau.',
      tags: ['Học tập', 'Tra cứu', 'E-Learning', 'Đang sử dụng']
    },
    hlu5s: {
      kicker: '03 / WORKPLACE',
      title: 'HLU 5S',
      icon: 'clipboard-check',
      description: 'Ứng dụng chấm 5S của VNPT Ninh Bình trên điện thoại (Android, phiên bản 05112026): mở trang 5s.vnptninhbinh.com.vn, đăng nhập bằng SSO VNPT, chấm điểm, đính kèm ảnh trực tiếp từ máy hoặc chụp mới, kéo xuống để làm mới trang. Link dùng thử sẽ được cập nhật sau.',
      tags: ['5S', 'VNPT', 'Android', 'Đang sử dụng']
    },
    clean: {
      kicker: '04 / OPTIMIZATION',
      title: 'HLU Clean Pro',
      icon: 'wand-sparkles',
      description: 'Bộ công cụ dọn dẹp và tối ưu thiết bị trên cả Android (V4.1) và Windows (v2.10.0): quét rác, giải phóng dung lượng, giao diện gọn nhẹ, trực quan và dễ thao tác, với 2 theme Trắng Pro và Tối Pro trên bản Windows. Link dùng thử sẽ được cập nhật sau.',
      tags: ['Android', 'Windows', 'Tối ưu hệ thống', 'Đang phát triển']
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
      dialogKicker.textContent = `HLU / ${product.kicker}`;
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
