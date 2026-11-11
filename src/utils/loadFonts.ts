import { Platform } from 'react-native';

/**
 * Injects official HB+ brand fonts from example.html (The Seasons, Gilroy, DM Sans, Geist)
 * into document.head when running on Web.
 */
export const injectHBPlusFonts = (): void => {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return;
  }

  const STYLE_ID = 'hbplus-runtime-fonts';
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  // 1. Google Fonts Preconnect
  if (!document.getElementById('hbplus-gfonts-preconnect')) {
    const p1 = document.createElement('link');
    p1.id = 'hbplus-gfonts-preconnect';
    p1.rel = 'preconnect';
    p1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(p1);

    const p2 = document.createElement('link');
    p2.rel = 'preconnect';
    p2.href = 'https://fonts.gstatic.com';
    p2.crossOrigin = 'anonymous';
    document.head.appendChild(p2);

    const gFontLink = document.createElement('link');
    gFontLink.rel = 'stylesheet';
    gFontLink.href =
      'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Geist:wght@100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap';
    document.head.appendChild(gFontLink);
  }

  // 2. Official WOFF2 Fonts from Framer CDN (example.html)
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    /* The Seasons - Luxury Editorial Serif from example.html */
    @font-face {
      font-family: 'The Seasons';
      src: url('https://framerusercontent.com/assets/FWhwpuJj1yqQclznRb0vw150zrg.woff2') format('woff2');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'The Seasons Bold';
      src: url('https://framerusercontent.com/assets/FWhwpuJj1yqQclznRb0vw150zrg.woff2') format('woff2');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'The Seasons';
      src: url('https://framerusercontent.com/assets/G403e7YXZAwPeajU6reh1YgGc4.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'The Seasons Regular';
      src: url('https://framerusercontent.com/assets/G403e7YXZAwPeajU6reh1YgGc4.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'The Seasons';
      src: url('https://framerusercontent.com/assets/QhwFBPKgQ1R5xA9xRFLsrChRiQk.woff2') format('woff2');
      font-weight: 300;
      font-style: italic;
      font-display: swap;
    }

    /* Gilroy - Modern Geometric Display Sans from example.html */
    @font-face {
      font-family: 'Gilroy';
      src: url('https://framerusercontent.com/assets/xW4KxdL3urr5CJBCNuA6Ny1VfY.woff2') format('woff2');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Gilroy-Bold';
      src: url('https://framerusercontent.com/assets/xW4KxdL3urr5CJBCNuA6Ny1VfY.woff2') format('woff2');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Gilroy';
      src: url('https://framerusercontent.com/assets/beSsRzPet3JpBaKgmDqy4CMjE4.woff2') format('woff2');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Gilroy-Medium';
      src: url('https://framerusercontent.com/assets/beSsRzPet3JpBaKgmDqy4CMjE4.woff2') format('woff2');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Gilroy';
      src: url('https://framerusercontent.com/assets/xoyT1Ii8s93lOEumEF6TwKQCIw0.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Gilroy-Regular';
      src: url('https://framerusercontent.com/assets/xoyT1Ii8s93lOEumEF6TwKQCIw0.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

