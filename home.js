(function () {
  "use strict";
  var S = window.Stays;

  /* ---- search form: sensible default dates + validation ---- */
  var form = document.getElementById("search");
  var inEl = form.elements.checkin, outEl = form.elements.checkout, msg = document.getElementById("search-msg");
  var today = new Date();
  inEl.min = S.toISO(today);
  inEl.value = S.toISO(S.addDays(today, 14));
  outEl.value = S.toISO(S.addDays(today, 19));
  outEl.min = inEl.value;
  inEl.addEventListener("change", function () {
    var d = S.parseDate(inEl.value);
    if (!d) return;
    outEl.min = S.toISO(S.addDays(d, 1));
    if (!outEl.value || outEl.value <= inEl.value) outEl.value = S.toISO(S.addDays(d, 1));
    msg.textContent = "";
  });
  form.addEventListener("submit", function (e) {
    if (!inEl.value || !outEl.value || outEl.value <= inEl.value) {
      e.preventDefault();
      msg.textContent = "Check-out must be after check-in.";
      outEl.focus();
    }
  });

  /* ---- top-rated carousel ---- */
  var track = document.getElementById("featured");
  S.LISTINGS.filter(function (l) { return l.fav; }).forEach(function (l) {
    track.insertAdjacentHTML("beforeend",
      '<a class="card" href="search.html?location=' + encodeURIComponent(l.place.split(",")[0]) + '">' +
      '<img class="com" loading="lazy" referrerpolicy="no-referrer" src="' + S.esc(l.img) + '" alt="' + S.esc(l.title) + '">' +
      '<p class="con">🏆 Guest favourite</p>' +
      '<h3 class="sel">' + S.esc(l.title) + '</h3>' +
      '<p class="rate">★ ' + l.rating + ' (' + l.reviews + ')</p>' +
      '<p class="desc">' + S.esc(l.desc) + '</p></a>');
  });
  var prev = document.getElementById("prev"), next = document.getElementById("next"), count = document.getElementById("page-count");
  function update() {
    var pages = Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth - 0.05));
    var cur = Math.min(pages, Math.round(track.scrollLeft / track.clientWidth) + 1);
    count.textContent = cur + "/" + pages;
    prev.disabled = cur <= 1;
    next.disabled = cur >= pages;
    document.getElementById("carousel-controls").hidden = pages <= 1;
  }
  prev.addEventListener("click", function () { track.scrollBy({ left: -track.clientWidth, behavior: "smooth" }); });
  next.addEventListener("click", function () { track.scrollBy({ left: track.clientWidth, behavior: "smooth" }); });
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();

  /* ---- other rentals ---- */
  var others = document.getElementById("others");
  S.OTHERS.forEach(function (o) {
    others.insertAdjacentHTML("beforeend",
      '<a class="card" href="search.html">' +
      '<img class="com" loading="lazy" referrerpolicy="no-referrer" src="' + S.esc(o.img) + '" alt="' + S.esc(o.title) + '">' +
      '<h3 class="sel">' + S.esc(o.title) + '</h3>' +
      '<p class="rate">★ ' + o.rating + ' (' + o.reviews + ')</p>' +
      '<p class="desc">' + S.esc(o.tag) + '</p></a>');
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
