/* ============================================================
   Tamil Bible App — script.js
   © 2026 Tamil Bible App • Powered by RPR
   ============================================================ */

'use strict';

/* ── Loading Screen ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 600);
  }
});

/* ── Navbar scroll ── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── Mobile nav toggle ── */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ── Active nav link ── */
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
  });
}
setActiveNav();

/* ── Scroll-to-top ── */
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ── Counter animation ── */
function animateCount(el, target, duration = 1800) {
  let start = 0;
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const step = target / (duration / 16);
  const update = () => {
    start = Math.min(start + step, target);
    el.textContent = prefix + Math.floor(start).toLocaleString() + suffix;
    if (start < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      if (!isNaN(target)) animateCount(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').style.maxHeight = null;
    });
    // Open clicked
    if (!isOpen) {
      item.classList.add('open');
      const answer = item.querySelector('.faq-answer');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* ============================================================
   EmailJS Integration (No Mailto Links / Email Apps)
   ============================================================ */

const PUBLIC_KEY = "Ut7ujiC-7YQYrne6C";
const SERVICE_ID = "service_wuhg9g2";
const TEMPLATE_ID = "__ejs-test-mail-service__";

// Initialize EmailJS SDK
if (typeof emailjs !== 'undefined') {
  try {
    emailjs.init({ publicKey: PUBLIC_KEY });
  } catch (err) {
    console.error('EmailJS SDK init error:', err);
  }
}

/**
 * Sanitizes user text input to prevent XSS injection
 */
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates Email syntax
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Helper to display styled status alerts inside form containers
 */
function showFormAlert(alertEl, type, messageHtml) {
  if (!alertEl) return;
  alertEl.style.display = 'block';
  if (type === 'success') {
    alertEl.style.background = 'rgba(16, 185, 129, 0.15)';
    alertEl.style.border = '1px solid rgba(16, 185, 129, 0.4)';
    alertEl.style.color = '#6ee7b7';
  } else {
    alertEl.style.background = 'rgba(239, 68, 68, 0.15)';
    alertEl.style.border = '1px solid rgba(239, 68, 68, 0.4)';
    alertEl.style.color = '#fca5a5';
  }
  alertEl.innerHTML = messageHtml;
}

/**
 * Resets custom select dropdown menus after form reset
 */
function resetCustomSelects(formEl) {
  if (!formEl) return;
  formEl.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
    const select = wrapper.previousElementSibling;
    if (select && select.options.length > 0) {
      const firstOpt = select.options[0];
      const span = wrapper.querySelector('.custom-select-trigger span');
      if (span) span.textContent = firstOpt.text;
      wrapper.querySelectorAll('.custom-select-item').forEach((item, i) => {
        item.classList.toggle('selected', i === 0);
      });
    }
  });
}

/* ── Delete-Account Request Form (EmailJS) ── */
const deleteForm = document.getElementById('delete-form');
if (deleteForm) {
  let isSubmittingDelete = false;

  deleteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmittingDelete) return;

    const nameInput = document.getElementById('delete-name');
    const emailInput = document.getElementById('delete-email');
    const uidInput = document.getElementById('delete-uid');
    const reasonInput = document.getElementById('delete-reason');
    const messageInput = document.getElementById('delete-message');
    const statusAlert = document.getElementById('delete-status-alert');

    const fullName = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const firebaseUid = uidInput ? uidInput.value.trim() : '';
    const reason = reasonInput ? reasonInput.value.trim() : '';
    const additionalInfo = messageInput ? messageInput.value.trim() : '';

    // Validation
    if (!fullName || fullName.length < 2) {
      showFormAlert(statusAlert, 'error', '⚠️ Please enter your registered Full Name.');
      if (nameInput) nameInput.focus();
      return;
    }

    if (!email || !isValidEmail(email)) {
      showFormAlert(statusAlert, 'error', '⚠️ Please enter a valid registered Email address.');
      if (emailInput) emailInput.focus();
      return;
    }

    isSubmittingDelete = true;
    const submitBtn = deleteForm.querySelector('.form-submit');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '🗑️ Request Account Deletion';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-spinner"></span> Submitting Request...';
    }

    const templateParams = {
      full_name: sanitizeInput(fullName),
      email: sanitizeInput(email),
      firebase_uid: sanitizeInput(firebaseUid) || 'Not Provided',
      reason: sanitizeInput(reason) || 'Not Specified',
      additional_information: sanitizeInput(additionalInfo) || 'None',
      request_date: new Date().toLocaleString(),
      browser: navigator.userAgent,
      platform: navigator.platform
    };

    try {
      if (typeof emailjs !== 'undefined') {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
      } else {
        throw new Error('EmailJS SDK is not loaded. Please check your internet connection.');
      }

      showFormAlert(
        statusAlert,
        'success',
        '✅ <strong>Your account deletion request has been submitted successfully.</strong> We will review your request and contact you via your registered email address.'
      );

      deleteForm.reset();
      resetCustomSelects(deleteForm);

    } catch (err) {
      console.error('Account Deletion submit error:', err);
      showFormAlert(
        statusAlert,
        'error',
        '❌ <strong>Failed to submit request.</strong> Please check your connection and try again.'
      );
    } finally {
      isSubmittingDelete = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
}

