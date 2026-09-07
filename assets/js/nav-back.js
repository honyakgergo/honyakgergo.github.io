/* ══════════════════════════════════════════════════════════════
   Back control.

   The bar on the inner pages links "back" to a fixed place, the archive
   links home, a project links to the archive, which is wrong whenever the
   visitor did not arrive from there, and it always dropped them at the TOP
   of that page rather than at the card they had just tapped.

   So when the previous history entry is a page of this site, step back
   through history instead of following the href: the browser restores the
   scroll position with it, and the visitor lands on the card they left from.
   The href stays as the honest fallback, a cold open from a shared link, a
   new tab, or no JS at all still gets somewhere sensible.
   ══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  const cameFromHere = () => {
    try {
      return !!document.referrer &&
             new URL(document.referrer).origin === location.origin;
    } catch (_) { return false; }
  };

  document.querySelectorAll('a[data-back]').forEach((a) => {
    a.addEventListener('click', (e) => {
      // let the browser handle open-in-new-tab / new-window gestures
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!cameFromHere() || history.length < 2) return;   // fall through to href
      e.preventDefault();
      history.back();
    });
  });
})();
