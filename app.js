/**
 * INBOXCOPILOT AI — CLIENT-SIDE JAVASCRIPT LOGIC
 * Handles interactive demo scenarios, ROI calculator, FAQ accordion,
 * lead generation audit simulation, and UI enhancements.
 */

// --- 1. SCENARIO DATA FOR "SEE AI IN ACTION" DEMO ---
const DEMO_SCENARIOS = {
  fashion: {
    shopName: "👗 Monalisa Fashion BD",
    stats: { highIntent: 42, lostOpps: 11, priceObj: 6, deliveryObj: 3 },
    messages: [
      {
        sender: 'customer',
        text: 'Price koto? Dhakar baire delivery charge koto lagbe? Ready stock ache?',
        time: '10:14 PM',
        aiTag: { type: 'intent', icon: '🔥', label: 'High Purchase Intent (94%) — Ready to order' }
      },
      {
        sender: 'agent',
        text: 'Price ৳3,450 ma\'am! Dhakar baire delivery ৳130. Stock limited ache.',
        time: '10:16 PM'
      },
      {
        sender: 'customer',
        text: 'Ektu beshi mone hocche apu... discount hobe na? 😕',
        time: '10:18 PM',
        aiTag: { type: 'warning', icon: '⚠️', label: 'Price Objection Detected — Risk of dropping: 68%' }
      },
      {
        sender: 'customer',
        text: 'Thik ache apu, pore janabo.',
        time: '10:20 PM',
        aiTag: { type: 'followup', icon: '🟡', label: 'Follow-up Opportunity — Immediate closing voucher required' }
      }
    ],
    actionText: 'Send follow-up: "Ma\'am ajkei order confirm korle Free Delivery voucher deya jabe! ৳130 save hobe. Apnar address & phone number din please."'
  },
  gadgets: {
    shopName: "🎧 GearX Bangladesh",
    stats: { highIntent: 58, lostOpps: 14, priceObj: 9, deliveryObj: 4 },
    messages: [
      {
        sender: 'customer',
        text: 'Wireless ANC Earbuds ta ki original? Cash on delivery deya jabe Chittagong?',
        time: '04:22 PM',
        aiTag: { type: 'intent', icon: '🔥', label: 'High Purchase Intent (96%) — COD confirmation inquiry' }
      },
      {
        sender: 'agent',
        text: '100% Original Global Version sir! Delivery ৳120 advance nite hoy baki taka COD te paben.',
        time: '04:25 PM'
      },
      {
        sender: 'customer',
        text: 'Advance courier charge dite problem... shob taka deliverir por deya jabe na?',
        time: '04:28 PM',
        aiTag: { type: 'warning', icon: '🚚', label: 'Delivery Policy Friction — 72% drop probability' }
      }
    ],
    actionText: 'Send script: "Sir, apnar trust er jonno SteadyCourier verification ID share korchi. ৳100 advance diye order lock korun, baki product hate peye chek kore deben!"'
  },
  cosmetics: {
    shopName: "💄 GlamGlow Skincare BD",
    stats: { highIntent: 39, lostOpps: 8, priceObj: 4, deliveryObj: 2 },
    messages: [
      {
        sender: 'customer',
        text: 'Apu Centella sunscreen ta ki oily skin er jonno suitable? Authentic Korean product to?',
        time: '08:05 PM',
        aiTag: { type: 'intent', icon: '🔥', label: 'High Purchase Intent (91%) — Product suitability validated' }
      },
      {
        sender: 'agent',
        text: 'Ji apu, non-comedogenic & authentic QR scan kora Korean stock! Price ৳1,550.',
        time: '08:07 PM'
      },
      {
        sender: 'customer',
        text: 'Acha, 2 ta eksathe nile kono special combo discount pabo?',
        time: '08:10 PM',
        aiTag: { type: 'intent', icon: '🛒', label: 'Upsell / Bundle Opportunity (High Value Order)' }
      }
    ],
    actionText: 'Send bundle pitch: "Ji apu! 2 ta nile flat ৳200 discount + Free Korean Sheet Mask gift thakche! Order confirm korte apnar name & address ta bolun."'
  }
};

// --- 2. INITIALIZATION ON DOM READY ---
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDemoPlayer();
  initCalculator();
  initFaqAccordion();
  initScrollAnimations();
});

