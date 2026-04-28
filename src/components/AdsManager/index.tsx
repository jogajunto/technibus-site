import Script from "next/script";

export default function AdsManager() {
  return (
    <>
      <Script id="technibus-ads-manager" strategy="afterInteractive">
        {`
          (function () {
            window.googletag = window.googletag || { cmd: [] };

            window.__technibusAds = window.__technibusAds || {
              pending: {},
              slots: {},
              displayed: {},
              refreshIntervals: {},
              servicesEnabled: false,
              flushScheduled: false,
              routeRefreshScheduled: false,
              lastUrl: window.location.href
            };

            window.__technibusRegisterAdsSlot = window.__technibusRegisterAdsSlot || function (ad) {
              var state = window.__technibusAds;

              if (state.pending[ad.id] || state.slots[ad.id]) {
                if (
                  window.location.hostname === "localhost" ||
                  window.location.hostname.includes("staging")
                ) {
                  console.warn(
                    "[ADS] Slot duplicado detectado:",
                    ad.id,
                    "Use um slotId único para cada <AdsSlot /> renderizado na mesma página."
                  );
                }

                return;
              }

              state.pending[ad.id] = ad;

              if (!state.flushScheduled) {
                state.flushScheduled = true;

                window.setTimeout(function () {
                  window.__technibusFlushAdsSlots();
                }, 0);
              }
            };

            window.__technibusFlushAdsSlots = window.__technibusFlushAdsSlots || function () {
              var state = window.__technibusAds;

              state.flushScheduled = false;

              window.googletag.cmd.push(function () {
                var pendingIds = Object.keys(state.pending);

                pendingIds.forEach(function (id) {
                  var currentAd = state.pending[id];
                  var element = document.getElementById(currentAd.id);

                  if (!element) {
                    return;
                  }

                  if (state.slots[currentAd.id]) {
                    return;
                  }

                  var existingSlot = window.googletag
                    .pubads()
                    .getSlots()
                    .find(function (slot) {
                      return slot.getSlotElementId() === currentAd.id;
                    });

                  if (existingSlot) {
                    state.slots[currentAd.id] = existingSlot;
                    return;
                  }

                  var slot = window.googletag.defineSlot(
                    currentAd.path,
                    currentAd.sizes,
                    currentAd.id
                  );

                  if (!slot) {
                    return;
                  }

                  if (currentAd.mapping === "wide") {
                    var mappingWide = window.googletag.sizeMapping()
                      .addSize([0, 0], [[320, 100], [320, 50]])
                      .addSize([730, 0], [728, 90])
                      .addSize([1000, 0], [[970, 250], [970, 90]])
                      .build();

                    slot.defineSizeMapping(mappingWide);
                  }

                  if (currentAd.mapping === "sidebar") {
                    var mappingSidebar = window.googletag.sizeMapping()
                      .addSize([0, 0], [[300, 600], [320, 100], [320, 50], [300, 250], [300, 100], [300, 75], [300, 50]])
                      .build();

                    slot.defineSizeMapping(mappingSidebar);
                  }

                  slot.addService(window.googletag.pubads());

                  state.slots[currentAd.id] = slot;
                });

                if (!state.servicesEnabled) {
                  window.googletag.pubads().enableSingleRequest();
                  window.googletag.pubads().collapseEmptyDivs(true);
                  window.googletag.enableServices();

                  state.servicesEnabled = true;
                }

                pendingIds.forEach(function (id) {
                  var currentAd = state.pending[id];
                  var slot = state.slots[currentAd.id];
                  var element = document.getElementById(currentAd.id);

                  if (!slot || !element) {
                    return;
                  }

                  if (!state.displayed[currentAd.id]) {
                    window.googletag.display(currentAd.id);
                    state.displayed[currentAd.id] = true;
                  }

                  if (
                    currentAd.refreshIntervalMs &&
                    currentAd.refreshIntervalMs > 0 &&
                    !state.refreshIntervals[currentAd.id]
                  ) {
                    state.refreshIntervals[currentAd.id] = window.setInterval(function () {
                      var currentElement = document.getElementById(currentAd.id);

                      if (!currentElement) {
                        return;
                      }

                      window.googletag.pubads().refresh([slot]);
                    }, currentAd.refreshIntervalMs);
                  }
                });
              });
            };

            window.__technibusRefreshVisibleAdsSlots = window.__technibusRefreshVisibleAdsSlots || function () {
              var state = window.__technibusAds;

              window.googletag.cmd.push(function () {
                var visibleSlots = Object.keys(state.slots)
                  .map(function (id) {
                    var slot = state.slots[id];
                    var element = document.getElementById(id);

                    if (!slot || !element || !state.displayed[id]) {
                      return null;
                    }

                    return slot;
                  })
                  .filter(Boolean);

                if (visibleSlots.length) {
                  window.googletag.pubads().refresh(visibleSlots);
                }
              });
            };

            window.__technibusScheduleRouteAdsRefresh = window.__technibusScheduleRouteAdsRefresh || function () {
              var state = window.__technibusAds;

              if (state.routeRefreshScheduled) {
                return;
              }

              state.routeRefreshScheduled = true;

              window.setTimeout(function () {
                state.routeRefreshScheduled = false;

                if (state.lastUrl === window.location.href) {
                  return;
                }

                state.lastUrl = window.location.href;

                window.__technibusFlushAdsSlots();

                window.setTimeout(function () {
                  window.__technibusRefreshVisibleAdsSlots();
                }, 250);
              }, 150);
            };

            if (!window.__technibusAdsRouteListenerInstalled) {
              window.__technibusAdsRouteListenerInstalled = true;

              var originalPushState = window.history.pushState;
              var originalReplaceState = window.history.replaceState;

              window.history.pushState = function () {
                var result = originalPushState.apply(this, arguments);
                window.__technibusScheduleRouteAdsRefresh();
                return result;
              };

              window.history.replaceState = function () {
                var result = originalReplaceState.apply(this, arguments);
                window.__technibusScheduleRouteAdsRefresh();
                return result;
              };

              window.addEventListener("popstate", function () {
                window.__technibusScheduleRouteAdsRefresh();
              });
            }
          })();
        `}
      </Script>
    </>
  );
}
