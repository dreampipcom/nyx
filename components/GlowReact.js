import React, { useState, useEffect, useContext } from 'react';
import { consentLocales as locales } from '../templates/helpers/glow';
import { AppContext } from '../context';
import { pzTrack } from '../lib/helpers';

function GlowReact({ locale = 'en' }) {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState(false)
  const [loadedTracking, setLoadedTracking] = useState(false)
  const context = useContext(AppContext)
  const [localRec, setLocalRec] = useState(false)
  const { setContext } = context

  useEffect(() => {
    if (setContext) setContext({ ...context, consent })
  }, [consent, setContext])

  const checkExpiration = () => {
    const voids = [
      '2023-08-25T12:14:09Z'
    ]
    const lastVoid = new Date(voids[voids.length - 1]).getTime();
    const lastConsent = Number(localStorage.getItem("LastConsent"));
    const hasConsented = Number(localStorage.getItem("GlowCookies")) == 1;
    if (lastConsent < lastVoid) return true

    if (!hasConsented) {
      const MONTH = 2629800000;
      const DELTA = MONTH;
      const now = new Date().getTime();

      if (now - lastConsent > DELTA) return true;
      return false;
    }
  };

  const toggleSelector = () => {
    setShowBanner(!showBanner); // Show the banner
  }

  const openSelector = () => {
    setShowBanner(true); // Show the banner
  }

  const acceptCookies = () => {
    const now = new Date().getTime()
    localStorage.setItem("GlowCookies", "1");
    localStorage.setItem("LastConsent", `${now}`);
    activateTracking();
    setConsent(true)
    toggleSelector()
    pzTrack("hasConsented", { time: now })
    setLocalRec(true)
  };

  const rejectCookies = () => {
    localStorage.setItem("GlowCookies", "0");
    localStorage.setItem("LastConsent", `${new Date().getTime()}`)
    disableTracking();
    setConsent(false)
    toggleSelector()
    setLocalRec(true)
  };

  const activateTracking = () => {
    if (loadedTracking) return
    if (locales[locale].analytics) {
      // Google Analytics Tracking
      const analyticsScript = document.createElement('script');
      analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${locales[locale].analytics}`;
      document.head.appendChild(analyticsScript);

      const analyticsConfigScript = document.createElement('script');
      analyticsConfigScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${locales[locale].analytics}');
      `;
      document.head.appendChild(analyticsConfigScript);
    }
    setLoadedTracking(true)
  };

  const disableTracking = () => {
    clearCookies();
  };

  const clearCookies = () => {
    const cookies = document.cookie.split("; ");
    for (let c = 0; c < cookies.length; c++) {
      const d = window.location.hostname.split(".");
      while (d.length > 0) {
        const cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
        const p = window.location.pathname.split('/');
        document.cookie = cookieBase + '/';
        while (p.length > 0) {
          document.cookie = cookieBase + p.join('/');
          p.pop();
        }
        d.shift();
      }
    }
  };

  useEffect(() => {
    const consent = Number(localStorage.getItem("GlowCookies")) == 1
    if (consent && !checkExpiration()) {
      activateTracking();
      setConsent(true);
    } else if (checkExpiration()) {
      toggleSelector();
    }
  }, []);

  useEffect(() => {
    if ((context?.reconsent && !localRec) || !checkExpiration()) setLocalRec(true)
    if (localRec) openSelector()
  }, [context?.reconsent])

  const bannerContent = {
    heading: {
      text: locales[locale].bannerHeading,
      color: locales[locale].bannerColor,
    },
    description: {
      text: locales[locale].bannerDescription,
      color: locales[locale].bannerColor,
      link: {
        text: locales[locale].bannerLinkText,
        url: locales[locale].policyLink,
        color: locales[locale].bannerColor,
      },
    },
    acceptButton: {
      text: locales[locale].acceptBtnTxt,
      color: locales[locale].acceptBtnColor,
      backgroundColor: locales[locale].acceptBtnBackground,
    },
    rejectButton: {
      text: locales[locale].rejectBtnTxt,
      color: locales[locale].acceptBtnColor,
      backgroundColor: locales[locale].acceptBtnBackground,
    },
  };

  return (
    <div>
      {showBanner && (
        <dialog 
          open
          id="glowCookies-banner"
          className={`glowCookies__banner glowCookies__banner__2 glowCookies__border glowCookies__left glowCookies__show`}
          style={{ backgroundColor: locales[locale].bannerBackground }}
        >
          <div style={{ color: bannerContent.heading.color }} dangerouslySetInnerHTML={{ __html: bannerContent.heading.text }}></div>
          <p style={{ color: bannerContent.description.color }}>
            <span dangerouslySetInnerHTML={{ __html: bannerContent.description.text }}>
            </span>
            <a href={bannerContent.description.link.url} target="_blank" className="read__more" style={{ color: bannerContent.description.link.color }} dangerouslySetInnerHTML={{ __html: bannerContent.description.link.text }}>
            </a>
          </p>
          <div className="btn__section">
            <button
              type="button"
              id="acceptCookies"
              className="btn__accept accept__btn__styles"
              style={{ color: bannerContent.acceptButton.color, backgroundColor: bannerContent.acceptButton.backgroundColor }}
              dangerouslySetInnerHTML={{ __html: bannerContent.acceptButton.text }}
              onClick={acceptCookies}
            >

            </button>
            <button
              type="button"
              id="rejectCookies"
              className="btn__settings settings__btn__styles"
              style={{ color: bannerContent.rejectButton.color, backgroundColor: bannerContent.rejectButton.backgroundColor }}
              dangerouslySetInnerHTML={{ __html: bannerContent.rejectButton.text }}
              onClick={rejectCookies}
            >
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default GlowReact;