// --- SCROLL REVEAL MICRO-ANIMATIONS ---
function initScrollAnimations() {
  const animatedSelectors = [
    '.problem-card',
    '.step-card',
    '.feature-box',
    '.audience-card',
    '.dash-metric-card',
    '.dash-panel',
    '.trust-mission-card',
    '.calculator-box',
    '.early-access-card',
    '.form-inner',
    '.faq-item'
  ];

  const elements = document.querySelectorAll(animatedSelectors.join(', '));
  
  elements.forEach((el, index) => {
    el.classList.add('reveal-item');
    el.style.transitionDelay = `${(index % 4) * 0.08}s`;
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    elements.forEach(el => el.classList.add('revealed'));
  }
}

// --- 3. NAVBAR & SMOOTH SCROLL ---
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  // Sticky shadow effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    // Close menu when clicking link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
      });
    });
  }
}

// --- 4. INTERACTIVE LIVE DEMO LOGIC ---
let currentScenarioKey = 'fashion';

function initDemoPlayer() {
  const tabs = document.querySelectorAll('.demo-tab');
  const replayBtn = document.getElementById('btn-replay-demo');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const scenario = tab.getAttribute('data-scenario');
      if (scenario && DEMO_SCENARIOS[scenario]) {
        currentScenarioKey = scenario;
        renderScenario(scenario);
      }
    });
  });

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      renderScenario(currentScenarioKey);
      showToast('🔄 Demo scan replayed successfully');
    });
  }

  // Initial render
  renderScenario('fashion');
}

function renderScenario(key) {
  const data = DEMO_SCENARIOS[key];
  if (!data) return;

  // Update shop header
  const shopBadge = document.getElementById('demo-shop-badge');
  if (shopBadge) shopBadge.textContent = data.shopName;

  // Animate stat counters
  animateCounter('stat-high-intent', data.stats.highIntent);
  animateCounter('stat-lost-opps', data.stats.lostOpps);
  animateCounter('stat-price-obj', data.stats.priceObj);
  animateCounter('stat-delivery-obj', data.stats.deliveryObj);

  // Update action recommendation
  const actionTextEl = document.getElementById('action-recommended-text');
  if (actionTextEl) {
    actionTextEl.textContent = data.actionText;
  }

  // Render chat stream with simulated staggered entrance
  const streamEl = document.getElementById('demo-messages-stream');
  if (!streamEl) return;

  streamEl.innerHTML = '';

  data.messages.forEach((msg, idx) => {
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.style.opacity = '0';
    bubbleWrapper.style.transform = 'translateY(10px)';
    bubbleWrapper.style.transition = `all 0.3s ease ${idx * 0.12}s`;

    let html = '';
    if (msg.sender === 'customer') {
      html += `
        <div class="chat-bubble incoming">
          <p>${escapeHtml(msg.text)}</p>
          <span class="bubble-time">${msg.time}</span>
        </div>
      `;
    } else {
      html += `
        <div class="chat-bubble outgoing">
          <p>${escapeHtml(msg.text)}</p>
          <span class="bubble-time">${msg.time}</span>
        </div>
      `;
    }

    if (msg.aiTag) {
      const tagClass = msg.aiTag.type === 'warning' ? 'warning' : '';
      html += `
        <div class="ai-detected-pill ${tagClass}" style="margin-top: 6px;">
          <span class="ai-pill-icon">${msg.aiTag.icon}</span>
          <span>${escapeHtml(msg.aiTag.label)}</span>
        </div>
      `;
    }

    bubbleWrapper.innerHTML = html;
    streamEl.appendChild(bubbleWrapper);

    // Trigger animation
    setTimeout(() => {
      bubbleWrapper.style.opacity = '1';
      bubbleWrapper.style.transform = 'translateY(0)';
    }, 50);
  });
}

function animateCounter(elemId, targetVal) {
  const el = document.getElementById(elemId);
  if (!el) return;
  
  let current = 0;
  const step = Math.max(1, Math.floor(targetVal / 15));
  const timer = setInterval(() => {
    current += step;
    if (current >= targetVal) {
      el.textContent = targetVal;
      clearInterval(timer);
    } else {
      el.textContent = current;
    }
  }, 25);
}