/* ── Contact Form (EmailJS) ── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  let isSubmittingContact = false;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmittingContact) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const typeInput = document.getElementById('contact-type');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const deviceInput = document.getElementById('contact-device');
    const statusAlert = document.getElementById('contact-status-alert');

    const fullName = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const messageType = typeInput ? typeInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';
    const device = deviceInput ? deviceInput.value.trim() : '';

    if (!fullName || fullName.length < 2) {
      showFormAlert(statusAlert, 'error', '⚠️ Please enter your Full Name.');
      if (nameInput) nameInput.focus();
      return;
    }

    if (!email || !isValidEmail(email)) {
      showFormAlert(statusAlert, 'error', '⚠️ Please enter a valid Email address.');
      if (emailInput) emailInput.focus();
      return;
    }

    if (!subject || subject.length < 2) {
      showFormAlert(statusAlert, 'error', '⚠️ Please enter a Subject.');
      if (subjectInput) subjectInput.focus();
      return;
    }

    if (!message || message.length < 5) {
      showFormAlert(statusAlert, 'error', '⚠️ Please enter your Message content.');
      if (messageInput) messageInput.focus();
      return;
    }

    isSubmittingContact = true;
    const submitBtn = contactForm.querySelector('.form-submit');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '✉️ Send Message';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-spinner"></span> Sending Message...';
    }

    const templateParams = {
      full_name: sanitizeInput(fullName),
      email: sanitizeInput(email),
      reason: sanitizeInput(messageType) || 'General Support',
      subject: sanitizeInput(subject),
      additional_information: sanitizeInput(message),
      device: sanitizeInput(device) || 'N/A',
      request_date: new Date().toLocaleString(),
      browser: navigator.userAgent,
      platform: navigator.platform
    };

    try {
      if (typeof emailjs !== 'undefined') {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
      } else {
        throw new Error('EmailJS SDK is not loaded. Please check your internet connection.');
      }

      showFormAlert(
        statusAlert,
        'success',
        '✅ <strong>Your message has been submitted successfully.</strong> We will review your message and contact you via your email address.'
      );

      contactForm.reset();
      resetCustomSelects(contactForm);

    } catch (err) {
      console.error('Contact submit error:', err);
      showFormAlert(
        statusAlert,
        'error',
        '❌ <strong>Failed to send message.</strong> Please check your connection and try again.'
      );
    } finally {
      isSubmittingContact = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });
}

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Table of contents links (legal pages) ── */
document.querySelectorAll('.legal-toc ol li').forEach(li => {
  li.addEventListener('click', () => {
    const idx = Array.from(li.parentElement.children).indexOf(li);
    const sections = document.querySelectorAll('.legal-section');
    if (sections[idx]) {
      sections[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Custom Select Enhancer (100% Dark Dropdown Popup) ── */
function initCustomSelects() {
  document.querySelectorAll('.form-group select').forEach(select => {
    if (select.dataset.customized === 'true') return;
    select.dataset.customized = 'true';

    // Hide native select visually
    select.style.display = 'none';

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';
    const selectedOption = select.options[select.selectedIndex] || select.options[0];
    trigger.innerHTML = `<span>${selectedOption ? selectedOption.text : 'Select...'}</span><svg class="custom-select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>`;

    const menu = document.createElement('div');
    menu.className = 'custom-select-menu';

    Array.from(select.options).forEach((opt, idx) => {
      const item = document.createElement('div');
      item.className = 'custom-select-item' + (idx === select.selectedIndex ? ' selected' : '');
      item.textContent = opt.text;
      item.dataset.value = opt.value;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        select.value = opt.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));

        trigger.querySelector('span').textContent = opt.text;
        menu.querySelectorAll('.custom-select-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        wrapper.classList.remove('open');
      });

      menu.appendChild(item);
    });

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
        if (w !== wrapper) w.classList.remove('open');
      });
      wrapper.classList.toggle('open');
    });

    wrapper.appendChild(trigger);
    wrapper.appendChild(menu);

    select.parentNode.insertBefore(wrapper, select.nextSibling);
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-wrapper.open').forEach(w => w.classList.remove('open'));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomSelects);
} else {
  initCustomSelects();
}

