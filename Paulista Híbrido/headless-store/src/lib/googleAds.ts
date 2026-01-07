export const GTA_CONVERSION_ID = 'AW-11403461866/sWcRCMmYsvYYEOqJzL0q';

/**
 * Reports a conversion to Google Ads and then navigates to the URL.
 * Matches the behavior of the provided snippet:
 * function gtag_report_conversion(url) { ... }
 */
export const reportConversion = (url: string) => {
    const callback = () => {
        if (typeof url !== 'undefined') {
            window.location.href = url;
        }
    };

    // Check if gtag is loaded
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
            'send_to': GTA_CONVERSION_ID,
            'event_callback': callback
        });
    } else {
        // If gtag is not defined (e.g., blocked by adblock), just navigate
        console.warn('Google Tag not found, navigating directly.');
        callback();
    }

    return false;
};