// --- 5. INTERACTIVE REVENUE LEAKAGE CALCULATOR ---
function initCalculator() {
  const convSlider = document.getElementById('conv-slider');
  const aovSlider = document.getElementById('aov-slider');
  const convCountVal = document.getElementById('conv-count-val');
  const aovVal = document.getElementById('aov-val');
  const lostRevenueVal = document.getElementById('lost-revenue-val');
  const lostOrdersVal = document.getElementById('lost-orders-val');
  const recoverableVal = document.getElementById('recoverable-revenue-val');

  function updateCalc() {
    const convs = parseInt(convSlider.value, 10);
    const aov = parseInt(aovSlider.value, 10);

    convCountVal.textContent = `${convs.toLocaleString()} chats`;
    aovVal.textContent = `৳ ${aov.toLocaleString()}`;

    // Calculation model:
    // ~4% of total chats are high-intent buyers that drop due to response delay or unresolved objection
    const lostBuyers = Math.max(4, Math.round(convs * 0.04));
    const lostRevenue = lostBuyers * aov;
    const recoverable = Math.round(lostRevenue * 0.5); // AI recovers ~50% of dropped hot leads

    lostRevenueVal.textContent = `৳ ${lostRevenue.toLocaleString()}`;
    lostOrdersVal.textContent = `~${lostBuyers} High-Intent Buyers dropped`;
    recoverableVal.textContent = `৳ ${recoverable.toLocaleString()}+`;
  }

  if (convSlider && aovSlider) {
    convSlider.addEventListener('input', updateCalc);
    aovSlider.addEventListener('input', updateCalc);
    updateCalc();
  }
}

// --- 6. FAQ ACCORDION LOGIC ---
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other items
      items.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// --- 7. FREE AI ANALYSIS LEAD SUBMISSION & MODAL ---
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = document.getElementById('lead-audit-form');
  const submitBtn = document.getElementById('btn-submit-form');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');

  const formData = new FormData(form);
  const sellerName = formData.get('sellerName') || 'Store Owner';
  const fbPage = formData.get('fbPage') || 'Your Facebook Page';
  const bizCategory = formData.get('bizCategory') || 'Fashion & Retail';
  const monthlyConv = formData.get('monthlyConv') || '1,200';
  const contactInfo = formData.get('contactInfo') || '';
  const salesProblem = formData.get('salesProblem') || 'Price & drop-offs';

  // UI loading state
  if (btnText) btnText.textContent = 'Generating AI Audit...';
  submitBtn.disabled = true;

  // Simulate AI scan processing
  setTimeout(() => {
    submitBtn.disabled = false;
    if (btnText) btnText.textContent = 'Get My Free Analysis →';

    // Store in localStorage for persistence
    try {
      const leadEntry = {
        sellerName,
        fbPage,
        bizCategory,
        monthlyConv,
        contactInfo,
        salesProblem,
        timestamp: new Date().toISOString()
      };
      const existing = JSON.parse(localStorage.getItem('inbox_copilot_leads') || '[]');
      existing.push(leadEntry);
      localStorage.setItem('inbox_copilot_leads', JSON.stringify(existing));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Populate modal data
    const shopTitle = document.getElementById('modal-shop-title');
    const shopSub = document.getElementById('modal-shop-sub');
    const detailsEl = document.getElementById('modal-shop-details');

    if (shopTitle) shopTitle.textContent = `Audit Request Received: ${fbPage}`;
    if (shopSub) shopSub.textContent = `Prepared for ${sellerName} • Category: ${bizCategory} (${monthlyConv})`;
    if (detailsEl) {
      detailsEl.textContent = `We have received the inquiry profile for "${fbPage}". Our team is preparing a customized conversation review focused on ${bizCategory} sales bottlenecks. You will receive your personalized action playbook via WhatsApp / Email (${contactInfo || 'provided contact'}).`;
    }

    // Open Modal
    openModal();
    showToast(`🎉 Request received for ${sellerName}! Check WhatsApp/Email soon.`);
    form.reset();
  }, 1000);
}

function openModal() {
  const modal = document.getElementById('audit-modal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('audit-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Close modal on backdrop click
const modalOverlay = document.getElementById('audit-modal');
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

// --- 8. UTILITY HELPERS & TOASTS ---
function simulateCopyReply(button) {
  const textToCopy = `"Ma'am ajkei order confirm korle Free Delivery voucher deya jabe! ৳130 save hobe. Apnar address & phone number din please."`;
  navigator.clipboard.writeText(textToCopy).catch(() => {});
  
  const originalText = button.textContent;
  button.textContent = '✓ Copied!';
  button.style.background = '#10B981';
  button.style.borderColor = '#10B981';
  button.style.color = '#fff';

  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = '';
    button.style.borderColor = '';
    button.style.color = '';
  }, 2000);

  showToast('📋 AI Closing Script copied to clipboard!');
}

function simulatePushResponse(button) {
  const originalText = button.innerHTML;
  button.innerHTML = '<span>✓ Pushed to Messenger Inbox!</span>';
  button.style.background = '#10B981';

  setTimeout(() => {
    button.innerHTML = originalText;
    button.style.background = '';
  }, 2500);

  showToast('🚀 Automated follow-up sent to customer thread!');
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span> <div>${escapeHtml(message)}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}
