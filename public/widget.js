/**
 * Photo Builder Widget v2.0
 * Self-contained embeddable widget for AI-powered photo colorization.
 *
 * Usage:
 *   <div id="photo_builder"></div>
 *   <script src="https://example.com/widget.js"></script>
 *
 * The widget auto-initializes, fetches the tenant config & palettes from the API,
 * renders a multi-step form, handles submission with file uploads, and polls
 * for the generated result.
 */
(function () {
  'use strict';

  /* ========================================================================
     CONFIGURATION
     ======================================================================== */
  var API_BASE = '/api';
  var MAX_IMAGES = 1;
  var ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  var ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
  var MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  var POLL_INTERVAL = 3000; // 3 seconds
  var PROMPT_MAX_CHARS = 155;



  /* ========================================================================
     STATE
     ======================================================================== */
  var state = {
    step: 1,
    config: null,
    categories: [],
    swatches: [],
    selectedCategoryId: null,
    selectedCategoryName: null,
    selectedSwatchId: null,
    selectedTenantId: null,
    selectedProductId: null,
    form: {
      name: '',
      phone: '',
      city: '',
      email: '',
      prompt: ''
    },
    images: [],
    submissionUuid: null,
    submissionResult: null,
    pollingTimer: null,
    submitting: false,
    error: null,
    isAuthenticated: false,
    userData: null
  };

  /* ========================================================================
     DOM REFS
     ======================================================================== */
  var container = null;
  var widgetEl = null;

  /* ========================================================================
     UTILITY FUNCTIONS
     ======================================================================== */

  function el(tag, attrs, children) {
    var element = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === 'className') {
          element.className = attrs[key];
        } else if (key === 'style') {
          Object.keys(attrs[key]).forEach(function (styleKey) {
            element.style[styleKey] = attrs[key][styleKey];
          });
        } else if (key === 'dataset') {
          Object.keys(attrs[key]).forEach(function (dataKey) {
            element.dataset[dataKey] = attrs[key][dataKey];
          });
        } else if (key.startsWith('on')) {
          element.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
        } else if (key === 'htmlFor') {
          element.setAttribute('for', attrs[key]);
        } else {
          element.setAttribute(key, attrs[key]);
        }
      });
    }
    if (children) {
      if (typeof children === 'string') {
        element.textContent = children;
      } else if (Array.isArray(children)) {
        children.forEach(function (child) {
          if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
          } else if (child instanceof Node) {
            element.appendChild(child);
          }
        });
      } else if (children instanceof Node) {
        element.appendChild(children);
      }
    }
    return element;
  }

  function primaryColor() {
    return state.config && state.config.primary_color ? state.config.primary_color : '#4F46E5';
  }

  function secondaryColor() {
    return state.config && state.config.secondary_color ? state.config.secondary_color : '#7C3AED';
  }

  function lightenColor(hex, percent) {
    var num = parseInt(hex.replace('#', ''), 16);
    var amt = Math.round(2.55 * percent);
    var R = Math.min(255, (num >> 16) + amt);
    var G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    var B = Math.min(255, (num & 0x0000ff) + amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  }

  function darkenColor(hex, percent) {
    var num = parseInt(hex.replace('#', ''), 16);
    var amt = Math.round(2.55 * percent);
    var R = Math.max(0, (num >> 16) - amt);
    var G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
    var B = Math.max(0, (num & 0x0000ff) - amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  }

  function hexToRgba(hex, alpha) {
    var num = parseInt(hex.replace('#', ''), 16);
    var r = (num >> 16) & 0xff;
    var g = (num >> 8) & 0xff;
    var b = num & 0xff;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  function sanitizeText(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  function getFileExtension(filename) {
    return filename.substring(filename.lastIndexOf('.')).toLowerCase();
  }

  function isAllowedFile(file) {
    var ext = getFileExtension(file.name);
    var typeOk = ALLOWED_FILE_TYPES.indexOf(file.type) !== -1;
    var extOk = ALLOWED_EXTENSIONS.indexOf(ext) !== -1;
    return (typeOk || extOk) && file.size <= MAX_FILE_SIZE;
  }

  function getFileValidationError(file) {
    var ext = getFileExtension(file.name);
    var typeOk = ALLOWED_FILE_TYPES.indexOf(file.type) !== -1;
    var extOk = ALLOWED_EXTENSIONS.indexOf(ext) !== -1;
    if (!typeOk && !extOk) {
      return 'Yaln\u0131zca JPG, PNG ve WebP dosyalar\u0131na izin verilir.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Dosya boyutu 5 MB\u2019\u0131 ge\xe7emez.';
    }
    return null;
  }

  /* ========================================================================
     API HELPERS
     ======================================================================== */

  function apiFetch(path, options) {
    var url = window.location.origin + API_BASE + path;
    options = options || {};
    options.headers = options.headers || {};
    options.headers['Accept'] = 'application/json';

    return fetch(url, options).then(function (response) {
      if (response.status === 429) {
        throw new Error('\xC7ok fazla istek. L\xfctfen biraz bekleyip tekrar deneyin.');
      }
      if (!response.ok) {
        return response.json().then(function (data) {
          var message = data.message || data.error || 'Beklenmeyen bir hata olu\u015ftu.';
          throw new Error(message);
        }).catch(function (err) {
          if (err instanceof SyntaxError) {
            throw new Error('Beklenmeyen bir hata olu\u015ftu. L\xfctfen tekrar deneyin.');
          }
          throw err;
        });
      }
      return response.json();
    }).catch(function (err) {
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        throw new Error('A\u011f hatas\u0131. \u0130nternet ba\u011flant\u0131n\u0131z\u0131 kontrol edin.');
      }
      throw err;
    });
  }

  function fetchConfig() {
    return apiFetch('/widget/config');
  }

  function fetchCategories() {
    return apiFetch('/categories');
  }

  function fetchSwatches(categoryId, tenantId, productId) {
    var path = '/swatches?category_id=' + encodeURIComponent(categoryId);
    if (tenantId) {
      path += '&tenant_id=' + encodeURIComponent(tenantId);
    }
    if (productId) {
      path += '&product_id=' + encodeURIComponent(productId);
    }
    return apiFetch(path);
  }

  function submitForm(formData) {
    return apiFetch('/submissions', {
      method: 'POST',
      body: formData
    });
  }

  function fetchSubmissionStatus(uuid) {
    return apiFetch('/submissions/' + encodeURIComponent(uuid) + '/status');
  }

  function fetchSubmissionDetail(uuid) {
    return apiFetch('/submissions/' + encodeURIComponent(uuid));
  }

  /* ========================================================================
     STYLES
     ======================================================================== */

  var widgetStyles = {
    container: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#1f2937',
      maxWidth: '100%',
      width: '100%',
      boxSizing: 'border-box'
    },
    header: {
      textAlign: 'center',
      padding: '20px 16px 8px'
    },
    logo: {
      maxHeight: '40px',
      width: 'auto',
      marginBottom: '8px'
    },
    title: {
      fontSize: '18px',
      fontWeight: 700,
      margin: '0 0 4px'
    },
    subtitle: {
      fontSize: '13px',
      color: '#6b7280',
      margin: '0'
    },
    stepIndicator: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '16px 16px 8px',
      gap: '0'
    },
    stepDot: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 600,
      transition: 'all 0.3s ease',
      flexShrink: 0
    },
    stepLine: {
      flex: '1',
      height: '2px',
      minWidth: '16px',
      maxWidth: '48px',
      transition: 'background 0.3s ease'
    },
    stepLabel: {
      fontSize: '11px',
      color: '#9ca3af',
      textAlign: 'center',
      marginTop: '4px'
    },
    body: {
      padding: '16px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '4px'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box',
      backgroundColor: '#fff'
    },
    textarea: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      resize: 'vertical',
      minHeight: '60px',
      fontFamily: 'inherit'
    },
    errorText: {
      color: '#ef4444',
      fontSize: '12px',
      marginTop: '4px'
    },
    buttonPrimary: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      padding: '10px 24px',
      fontSize: '14px',
      fontWeight: 600,
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.1s',
      minWidth: '100px'
    },
    buttonSecondary: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      padding: '10px 24px',
      fontSize: '14px',
      fontWeight: 600,
      color: '#374151',
      backgroundColor: '#f3f4f6',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.1s'
    },
    buttonDanger: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px 10px',
      fontSize: '12px',
      fontWeight: 600,
      color: '#ef4444',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    buttonRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
      marginTop: '20px',
      flexWrap: 'wrap'
    },
    dropZone: {
      border: '2px dashed #d1d5db',
      borderRadius: '12px',
      padding: '32px 16px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'border-color 0.2s, background-color 0.2s',
      backgroundColor: '#fafafa'
    },
    dropZoneActive: {
      borderColor: '#4F46E5',
      backgroundColor: '#eef2ff'
    },
    dropIcon: {
      width: '40px',
      height: '40px',
      marginBottom: '8px',
      color: '#9ca3af'
    },
    previewGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
      gap: '10px',
      marginTop: '12px'
    },
    previewItem: {
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      aspectRatio: '1',
      backgroundColor: '#f3f4f6',
      border: '1px solid #e5e7eb'
    },
    previewImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    },
    previewRemove: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      backgroundColor: 'rgba(0,0,0,0.6)',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      lineHeight: '22px',
      textAlign: 'center',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    surfaceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
      gap: '8px',
      marginBottom: '12px'
    },
    surfaceItem: {
      padding: '10px 8px',
      borderRadius: '8px',
      border: '2px solid #e5e7eb',
      textAlign: 'center',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 500,
      transition: 'all 0.15s',
      backgroundColor: '#fff',
      color: '#374151',
      userSelect: 'none'
    },
    surfaceItemSelected: {
      borderColor: '#4F46E5',
      backgroundColor: '#eef2ff',
      color: '#4F46E5',
      fontWeight: 600
    },
    paletteGroup: {
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      marginBottom: '10px',
      overflow: 'hidden'
    },
    paletteGroupHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 14px',
      cursor: 'pointer',
      backgroundColor: '#f9fafb',
      transition: 'background-color 0.15s',
      userSelect: 'none'
    },
    paletteGroupTitle: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#1f2937',
      margin: 0
    },
    paletteGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))',
      gap: '8px',
      padding: '12px 14px'
    },
    paletteSwatch: {
      width: '100%',
      aspectRatio: '1',
      borderRadius: '8px',
      cursor: 'pointer',
      border: '2px solid transparent',
      transition: 'all 0.15s',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      fontWeight: 600,
      color: '#fff',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px solid #f3f4f6',
      fontSize: '13px'
    },
    summaryLabel: {
      color: '#6b7280',
      fontWeight: 500
    },
    summaryValue: {
      color: '#1f2937',
      fontWeight: 600,
      textAlign: 'right',
      maxWidth: '60%',
      wordBreak: 'break-word'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
      textAlign: 'center'
    },
    spinner: {
      width: '36px',
      height: '36px',
      border: '3px solid #e5e7eb',
      borderTopColor: '#4F46E5',
      borderRadius: '50%',
      animation: 'pb-spin 0.8s linear infinite',
      marginBottom: '12px'
    },
    progressBar: {
      width: '100%',
      maxWidth: '280px',
      height: '6px',
      backgroundColor: '#e5e7eb',
      borderRadius: '3px',
      overflow: 'hidden',
      marginTop: '8px'
    },
    progressFill: {
      height: '100%',
      borderRadius: '3px',
      transition: 'width 0.5s ease'
    },
    resultContainer: {
      textAlign: 'center',
      padding: '16px 0'
    },
    resultImage: {
      maxWidth: '100%',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '12px'
    },
    resultGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      maxWidth: '600px',
      gap: '12px',
      marginTop: '12px'
    },
    errorBox: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '10px',
      padding: '12px 16px',
      color: '#dc2626',
      fontSize: '13px',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px'
    },
    successBox: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '10px',
      padding: '12px 16px',
      color: '#16a34a',
      fontSize: '13px',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px'
    },
    requiredStar: {
      color: '#ef4444',
      marginLeft: '2px'
    },
    mobileBreakpoint: '480px'
  };

  /* ========================================================================
     INJECT KEYFRAMES
     ======================================================================== */
  function injectKeyframes() {
    if (document.getElementById('pb-widget-styles')) return;
    var styleEl = document.createElement('style');
    styleEl.id = 'pb-widget-styles';
    styleEl.textContent =
      '@keyframes pb-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } ' +
      '.pb-fade-in { animation: pb-fade-in 0.3s ease; } ' +
      '@keyframes pb-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } } ' +
      '.pb-slide-up { animation: pb-slide-up 0.3s ease; } ' +
      '@keyframes pb-slide-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }';
    document.head.appendChild(styleEl);
  }

  /* ========================================================================
     INPUT EVENT HANDLERS
     ======================================================================== */
  function applyInputStyles(inputEl) {
    var pc = primaryColor();
    inputEl.addEventListener('focus', function () {
      inputEl.style.borderColor = pc;
      inputEl.style.boxShadow = '0 0 0 3px ' + hexToRgba(pc, 0.15);
    });
    inputEl.addEventListener('blur', function () {
      inputEl.style.borderColor = '#d1d5db';
      inputEl.style.boxShadow = 'none';
    });
  }

  /* ========================================================================
     RENDER FUNCTIONS
     ======================================================================== */

  function clearWidget() {
    if (widgetEl) {
      widgetEl.innerHTML = '';
    }
  }

  function render(html) {
    if (widgetEl) {
      widgetEl.innerHTML = '';
      widgetEl.appendChild(html);
    }
  }

  function renderLoading(message) {
    clearWidget();
    var container = el('div', { style: widgetStyles.loadingContainer },
      [
        el('div', { style: widgetStyles.spinner }),
        el('p', {
          style: { color: '#6b7280', fontSize: '13px', margin: '4px 0 0' }
        }, message || 'Y\xfckleniyor\u2026')
      ]
    );
    container.className = 'pb-fade-in';
    render(container);
  }

  function renderError(message) {
    clearWidget();
    var container = el('div', { style: { padding: '20px 16px' } },
      el('div', { style: widgetStyles.errorBox },
        [
          el('span', { style: { flexShrink: 0, fontSize: '16px' } }, '\u26a0'),
          el('span', {}, message)
        ]
      )
    );
    container.className = 'pb-fade-in';
    render(container);
  }

  /* Step indicator */
  function renderStepIndicator(currentStep) {
    var steps = [
      { num: 1, label: 'Bilgi' },
      { num: 2, label: 'Kategori' },
      { num: 3, label: 'Kartela' },
      { num: 4, label: 'G\xf6rsel' },
      { num: 5, label: '\u0130stek' },
      { num: 6, label: 'G\xf6nder' }
    ];
    var pc = primaryColor();
    var sc = secondaryColor();

    var container = el('div', { style: widgetStyles.stepIndicator });

    steps.forEach(function (step, idx) {
      var isActive = step.num === currentStep;
      var isCompleted = step.num < currentStep;

      var dotStyle = Object.assign({}, widgetStyles.stepDot);
      if (isCompleted) {
        dotStyle.backgroundColor = pc;
        dotStyle.color = '#fff';
      } else if (isActive) {
        dotStyle.backgroundColor = hexToRgba(pc, 0.15);
        dotStyle.color = pc;
        dotStyle.border = '2px solid ' + pc;
      } else {
        dotStyle.backgroundColor = '#f3f4f6';
        dotStyle.color = '#9ca3af';
      }
      var dot = el('div', { style: dotStyle },
        isCompleted ? '\u2713' : String(step.num)
      );

      container.appendChild(dot);

      if (idx < steps.length - 1) {
        var lineStyle = Object.assign({}, widgetStyles.stepLine);
        lineStyle.backgroundColor = step.num <= currentStep ? pc : '#e5e7eb';
        container.appendChild(el('div', { style: lineStyle }));
      }
    });

    var labelContainer = el('div', {
      style: {
        display: 'flex',
        justifyContent: 'center',
        gap: '0',
        padding: '0 16px 8px'
      }
    });

    steps.forEach(function (step, idx) {
      var isActive = step.num === currentStep;
      var label = el('span', {
        style: Object.assign({}, widgetStyles.stepLabel, {
          color: isActive ? pc : '#9ca3af',
          fontWeight: isActive ? 600 : 400
        })
      }, step.label);
      labelContainer.appendChild(label);
      if (idx < steps.length - 1) {
        var spacer = el('span', {
          style: Object.assign({}, widgetStyles.stepLine, {
            backgroundColor: 'transparent',
            minWidth: '16px',
            maxWidth: '48px',
            height: 'auto'
          })
        });
        labelContainer.appendChild(spacer);
      }
    });

    var wrapper = el('div', {}, [container, labelContainer]);
    return wrapper;
  }

  /* ========================================================================
     STEP 1 — User Info (name, phone, city, email optional)
     ======================================================================== */
  function renderStep1() {
    clearWidget();
    var pc = primaryColor();

    var wrapper = el('div', {}, [
      renderStepIndicator(1),
      el('div', { style: widgetStyles.body }
    )]);

    var form = el('div', { className: 'pb-fade-in' });

    // Name
    var nameGroup = el('div', { style: widgetStyles.formGroup });
    var nameLabel = el('label', {
      style: widgetStyles.label,
      htmlFor: 'pb-name'
    }, ['Ad Soyad', el('span', { style: widgetStyles.requiredStar }, '*')]);
    var nameInput = el('input', {
      type: 'text',
      id: 'pb-name',
      placeholder: 'Ad\u0131n\u0131z ve soyad\u0131n\u0131z',
      style: widgetStyles.input,
      value: state.form.name
    });
    applyInputStyles(nameInput);
    nameInput.addEventListener('input', function (e) {
      state.form.name = e.target.value;
      clearFieldError('pb-name-error');
    });
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);
    nameGroup.appendChild(el('div', { id: 'pb-name-error', style: widgetStyles.errorText }));
    form.appendChild(nameGroup);

    // Phone
    var phoneGroup = el('div', { style: widgetStyles.formGroup });
    var phoneLabel = el('label', {
      style: widgetStyles.label,
      htmlFor: 'pb-phone'
    }, ['Telefon', el('span', { style: widgetStyles.requiredStar }, '*')]);
    var phoneInput = el('input', {
      type: 'tel',
      id: 'pb-phone',
      placeholder: '05XX XXX XX XX',
      style: widgetStyles.input,
      value: state.form.phone
    });
    applyInputStyles(phoneInput);
    phoneInput.addEventListener('input', function (e) {
      state.form.phone = e.target.value;
      clearFieldError('pb-phone-error');
    });
    phoneGroup.appendChild(phoneLabel);
    phoneGroup.appendChild(phoneInput);
    phoneGroup.appendChild(el('div', { id: 'pb-phone-error', style: widgetStyles.errorText }));
    form.appendChild(phoneGroup);

    // City
    var cityGroup = el('div', { style: widgetStyles.formGroup });
    var cityLabel = el('label', {
      style: widgetStyles.label,
      htmlFor: 'pb-city'
    }, ['\u015eehir', el('span', { style: widgetStyles.requiredStar }, '*')]);
    var cityInput = el('input', {
      type: 'text',
      id: 'pb-city',
      placeholder: '\u015eehir ad\u0131',
      style: widgetStyles.input,
      value: state.form.city
    });
    applyInputStyles(cityInput);
    cityInput.addEventListener('input', function (e) {
      state.form.city = e.target.value;
      clearFieldError('pb-city-error');
    });
    cityGroup.appendChild(cityLabel);
    cityGroup.appendChild(cityInput);
    cityGroup.appendChild(el('div', { id: 'pb-city-error', style: widgetStyles.errorText }));
    form.appendChild(cityGroup);

    // Email (optional)
    var emailGroup = el('div', { style: widgetStyles.formGroup });
    var emailLabel = el('label', {
      style: widgetStyles.label,
      htmlFor: 'pb-email'
    }, ['E-Posta (Opsiyonel)']);
    var emailInput = el('input', {
      type: 'email',
      id: 'pb-email',
      placeholder: 'ornek@email.com',
      style: widgetStyles.input,
      value: state.form.email
    });
    applyInputStyles(emailInput);
    emailInput.addEventListener('input', function (e) {
      state.form.email = e.target.value;
      clearFieldError('pb-email-error');
    });
    emailGroup.appendChild(emailLabel);
    emailGroup.appendChild(emailInput);
    emailGroup.appendChild(el('div', { id: 'pb-email-error', style: widgetStyles.errorText }));
    form.appendChild(emailGroup);

    // Buttons
    var btnRow = el('div', { style: Object.assign({}, widgetStyles.buttonRow, { justifyContent: 'flex-end' }) });
    var nextBtn = el('button', {
      style: Object.assign({}, widgetStyles.buttonPrimary, { backgroundColor: pc }),
      onMouseOver: function () { this.style.backgroundColor = darkenColor(pc, 10); },
      onMouseOut: function () { this.style.backgroundColor = pc; }
    }, ' \u0130leri \u2192');
    nextBtn.addEventListener('click', function () {
      if (validateStep1()) {
        state.step = 2;
        renderStep(2);
      }
    });
    btnRow.appendChild(nextBtn);
    form.appendChild(btnRow);

    wrapper.appendChild(form);
    render(wrapper);
  }

  function validateStep1() {
    var valid = true;
    var name = state.form.name.trim();
    var phone = state.form.phone.trim();
    var city = state.form.city.trim();
    var email = state.form.email.trim();

    if (!name) {
      showFieldError('pb-name-error', 'Ad Soyad gereklidir.');
      valid = false;
    }
    if (!phone) {
      showFieldError('pb-phone-error', 'Telefon numaras\u0131 gereklidir.');
      valid = false;
    }
    if (!city) {
      showFieldError('pb-city-error', '\u015eehir gereklidir.');
      valid = false;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError('pb-email-error', 'Ge\xe7erli bir e-posta adresi giriniz.');
      valid = false;
    }
    return valid;
  }

  function showFieldError(id, message) {
    var el_ = document.getElementById(id);
    if (el_) el_.textContent = message;
  }

  function clearFieldError(id) {
    var el_ = document.getElementById(id);
    if (el_) el_.textContent = '';
  }

  /* ========================================================================
     STEP 2 — Category Selection (paint area)
     ======================================================================== */
  function renderStep2() {
    clearWidget();
    var pc = primaryColor();

    var wrapper = el('div', {}, [
      renderStepIndicator(2),
      el('div', { style: widgetStyles.body })
    ]);

    var content = el('div', { className: 'pb-fade-in' });

    content.appendChild(
      el('p', {
        style: { fontSize: '13px', color: '#6b7280', margin: '0 0 12px' }
      }, 'Boyanacak yeri se\xe7in.')
    );

    // Category grid
    var grid = el('div', { style: widgetStyles.surfaceGrid });
    if (!state.categories || state.categories.length === 0) {
      content.appendChild(
        el('p', { style: { color: '#9ca3af', textAlign: 'center', padding: '20px' } },
          'Kategori bulunamad\u0131.'
        )
      );
    } else {
      state.categories.forEach(function (cat) {
        var isSelected = state.selectedCategoryId === cat.id;
        var itemStyle = Object.assign({}, widgetStyles.surfaceItem);
        if (isSelected) {
          itemStyle = Object.assign(itemStyle, widgetStyles.surfaceItemSelected);
          itemStyle.borderColor = pc;
        }
        var item = el('div', { style: itemStyle }, cat.name);
        item.addEventListener('click', function () {
          state.selectedCategoryId = cat.id;
          state.selectedCategoryName = cat.name;
                    state.selectedSwatchId = null;
          state.selectedTenantId = null;
          state.selectedProductId = null;
          state.swatches = [];
          renderStep2();
        });
        grid.appendChild(item);
      });
      content.appendChild(grid);
    }

    // Buttons
    var btnRow = el('div', { style: widgetStyles.buttonRow });
    var backBtn = el('button', {
      style: Object.assign({}, widgetStyles.buttonSecondary),
      onMouseOver: function () { this.style.backgroundColor = '#e5e7eb'; },
      onMouseOut: function () { this.style.backgroundColor = '#f3f4f6'; }
    }, '\u2190 Geri');
    backBtn.addEventListener('click', function () {
      state.step = 1;
      renderStep(1);
    });

    var nextBtn = el('button', {
      style: Object.assign({}, widgetStyles.buttonPrimary, { backgroundColor: pc }),
      onMouseOver: function () { this.style.backgroundColor = darkenColor(pc, 10); },
      onMouseOut: function () { this.style.backgroundColor = pc; }
    }, ' \u0130leri \u2192');
    nextBtn.addEventListener('click', function () {
      if (!state.selectedCategoryId) {
        showFieldError('pb-category-error', 'L\xfctfen bir yer se\xe7in.');
        return;
      }
      state.step = 3;
      renderStep(3);
    });

    btnRow.appendChild(backBtn);
    btnRow.appendChild(nextBtn);
    content.appendChild(btnRow);
    content.appendChild(el('div', { id: 'pb-category-error', style: widgetStyles.errorText }));

    wrapper.appendChild(content);
    render(wrapper);
  }

  /* ========================================================================
     STEP 3 — Palette Selection (single select)
     ======================================================================== */
  function renderStep3() {
    clearWidget();
    var pc = primaryColor();

    // Auto-load swatches if not loaded for current category
    if (!state.swatches || state.swatches.length === 0) {
      loadSwatches(state.selectedCategoryId, state.selectedTenantId, state.selectedProductId);
      return;
    }

    var wrapper = el('div', {}, [
      renderStepIndicator(3),
      el('div', { style: widgetStyles.body })
    ]);

    var content = el('div', { className: 'pb-fade-in' });

    content.appendChild(
      el('p', {
        style: { fontSize: '13px', color: '#6b7280', margin: '0 0 12px' }
      }, 'Tercih etti\u011finiz kartelay\u0131 se\xe7in (tek se\xe7im).')
    );

    // Filters
    if (state.swatches && state.swatches.length > 0) {
      var uniqueTenants = [];
      var seenTenantIds = {};
      var uniqueProducts = [];
      var seenProductIds = {};

      state.swatches.forEach(function (k) {
        if (k.tenant_id && !seenTenantIds[k.tenant_id]) {
          seenTenantIds[k.tenant_id] = true;
          uniqueTenants.push({ id: k.tenant_id, name: k.tenant_name });
        }
        if (!seenProductIds[k.product_id]) {
          seenProductIds[k.product_id] = true;
          uniqueProducts.push({ id: k.product_id, name: k.product_name });
        }
      });

      // Brand (tenant) filter
      if (uniqueTenants.length > 0) {
        var brandGroup = el('div', { style: widgetStyles.formGroup });

        var brandLabel = el('label', {
          style: widgetStyles.label,
          htmlFor: 'pb-brand-filter'
        }, 'Marka');

        var brandSelect = el('select', {
          id: 'pb-brand-filter',
          style: Object.assign({}, widgetStyles.input, { appearance: 'auto' })
        });

        var allBrand = el('option', { value: '' }, 'T\xfcm\xfc');
        brandSelect.appendChild(allBrand);

        uniqueTenants.forEach(function (t) {
          var opt = el('option', { value: t.id }, t.name);
          if (state.selectedTenantId === t.id) {
            opt.selected = true;
          }
          brandSelect.appendChild(opt);
        });

        brandSelect.addEventListener('change', function () {
          var tid = this.value ? parseInt(this.value, 10) : null;
          state.selectedTenantId = tid;
          state.selectedProductId = null;
          state.selectedSwatchId = null;
          loadSwatches(state.selectedCategoryId, tid, null);
        });

        brandGroup.appendChild(brandLabel);
        brandGroup.appendChild(brandSelect);
        content.appendChild(brandGroup);
      }

      // Product (model) filter
      if (uniqueProducts.length > 1) {
        var modelGroup = el('div', { style: widgetStyles.formGroup });

        var modelLabel = el('label', {
          style: widgetStyles.label,
          htmlFor: 'pb-product-filter'
        }, 'Model Filtrele');

        var modelSelect = el('select', {
          id: 'pb-product-filter',
          style: Object.assign({}, widgetStyles.input, { appearance: 'auto' })
        });

        var allModel = el('option', { value: '' }, 'T\xfcm Modeller');
        modelSelect.appendChild(allModel);

        uniqueProducts.forEach(function (p) {
          var opt = el('option', { value: p.id }, p.name);
          if (state.selectedProductId === p.id) {
            opt.selected = true;
          }
          modelSelect.appendChild(opt);
        });

        modelSelect.addEventListener('change', function () {
          var pid = this.value ? parseInt(this.value, 10) : null;
          state.selectedProductId = pid;
          state.selectedSwatchId = null;
          loadSwatches(state.selectedCategoryId, state.selectedTenantId, pid);
        });

        modelGroup.appendChild(modelLabel);
        modelGroup.appendChild(modelSelect);
        content.appendChild(modelGroup);
      }
    }

    // Swatch grid
    if (!state.swatches || state.swatches.length === 0) {
      content.appendChild(
        el('p', { style: { color: '#9ca3af', textAlign: 'center', padding: '20px' } },
          'Bu kategori i\xe7in kartela bulunamad\u0131.'
        )
      );
    } else {
      var grid = el('div', { style: widgetStyles.paletteGrid });
      state.swatches.forEach(function (swatch) {
        grid.appendChild(renderSwatchCard(swatch, pc));
      });
      content.appendChild(grid);
    }

    // Buttons
    var btnRow = el('div', { style: widgetStyles.buttonRow });
    var backBtn = el('button', {
      style: Object.assign({}, widgetStyles.buttonSecondary),
      onMouseOver: function () { this.style.backgroundColor = '#e5e7eb'; },
      onMouseOut: function () { this.style.backgroundColor = '#f3f4f6'; }
    }, '\u2190 Geri');
    backBtn.addEventListener('click', function () {
      state.step = 2;
      renderStep(2);
    });

    var nextBtn = el('button', {
      style: Object.assign({}, widgetStyles.buttonPrimary, { backgroundColor: pc }),
      onMouseOver: function () { this.style.backgroundColor = darkenColor(pc, 10); },
      onMouseOut: function () { this.style.backgroundColor = pc; }
    }, ' \u0130leri \u2192');
    nextBtn.addEventListener('click', function () {
      if (!state.selectedSwatchId) {
        showFieldError('pb-swatch-error', 'L\xfctfen bir kartela se\xe7in.');
        return;
      }
      state.step = 4;
      renderStep(4);
    });

    btnRow.appendChild(backBtn);
    btnRow.appendChild(nextBtn);
    content.appendChild(btnRow);
    content.appendChild(el('div', { id: 'pb-swatch-error', style: widgetStyles.errorText }));

    wrapper.appendChild(content);
    render(wrapper);
  }

  function renderSwatchCard(swatchData, pc) {
    var isSelected = state.selectedSwatchId === swatchData.id;
    var bgColor = swatchData.type === 'hex' ? swatchData.value : '#ccc';

    var swatch = el('div', {
      style: Object.assign({}, widgetStyles.paletteSwatch, {
        backgroundColor: bgColor,
        borderColor: isSelected ? pc : 'transparent',
        boxShadow: isSelected ? '0 0 0 2px ' + pc : 'none',
        transform: isSelected ? 'scale(1.08)' : 'scale(1)'
      }),
      title: swatchData.name
    });

    if (swatchData.type === 'image' && swatchData.image_url) {
      swatch.style.backgroundImage = 'url(' + swatchData.image_url + ')';
      swatch.style.backgroundSize = 'cover';
    }

    if (isSelected) {
      swatch.appendChild(el('span', { style: { fontSize: '16px', lineHeight: '1' } }, '\u2713'));
    }

    swatch.addEventListener('click', function () {
      if (state.selectedSwatchId === swatchData.id) {
        state.selectedSwatchId = null;
      } else {
        state.selectedSwatchId = swatchData.id;
      }
      renderStep3();
    });

    return swatch;
  }

  function loadSwatches(categoryId, tenantId, productId) {
    fetchSwatches(categoryId, tenantId, productId).then(function (data) {
      state.swatches = data.data || data || [];
      renderStep3();
    }).catch(function (err) {
      console.error('[Photo Builder] Failed to load swatches:', err);
      state.swatches = [];
      renderStep3();
    });
  }

  /* ========================================================================
     STEP 4 — Photo Upload
     ======================================================================== */
  function renderStep4() {
    clearWidget();
    var pc = primaryColor();

    var wrapper = el('div', {}, [
      renderStepIndicator(4),
      el('div', { style: widgetStyles.body })
    ]);

    var content = el('div', { className: 'pb-fade-in' });

    content.appendChild(
      el('p', {
        style: { fontSize: '13px', color: '#6b7280', margin: '0 0 12px' }
      }, 'En fazla ' + MAX_IMAGES + ' g\xf6rsel y\xfckleyin (JPG, PNG, WebP). Her biri en fazla 5 MB.')
    );

    var dropZone = renderDropZone();
    content.appendChild(dropZone);

    if (state.images.length > 0) {
      var grid = el('div', { style: widgetStyles.previewGrid });
      state.images.forEach(function (img, idx) {
        grid.appendChild(renderImagePreview(img, idx));
      });
      content.appendChild(grid);
    }

    var btnRow = el('div', { style: widgetStyles.buttonRow });
    var backBtn = el('button', {
      style: Object.assign({}, widgetStyles.buttonSecondary),
      onMouseOver: function () { this.style.backgroundColor = '#e5e7eb'; },
      onMouseOut: function () { this.style.backgroundColor = '#f3f4f6'; }
    }, '\u2190 Geri');
    backBtn.addEventListener('click', function () {
      state.step = 3;
      renderStep(3);
    });

    var nextBtn = el('button', {
      style: Object.assign({}, widgetStyles.buttonPrimary, { backgroundColor: pc }),
      onMouseOver: function () { this.style.backgroundColor = darkenColor(pc, 10); },
      onMouseOut: function () { this.style.backgroundColor = pc; }
    }, ' \u0130leri \u2192');
    nextBtn.addEventListener('click', function () {
      if (state.images.length === 0) {
        showFieldError('pb-upload-error', 'En az bir g\u00f6rsel y\u00fckleyin.');
        return;
      }
      state.step = 5;
      renderStep(5);
    });

    btnRow.appendChild(backBtn);
    btnRow.appendChild(nextBtn);
    content.appendChild(btnRow);
    content.appendChild(el('div', { id: 'pb-upload-error', style: widgetStyles.errorText }));

    wrapper.appendChild(content);
    render(wrapper);
  }

  function renderDropZone() {
    var pc = primaryColor();
    var canUpload = state.images.length < MAX_IMAGES;

    var dz = el('div', {
      style: widgetStyles.dropZone,
      className: 'pb-drop-zone'
    });

    if (!canUpload) {
      dz.appendChild(
        el('p', { style: { color: '#6b7280', fontSize: '13px', margin: 0 } },
          'En fazla ' + MAX_IMAGES + ' g\xf6rsel y\xfcklenebilir.'
        )
      );
      return dz;
    }

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '40');
    svg.setAttribute('height', '40');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', '#9ca3af');
    svg.setAttribute('stroke-width', '1.5');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    var path1 = document.createElementNS(svgNS, 'path');
    path1.setAttribute('d', 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4');
    var path2 = document.createElementNS(svgNS, 'polyline');
    path2.setAttribute('points', '17 8 12 3 7 8');
    var path3 = document.createElementNS(svgNS, 'line');
    path3.setAttribute('x1', '12');
    path3.setAttribute('y1', '3');
    path3.setAttribute('x2', '12');
    path3.setAttribute('y2', '15');
    svg.appendChild(path1);
    svg.appendChild(path2);
    svg.appendChild(path3);
    dz.appendChild(svg);

    dz.appendChild(
      el('p', {
        style: { margin: '8px 0 4px', fontWeight: 600, fontSize: '14px', color: '#374151' }
      }, 'Y\u00fcklemek i\u00e7in t\u0131klay\u0131n veya s\u00fcr\u00fckleyin')
    );
    dz.appendChild(
      el('p', {
        style: { margin: 0, fontSize: '12px', color: '#9ca3af' }
      }, 'JPG, PNG veya WebP (en fazla 5 MB)')
    );

    var fileInput = el('input', {
      type: 'file',
      accept: ALLOWED_EXTENSIONS.join(','),
      multiple: false,
      style: { display: 'none' }
    });
    dz.appendChild(fileInput);

    dz.addEventListener('click', function () {
      fileInput.click();
    });

    fileInput.addEventListener('change', function (e) {
      handleFiles(e.target.files);
      fileInput.value = '';
    });

    dz.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dz.style.borderColor = pc;
      dz.style.backgroundColor = hexToRgba(pc, 0.05);
    });

    dz.addEventListener('dragenter', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });

    dz.addEventListener('dragleave', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dz.style.borderColor = '#d1d5db';
      dz.style.backgroundColor = '#fafafa';
    });

    dz.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dz.style.borderColor = '#d1d5db';
      dz.style.backgroundColor = '#fafafa';
      handleFiles(e.dataTransfer.files);
    });

    return dz;
  }

  function handleFiles(files) {
    var errors = [];
    var added = 0;

    for (var i = 0; i < files.length; i++) {
      if (state.images.length >= MAX_IMAGES) {
        errors.push('En fazla ' + MAX_IMAGES + ' g\u00f6rsel y\u00fcklenebilir.');
        break;
      }
      var file = files[i];
      var error = getFileValidationError(file);
      if (error) {
        errors.push('"' + file.name + '": ' + error);
      } else {
        var isDuplicate = state.images.some(function (existing) {
          return existing.name === file.name && existing.size === file.size;
        });
        if (!isDuplicate) {
          state.images.push(file);
          added++;
        }
      }
    }

    if (added > 0) {
      renderStep4();
    }

    if (errors.length > 0) {
      var errorEl = document.getElementById('pb-upload-error');
      if (errorEl) {
        errorEl.textContent = errors.join(' ');
      }
    }
  }

  function renderImagePreview(file, index) {
    var pc = primaryColor();
    var url = URL.createObjectURL(file);

    var item = el('div', { style: widgetStyles.previewItem });

    var img = el('img', {
      src: url,
      alt: file.name,
      style: widgetStyles.previewImg,
      onLoad: function () {
        URL.revokeObjectURL(url);
      }
    });
    item.appendChild(img);

    var removeBtn = el('button', {
      style: Object.assign({}, widgetStyles.previewRemove),
      title: 'G\xf6rseli Kald\u0131r'
    }, '\xd7');
    removeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      state.images.splice(index, 1);
      renderStep4();
    });
    item.appendChild(removeBtn);

    item.appendChild(
      el('span', {
        style: {
          position: 'absolute',
          bottom: '4px',
          left: '4px',
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: '#fff',
          fontSize: '10px',
          padding: '1px 5px',
          borderRadius: '4px'
        }
      }, formatFileSize(file.size))
    );

    return item;
  }

  /* ========================================================================
     STEP 5 — Prompt (max 155 chars)
     ======================================================================== */
  function renderStep5() {
    clearWidget();
    var pc = primaryColor();

    var wrapper = el('div', {}, [
      renderStepIndicator(5),
      el('div', { style: widgetStyles.body })
    ]);

    var content = el('div', { className: 'pb-fade-in' });

    content.appendChild(
      el('p', {
        style: { fontSize: '13px', color: '#6b7280', margin: '0 0 12px' }
      }, 'Ekstra istekleriniz varsa buraya yaz\u0131n (opsiyonel).')
    );

    var formGroup = el('div', { style: widgetStyles.formGroup });
    var label = el('label', {
      style: widgetStyles.label,
      htmlFor: 'pb-prompt'
    }, 'Ekstra \u0130stekler (Opsiyonel)');
    var textarea = el('textarea', {
      id: 'pb-prompt',
      placeholder: '\xd6rn. "Daha canl\u0131 renkler, g\xf6lge efektleri\u2026"',
      style: widgetStyles.textarea
    }, state.form.prompt);
    textarea.addEventListener('input', function (e) {
      state.form.prompt = e.target.value;
    });
    applyInputStyles(textarea);
    formGroup.appendChild(label);
    formGroup.appendChild(textarea);
    content.appendChild(formGroup);

    var charCount = el('p', {
      style: { fontSize: '11px', color: '#9ca3af', textAlign: 'right', margin: '4px 0 0' }
    }, (state.form.prompt ? state.form.prompt.length : 0) + ' / ' + PROMPT_MAX_CHARS);
    textarea.addEventListener('input', function () {
      var len = textarea.value.length;
      if (len > PROMPT_MAX_CHARS) {
        textarea.value = textarea.value.substring(0, PROMPT_MAX_CHARS);
        len = PROMPT_MAX_CHARS;
      }
      charCount.textContent = len + ' / ' + PROMPT_MAX_CHARS;
    });
    content.appendChild(charCount);

    var btnRow = el('div', { style: widgetStyles.buttonRow });
    var backBtn = el('button', {
      style: Object.assign({}, widgetStyles.buttonSecondary),
      onMouseOver: function () { this.style.backgroundColor = '#e5e7eb'; },
      onMouseOut: function () { this.style.backgroundColor = '#f3f4f6'; }
    }, '\u2190 Geri');
    backBtn.addEventListener('click', function () {
      state.step = 4;
      renderStep(4);
    });

    var nextBtn = el('button', {
      style: Object.assign({}, widgetStyles.buttonPrimary, { backgroundColor: pc }),
      onMouseOver: function () { this.style.backgroundColor = darkenColor(pc, 10); },
      onMouseOut: function () { this.style.backgroundColor = pc; }
    }, ' \u0130leri \u2192');
    nextBtn.addEventListener('click', function () {
      state.step = 6;
      renderStep(6);
    });

    btnRow.appendChild(backBtn);
    btnRow.appendChild(nextBtn);
    content.appendChild(btnRow);

    wrapper.appendChild(content);
    render(wrapper);
  }

  /* ========================================================================
     STEP 6 — Submit / Summary
     ======================================================================== */
  function renderStep6() {
    clearWidget();
    var pc = primaryColor();

    var wrapper = el('div', {}, [
      renderStepIndicator(6),
      el('div', { style: widgetStyles.body })
    ]);

    var content = el('div', { className: 'pb-fade-in' });

    content.appendChild(
      el('h3', {
        style: { fontSize: '16px', fontWeight: 700, margin: '0 0 16px', color: '#1f2937' }
      }, 'Ba\u015fvurunuzu \u0130nceleyin')
    );

    var summary = el('div', {
      style: {
        backgroundColor: '#f9fafb',
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '16px'
      }
    });

    // Find swatch name
    var swatchLabel = 'None';
    if (state.selectedSwatchId && state.swatches) {
      state.swatches.forEach(function (k) {
        if (k.id === state.selectedSwatchId) {
          swatchLabel = k.name + ' (' + (k.product_name || '') + ')';
        }
      });
    }

    var fields = [
      { label: 'Ad Soyad', value: state.form.name },
      { label: 'Telefon', value: state.form.phone },
      { label: '\u015eehir', value: state.form.city },
      { label: 'E-Posta', value: state.form.email || '(opsiyonel)' },
      { label: 'Kategori', value: state.selectedCategoryName || 'Y\xfczey' },
      { label: 'Kartela', value: swatchLabel },
      { label: 'G\xf6rsel', value: state.images.length + ' dosya' }
    ];

    fields.forEach(function (field) {
      summary.appendChild(el('div', { style: widgetStyles.summaryRow }, [
        el('span', { style: widgetStyles.summaryLabel }, field.label),
        el('span', { style: widgetStyles.summaryValue }, sanitizeText(field.value))
      ]));
    });

    if (state.form.prompt) {
      summary.appendChild(el('div', { style: widgetStyles.summaryRow }, [
        el('span', { style: widgetStyles.summaryLabel }, '\u0130stek'),
        el('span', { style: Object.assign({}, widgetStyles.summaryValue, { fontSize: '12px', fontWeight: 400 }) }, sanitizeText(state.form.prompt))
      ]));
    }

    content.appendChild(summary);

    content.appendChild(el('div', { id: 'pb-submit-error', style: widgetStyles.errorText }));

    var btnRow = el('div', { style: widgetStyles.buttonRow });
    var backBtn = el('button', {
      style: Object.assign({}, widgetStyles.buttonSecondary),
      onMouseOver: function () { this.style.backgroundColor = '#e5e7eb'; },
      onMouseOut: function () { this.style.backgroundColor = '#f3f4f6'; }
    }, '\u2190 Geri');
    backBtn.addEventListener('click', function () {
      state.step = 5;
      renderStep(5);
    });

    var submitBtn = el('button', {
      style: Object.assign({}, widgetStyles.buttonPrimary, { backgroundColor: pc, padding: '12px 32px' }),
      onMouseOver: function () { this.style.backgroundColor = darkenColor(pc, 10); },
      onMouseOut: function () { this.style.backgroundColor = pc; }
    }, 'G\xf6nder');
    submitBtn.addEventListener('click', function () {
      handleSubmit();
    });

    btnRow.appendChild(backBtn);
    btnRow.appendChild(submitBtn);
    content.appendChild(btnRow);

    wrapper.appendChild(content);
    render(wrapper);
  }

  /* ========================================================================
     SUBMISSION HANDLING
     ======================================================================== */
  function handleSubmit() {
    if (state.submitting) return;

    var pc = primaryColor();
    state.submitting = true;

    showSubmissionProgress();

    var formData = new FormData();
    formData.append('name', state.form.name.trim());
    formData.append('phone', state.form.phone.trim());
    formData.append('city', state.form.city.trim());
    if (state.form.email && state.form.email.trim()) {
      formData.append('email', state.form.email.trim());
    }
    formData.append('category_id', String(state.selectedCategoryId));
    formData.append('swatch_id', String(state.selectedSwatchId));

    if (state.form.prompt && state.form.prompt.trim()) {
      formData.append('prompt', state.form.prompt.trim());
    }

    state.images.forEach(function (file) {
      formData.append('images[]', file);
    });

    submitForm(formData).then(function (data) {
      state.submissionUuid = data.uuid || data.data.uuid;
      if (!state.submissionUuid) {
        throw new Error('No submission UUID returned.');
      }
      state.submitting = false;
      startPolling();
    }).catch(function (err) {
      state.submitting = false;
      var errorMsg = err.message || 'Gönderi başarısız. Lütfen tekrar deneyin.';
      showFieldError('pb-submit-error', errorMsg);
      state.step = 6;
      renderStep(6);
      var errorEl = document.getElementById('pb-submit-error');
      if (errorEl) {
        errorEl.textContent = errorMsg;
      }
    });
  }

  function showSubmissionProgress() {
    clearWidget();
    var pc = primaryColor();

    var wrapper = el('div', {}, [
      renderStepIndicator(6),
      el('div', { style: widgetStyles.body })
    ]);

    var loading = el('div', { style: widgetStyles.loadingContainer });
    loading.className = 'pb-fade-in';

    loading.appendChild(el('div', { style: widgetStyles.spinner }));
    loading.appendChild(
      el('p', { style: { fontWeight: 600, fontSize: '15px', color: '#1f2937', margin: '0 0 4px' } },
        '\u0130ste\u011finiz g\xf6nderiliyor\u2026'
      )
    );
    loading.appendChild(
      el('p', { style: { fontSize: '13px', color: '#6b7280', margin: '0 0 8px' } },
        'L\xfctfen g\xf6r\xfcnt\xfcleriniz i\u015flenirken bekleyin.'
      )
    );

    var progressBar = el('div', { style: widgetStyles.progressBar });
    var fill = el('div', {
      style: Object.assign({}, widgetStyles.progressFill, {
        width: '30%',
        backgroundColor: pc
      })
    });
    progressBar.appendChild(fill);
    loading.appendChild(progressBar);

    loading.appendChild(
      el('p', { id: 'pb-progress-text', style: { fontSize: '12px', color: '#9ca3af', margin: '8px 0 0' } },
        'Y\xfckleniyor ve s\u0131raya al\u0131n\u0131yor\u2026'
      )
    );

    wrapper.appendChild(loading);
    render(wrapper);

    setTimeout(function () {
      fill.style.width = '60%';
    }, 500);
  }

  /* ========================================================================
     POLLING
     ======================================================================== */
  function startPolling() {
    var uuid = state.submissionUuid;
    if (!uuid) return;

    var pc = primaryColor();

    updateProgressMessage('G\u00f6rselleriniz i\u015fleniyor\u2026');

    var fill = widgetEl.querySelector('.pb-progress-fill');
    if (fill) {
      setTimeout(function () { fill.style.width = '85%'; }, 1000);
    }

    state.pollingTimer = setInterval(function () {
      fetchSubmissionStatus(uuid).then(function (data) {
        var status = data.status || data.data.status;

        if (status === 'completed') {
          clearInterval(state.pollingTimer);
          state.pollingTimer = null;
          return fetchSubmissionDetail(uuid).then(function (detail) {
            state.submissionResult = detail.data || detail;
            renderResult();
          });
        }

        if (status === 'failed') {
          clearInterval(state.pollingTimer);
          state.pollingTimer = null;
          renderSubmissionError('G\u00f6rsel olu\u015fturma ba\u015far\u0131sız. Lütfen tekrar deneyin.');
          return;
        }

        var messages = {
          'pending': 'Kuyruğa alındı\u2026',
          'processing': 'AI g\u00f6rsellerinizi renklendiriyor\u2026'
        };
        updateProgressMessage(messages[status] || '\u0130\u015flemiyor\u2026');

        if (fill) {
          fill.style.width = '85%';
        }
      }).catch(function (err) {
        console.warn('[Photo Builder] Poll error:', err.message);
      });
    }, POLL_INTERVAL);
  }

  function updateProgressMessage(msg) {
    var el_ = document.getElementById('pb-progress-text');
    if (el_) el_.textContent = msg;
  }

  /* ========================================================================
     RESULT / ERROR DISPLAY
     ======================================================================== */
  function renderResult() {
    clearWidget();
    var pc = primaryColor();

    var wrapper = el('div', { className: 'pb-fade-in' });

    wrapper.appendChild(
      el('div', { style: widgetStyles.successBox },
        [
          el('span', { style: { flexShrink: 0, fontSize: '18px' } }, '\u2713'),
          el('div', {}, [
            el('p', { style: { fontWeight: 600, margin: '0 0 2px' } }, 'G\u00f6rselleriniz haz\u0131r!'),
            el('p', { style: { fontSize: '12px', margin: '0', color: '#16a34a' } },
              'Yapay zeka foto\u011fraflar\u0131n\u0131z\u0131 renklendirmeyi tamamlad\u0131.'
            )
          ])
        ]
      )
    );

    var result = state.submissionResult;
    var images = result.images || [];

    if (images.length > 0) {
      var grid = el('div', { style: widgetStyles.resultGrid });

      images.forEach(function (img) {
        var generatedUrl = img.generated_url;
        var originalUrl = img.original_url;

        var card = el('div', {
          style: {
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            overflow: 'hidden'
          }
        });

        if (generatedUrl) {
          var imgEl = el('img', {
            src: generatedUrl,
            alt: 'Olu\u015fturulan g\u00f6rsel',
            style: {
              width: '100%',
              display: 'block',
              borderRadius: '10px'
            },
            loading: 'lazy'
          });
          card.appendChild(imgEl);
        }

        card.appendChild(
          el('div', {
            style: {
              padding: '8px 10px',
              fontSize: '12px',
              color: '#6b7280',
              textAlign: 'center'
            }
          }, 'Olu\u015fturuldu')
        );

        grid.appendChild(card);
      });

      wrapper.appendChild(grid);
    } else {
      wrapper.appendChild(
        el('p', { style: { textAlign: 'center', color: '#6b7280', padding: '20px' } },
          'Olu\u015fturulan g\xf6rsel bulunamad\u0131.'
        )
      );
    }

    var btnRow = el('div', { style: Object.assign({}, widgetStyles.buttonRow, { justifyContent: 'center', marginTop: '16px' }) });
    var resetBtn = el('button', {
      style: Object.assign({}, widgetStyles.buttonPrimary, { backgroundColor: pc }),
      onMouseOver: function () { this.style.backgroundColor = darkenColor(pc, 10); },
      onMouseOut: function () { this.style.backgroundColor = pc; }
    }, 'Yeni \u0130stek Ba\u015flat');
    resetBtn.addEventListener('click', function () {
      resetWidget();
    });
    btnRow.appendChild(resetBtn);
    wrapper.appendChild(btnRow);

    render(wrapper);
  }

  function renderSubmissionError(message) {
    clearWidget();
    var pc = primaryColor();

    var wrapper = el('div', { className: 'pb-fade-in' });

    wrapper.appendChild(
      el('div', { style: widgetStyles.errorBox },
        [
          el('span', { style: { flexShrink: 0, fontSize: '18px' } }, '\u26a0'),
          el('div', {}, [
            el('p', { style: { fontWeight: 600, margin: '0 0 2px' } }, 'Olu\u015fturma Ba\u015far\u0131s\u0131'),
            el('p', { style: { fontSize: '12px', margin: '0', color: '#dc2626' } }, message || 'G\u00f6rsel olu\u015fturma s\u0131ras\u0131nda bir hata olu\u015ftu.')
          ])
        ]
      )
    );

    var btnRow = el('div', { style: Object.assign({}, widgetStyles.buttonRow, { justifyContent: 'center', marginTop: '16px' }) });
    var retryBtn = el('button', {
      style: Object.assign({}, widgetStyles.buttonPrimary, { backgroundColor: pc }),
      onMouseOver: function () { this.style.backgroundColor = darkenColor(pc, 10); },
      onMouseOut: function () { this.style.backgroundColor = pc; }
    }, 'Try Again');
    retryBtn.addEventListener('click', function () {
      resetWidget();
    });
    btnRow.appendChild(retryBtn);
    wrapper.appendChild(btnRow);

    render(wrapper);
  }

  /* ========================================================================
     RESET
     ======================================================================== */
  function resetWidget() {
    if (state.pollingTimer) {
      clearInterval(state.pollingTimer);
      state.pollingTimer = null;
    }

    state.step = 1;
    state.selectedCategoryId = null;
    state.selectedCategoryName = null;
    state.selectedSwatchId = null;
    state.selectedTenantId = null;
    state.selectedProductId = null;
    state.swatches = [];
    state.form = { name: '', phone: '', city: '', email: '', prompt: '' };
    state.images = [];
    state.submissionUuid = null;
    state.submissionResult = null;
    state.submitting = false;
    state.error = null;

    renderStep(1);
  }

  /* ========================================================================
     STEP DISPATCHER
     ======================================================================== */
  function renderStep(step) {
    state.step = step;
    switch (step) {
      case 1: renderStep1(); break;
      case 2: renderStep2(); break;
      case 3: renderStep3(); break;
      case 4: renderStep4(); break;
      case 5: renderStep5(); break;
      case 6: renderStep6(); break;
      default: renderStep1(); break;
    }
  }

  /* ========================================================================
     INITIALIZATION
     ======================================================================== */

  function init() {
    container = document.getElementById('photo_builder');

    if (!container) {
      return;
    }

    if (container.getAttribute('data-pb-initialized') === 'true') {
      return;
    }
    container.setAttribute('data-pb-initialized', 'true');

    // Check if user is authenticated
    if (container.dataset.user) {
        try {
            state.userData = JSON.parse(container.dataset.user);
            state.isAuthenticated = true;
            state.form.name = state.userData.name || '';
            state.form.email = state.userData.email || '';
            state.form.phone = state.userData.phone || '';
            state.form.city = state.userData.city || '';
        } catch (e) {
            console.warn('[Photo Builder] Invalid user data:', e);
        }
    }

    injectKeyframes();

    widgetEl = el('div', {
      style: widgetStyles.container,
      className: 'pb-widget-container'
    });
    container.appendChild(widgetEl);

    renderLoading('Widget y\xfckleniyor\u2026');

    Promise.all([
      fetchConfig(),
      fetchCategories()
    ]).then(function (results) {
      state.config = results[0].data || results[0];
      state.categories = results[1].data || results[1];

      renderStep(state.isAuthenticated ? 2 : 1);
    }).catch(function (err) {
      console.error('[Photo Builder] Initialization error:', err);
      var message = err.message || 'Widget yap\u0131land\u0131rmas\u0131 y\xfcklenemedi.';
      renderError(message);
    });
  }

  /* ========================================================================
     AUTO-START
     ======================================================================== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.PhotoBuilderWidget = {
    init: init,
    reset: resetWidget
  };

})();
