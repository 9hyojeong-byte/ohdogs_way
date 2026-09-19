(function () {
  'use strict';

  var DEST = {
    name: '오디너리독스 스튜디오',
    lat: 37.4313459,
    lng: 127.1011874,
    address: '경기 성남시 수정구 고등로4길 16-2 오디너리독스 스튜디오'
  };

  var ua = navigator.userAgent || '';
  var isIOS = /iPhone|iPad|iPod/i.test(ua);
  var isAndroid = /Android/i.test(ua);

  // ---------- Toast ----------
  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('show');
    }, 2000);
  }

  // ---------- Copy address ----------
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function copyAddress() {
    var text = DEST.address;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('주소가 복사되었습니다 📋');
      }).catch(function () {
        var ok = fallbackCopy(text);
        showToast(ok ? '주소가 복사되었습니다 📋' : '복사에 실패했어요. 길게 눌러 직접 복사해주세요');
      });
    } else {
      var ok = fallbackCopy(text);
      showToast(ok ? '주소가 복사되었습니다 📋' : '복사에 실패했어요. 길게 눌러 직접 복사해주세요');
    }
  }

  var addressCard = document.getElementById('addressCard');
  if (addressCard) {
    addressCard.addEventListener('click', copyAddress);
    addressCard.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyAddress();
      }
    });
  }

  // ---------- App deep links with store fallback ----------
  function openApp(scheme, fallbackUrl) {
    var didHide = false;
    function onHide() { didHide = true; }
    document.addEventListener('visibilitychange', onHide, { once: true });
    window.addEventListener('pagehide', onHide, { once: true });

    window.location.href = scheme;

    setTimeout(function () {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onHide);
      if (didHide || document.hidden) return;
      window.location.href = fallbackUrl;
    }, 1500);
  }

  function storeFallback(iosId, androidPkg, webUrl) {
    if (isIOS) return 'https://apps.apple.com/app/id' + iosId;
    if (isAndroid) return 'market://details?id=' + androidPkg;
    return webUrl;
  }

  var btnTmap = document.getElementById('btnTmap');
  if (btnTmap) {
    btnTmap.addEventListener('click', function () {
      var scheme = 'tmap://route?goalname=' + encodeURIComponent(DEST.name) +
        '&goalx=' + DEST.lng + '&goaly=' + DEST.lat;
      var fallback = storeFallback('431589174', 'com.skt.tmap.ku', 'https://www.tmap.co.kr/');
      openApp(scheme, fallback);
    });
  }

  var btnNaver = document.getElementById('btnNaver');
  if (btnNaver) {
    btnNaver.addEventListener('click', function () {
      var scheme = 'nmap://route/car?dlat=' + DEST.lat + '&dlng=' + DEST.lng +
        '&dname=' + encodeURIComponent(DEST.name) + '&appname=com.ordinarydogs.web';
      var fallback = storeFallback('311867728', 'com.nhn.android.nmap',
        'https://map.naver.com/p/search/' + encodeURIComponent(DEST.address));
      openApp(scheme, fallback);
    });
  }

  var btnKakao = document.getElementById('btnKakao');
  if (btnKakao) {
    btnKakao.addEventListener('click', function () {
      var scheme = 'kakaonavi://navigate?name=' + encodeURIComponent(DEST.name) +
        '&x=' + DEST.lng + '&y=' + DEST.lat + '&coord_type=wgs84';
      var fallback = storeFallback('417698849', 'com.locnall.KimGiSa',
        'https://map.kakao.com/link/search/' + encodeURIComponent(DEST.address));
      openApp(scheme, fallback);
    });
  }
})();
