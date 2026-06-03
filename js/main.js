// ===== 摄影师作品集 - 主脚本 =====

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initGallery();
    initLightbox();
    initContactForm();
    initScrollAnimations();
});

// ===== 导航栏 =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNav();
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollY = window.scrollY + 100;

    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== 作品数据 =====
const galleryData = [
    {
        id: 1,
        title: '午后阳光',
        desc: '人像摄影',
        src: 'images/2306a6ef68cf5d40d5402e22f94d15e.jpg'
    },
    {
        id: 2,
        title: '静谧凝视',
        desc: '风光摄影',
        src: 'images/24828c2ab09d1bc1a554ba06781a50b.jpg'
    },
    {
        id: 3,
        title: '城市剪影',
        desc: '街拍摄影',
        src: 'images/ee7c6fe3be64c33582f73741cf3ccfa.jpg'
    }
];

let currentLightboxIndex = -1;

// ===== 作品渲染 =====
function initGallery() {
    renderGallery();
}

function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');

    galleryGrid.innerHTML = galleryData.map((item, index) => `
        <div class="gallery-item fade-in" data-index="${index}">
            <div class="gallery-item-inner">
                <img src="${item.src}" alt="${item.title}" loading="lazy">
                <div class="gallery-item-overlay">
                    <h4>${item.title}</h4>
                    <span>${item.desc}</span>
                </div>
            </div>
        </div>
    `).join('');

    // 点击打开灯箱
    document.querySelectorAll('.gallery-item').forEach((el) => {
        el.addEventListener('click', () => {
            const index = parseInt(el.dataset.index);
            openLightbox(index);
        });
    });

    // 入场动画
    requestAnimationFrame(() => {
        document.querySelectorAll('.gallery-item.fade-in').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 120);
        });
    });
}

// ===== 灯箱 =====
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));

    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('lightbox').classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxContent();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
    currentLightboxIndex = -1;
}

function navigateLightbox(direction) {
    if (galleryData.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + direction + galleryData.length) % galleryData.length;
    updateLightboxContent();
}

function updateLightboxContent() {
    const item = galleryData[currentLightboxIndex];
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');

    img.src = item.src;
    img.alt = item.title;
    caption.textContent = `${item.title} — ${item.desc} (${currentLightboxIndex + 1} / ${galleryData.length})`;
}

// ===== 联系表单 =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();

        if (!name || !email || !message) {
            shakeElement(form);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            const emailInput = form.querySelector('#email');
            emailInput.style.borderColor = '#e06060';
            emailInput.focus();
            setTimeout(() => emailInput.style.borderColor = '', 2000);
            return;
        }

        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.textContent = '发送中…';
        submitBtn.disabled = true;

        setTimeout(() => {
            form.innerHTML = `
                <div class="form-success visible">
                    <h3>感谢来信！</h3>
                    <p>我已收到你的消息，会尽快回复。</p>
                </div>
            `;
        }, 1200);
    });
}

function shakeElement(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake 0.5s ease';
    setTimeout(() => el.style.animation = '', 500);
}

// 抖动动画
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-6px); }
        80% { transform: translateX(4px); }
    }
`;
document.head.appendChild(shakeStyle);

// ===== 滚动动画 =====
function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    document.querySelectorAll('.about-grid > *').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    document.querySelectorAll('.contact-grid > *').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    }, 200);
}
