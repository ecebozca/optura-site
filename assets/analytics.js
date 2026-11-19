/*
 * Optura site analytics (Google Analytics 4), loaded only after cookie consent.
 *
 * - Nothing is sent to Google until the visitor presses "Accept" on the cookie
 *   banner. "Decline" or no choice means gtag.js is never loaded.
 * - Advertising signals are always denied; IP-based Google signals are off.
 * - Elements with data-track="<event>" send that event on click, with
 *   data-track-location as the "location" parameter.
 * - Pages call window.opturaTrack(name, params) for form results.
 *
 * GA_ID is the Measurement ID of the "Optura website" property (opturaai.co stream).
 */
(function () {
  var GA_ID = 'G-0XGB838P5Q';
  var KEY = 'optura_cookie_consent';
  var enabled = /^G-[A-Z0-9]+$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX';
  var loaded = false;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function consent() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function load() {
    if (!enabled || loaded) return;
    loaded = true;
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted'
    });
    gtag('js', new Date());
    gtag('config', GA_ID, {
      allow_google_signals: false,
      cookie_expires: 34214400, // 396 days (13 months)
      allow_ad_personalization_signals: false
    });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }

  // Public helper: a no-op until consent is given and GA is loaded.
  window.opturaTrack = function (name, params) {
    if (!loaded) return;
    gtag('event', name, params || {});
  };

  // Click tracking for any element marked with data-track.
  document.addEventListener('click', function (ev) {
    var el = ev.target && ev.target.closest ? ev.target.closest('[data-track]') : null;
    if (!el) return;
    window.opturaTrack(el.getAttribute('data-track'), {
      location: el.getAttribute('data-track-location') || '',
      page: location.pathname
    });
  });

  // The cookie banner dispatches this when the visitor accepts.
  document.addEventListener('optura:consent', function (ev) {
    if (ev.detail === 'accepted') load();
  });

  if (consent() === 'accepted') load();
})();
