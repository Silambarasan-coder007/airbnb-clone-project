(function () {
  "use strict";
  var S = window.Stays;
  var params = new URLSearchParams(location.search);

  /* ---- read the search the user made on the home page ---- */
  var loc = (params.get("location") || "").trim();
  var guests = Math.max(1, parseInt(params.get("guests"), 10) || 1);
  var cin = S.parseDate(params.get("checkin")), cout = S.parseDate(params.get("checkout"));
  var nights = 5;
  if (cin && cout && cout > cin) nights = Math.round((cout - cin) / 86400000);
  else { cin = cout = null; }

  var fmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
  var dateText = cin ? fmt.format(cin) + " – " + fmt.format(cout) : "Any week";
  document.getElementById("pill-loc").textContent = "Homes in " + (loc || "India");
  document.getElementById("pill-dates").textContent = dateText;
  document.getElementById("pill-guests").textContent = guests + (guests === 1 ? " guest" : " guests");
  document.title = "Airbnb – Homes in " + (loc || "India");

  /* ---- filters ---- */
  var wishlist = [];
  try { wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]"); } catch (e) {}
  var state = { max: null, types: [], amenities: [], sort: "recommended" };
  var a = params.get("amenity");
  if (a && S.AMENITY_LABELS[a]) state.amenities.push(a);

  var types = [];
  S.LISTINGS.forEach(function (l) { if (types.indexOf(l.type) < 0) types.push(l.type); });
  var tBox = document.getElementById("f-types"), aBox = document.getElementById("f-amenities");
  types.forEach(function (t) {
    tBox.insertAdjacentHTML("beforeend", '<label><input type="checkbox" name="type" value="' + S.esc(t) + '"> ' + S.esc(t) + "</label>");
  });
  Object.keys(S.AMENITY_LABELS).forEach(function (k) {
    aBox.insertAdjacentHTML("beforeend", '<label><input type="checkbox" name="amenity" value="' + k + '"' + (state.amenities.indexOf(k) > -1 ? " checked" : "") + "> " + S.esc(S.AMENITY_LABELS[k]) + "</label>");
  });

  var dlg = document.getElementById("filters"), fform = document.getElementById("filter-form");
  document.getElementById("open-filters").addEventListener("click", function () {
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  });
  document.getElementById("close-filters").addEventListener("click", function () { dlg.close(); });
  fform.addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(fform), mx = parseInt(fd.get("max"), 10);
    state.max = isNaN(mx) ? null : mx;
    state.types = fd.getAll("type");
    state.amenities = fd.getAll("amenity");
    dlg.close();
    render();
  });
  document.getElementById("clear-filters").addEventListener("click", function () {
    fform.reset();
    Array.prototype.forEach.call(fform.querySelectorAll("input[type=checkbox]"), function (c) { c.checked = false; });
    state.max = null; state.types = []; state.amenities = [];
    render();
  });
  document.getElementById("sort").addEventListener("change", function (e) { state.sort = e.target.value; render(); });

  /* ---- results ---- */
  var results = document.getElementById("results"), map = document.getElementById("map");

  function matches(l) {
    if (loc && loc.toLowerCase() !== "india" && (l.place + " " + l.title).toLowerCase().indexOf(loc.toLowerCase()) < 0) return false;
    if (state.max !== null && l.price > state.max) return false;
    if (state.types.length && state.types.indexOf(l.type) < 0) return false;
    return state.amenities.every(function (k) { return l.amenities.indexOf(k) > -1; });
  }

  function mapTo(l) {
    var d = 0.45;
    map.src = "https://www.openstreetmap.org/export/embed.html?bbox=" + [l.lng - d, l.lat - d, l.lng + d, l.lat + d].join("%2C") +
      "&layer=mapnik&marker=" + l.lat + "%2C" + l.lng;
    document.getElementById("map-link").href = "https://www.openstreetmap.org/?mlat=" + l.lat + "&mlon=" + l.lng + "#map=10/" + l.lat + "/" + l.lng;
  }

  function card(l) {
    var on = wishlist.indexOf(l.id) > -1;
    var total = l.price * nights;
    return '<article class="card1" data-id="' + l.id + '">' +
      '<img class="photo" loading="lazy" referrerpolicy="no-referrer" src="' + S.esc(l.img) + '" alt="' + S.esc(l.title) + '">' +
      '<img class="per" loading="lazy" referrerpolicy="no-referrer" src="' + S.esc(l.host) + '" alt="Host of ' + S.esc(l.title) + '">' +
      '<button type="button" class="heart" aria-pressed="' + on + '" aria-label="' + (on ? "Remove " : "Save ") + S.esc(l.title) + (on ? " from" : " to") + ' wishlist">' + (on ? "♥" : "♡") + "</button>" +
      '<h2>' + S.esc(l.title) + '</h2>' +
      '<p class="meta">' + S.esc(l.beds) + '</p>' +
      '<p class="meta">★ ' + l.rating.toFixed(1) + " (" + l.reviews + ") · " + S.esc(l.place) + "</p>" +
      '<p class="price"><strong>' + S.inr(total) + "</strong> for " + nights + (nights === 1 ? " night" : " nights") + "</p></article>";
  }

  function render() {
    var list = S.LISTINGS.filter(matches);
    if (state.sort === "low") list.sort(function (x, y) { return x.price - y.price; });
    if (state.sort === "high") list.sort(function (x, y) { return y.price - x.price; });
    if (state.sort === "rating") list.sort(function (x, y) { return y.rating - x.rating || y.reviews - x.reviews; });

    document.getElementById("count").textContent = list.length + (list.length === 1 ? " home" : " homes") + " in " + (loc || "India");
    var n = (state.max !== null ? 1 : 0) + state.types.length + state.amenities.length;
    document.getElementById("fcount").textContent = n ? "(" + n + ")" : "";

    if (!list.length) {
      results.innerHTML = '<p class="empty">No homes match your search. Try removing a filter or searching a wider area.</p>';
      return;
    }
    results.innerHTML = list.map(card).join("");
  }

  results.addEventListener("click", function (e) {
    var art = e.target.closest(".card1");
    if (!art) return;
    var l = S.LISTINGS.filter(function (x) { return x.id === art.dataset.id; })[0];
    if (e.target.closest(".heart")) {
      var i = wishlist.indexOf(l.id);
      if (i > -1) wishlist.splice(i, 1); else wishlist.push(l.id);
      try { localStorage.setItem("wishlist", JSON.stringify(wishlist)); } catch (err) {}
      var btn = e.target.closest(".heart"), on = i < 0;
      btn.setAttribute("aria-pressed", on);
      btn.textContent = on ? "♥" : "♡";
      btn.setAttribute("aria-label", (on ? "Remove " : "Save ") + l.title + (on ? " from" : " to") + " wishlist");
      return;
    }
    mapTo(l);
  });

  render();
})();
