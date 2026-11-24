/* Shared data + helpers. NOTE: listings are sample data for the demo. */
(function () {
  "use strict";

  /* Fallback when a remote image fails (replaces the broken inline onerror) */
  var PLACEHOLDER = "data:image/svg+xml," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='#e9e6e1'/>" +
    "<text x='50%' y='50%' fill='#777' font-family='Arial' font-size='20' text-anchor='middle'>Photo unavailable</text></svg>");
  function useFallback(t) {
    if (t.dataset.fallback || t.closest(".logo, .brand")) return; /* keep alt text for the logo */
    t.dataset.fallback = "1";
    t.src = PLACEHOLDER;
  }
  document.addEventListener("error", function (e) {
    if (e.target && e.target.tagName === "IMG") useFallback(e.target);
  }, true);
  /* images that already failed before this script ran (e.g. the hero photo) */
  Array.prototype.forEach.call(document.images, function (im) {
    if (im.complete && im.naturalWidth === 0) useFallback(im);
  });

  function g(id) { return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc" + id + "&s"; }

  var LISTINGS = [
    { id: "kattappana-farm", title: "Farm stay in Kattappana", type: "Farm stay", place: "Kattappana, Kerala", lat: 9.75, lng: 77.11, beds: "2 bedrooms · 2 beds", price: 2400, rating: 5.0, reviews: 23, fav: true, amenities: ["wifi", "kitchen", "parking"], img: g("QYyPI6iD0N2OEt2hUAjVBNeB6EUI-DITMgQw"), host: g("Q7CsmmBzzbzq9zz9upBcsJ-_cFFvhrXFaCNg"), desc: "Quiet farm stay surrounded by plantations." },
    { id: "cheog-dome", title: "Dome in Cheog", type: "Dome", place: "Cheog, Himachal Pradesh", lat: 31.03, lng: 77.17, beds: "1 bedroom · 1 bed", price: 4200, rating: 5.0, reviews: 29, fav: true, amenities: ["wifi", "parking"], img: g("QOiV-zO8KiAssWgdTgs5duPvyZJ-wFt_R9Kg"), host: g("TiH91r5eIV4Sc3EY67UDbKLS6ChdMLi1nMeA"), desc: "Glass dome stay with hill views." },
    { id: "rongli-rooms", title: "Rooms in Rongli", type: "Rooms", place: "Rongli, Sikkim", lat: 27.18, lng: 88.6, beds: "2 bedrooms · 2 beds", price: 1600, rating: 4.8, reviews: 12, fav: false, amenities: ["wifi", "kitchen"], img: g("Qd9kGl3tRP4NToluVBrGaXBBMooz8uRmF4cw"), host: g("RaTp3hNRRhXQtXYQv5zlU9kkoDZoNELIrwDg"), desc: "" },
    { id: "kigwema-room", title: "Room in Kigwema", type: "Rooms", place: "Kigwema, Nagaland", lat: 25.62, lng: 94.12, beds: "2 bedrooms · 2 beds", price: 1712, rating: 4.7, reviews: 9, fav: false, amenities: ["wifi"], img: g("TFfDJFkB42WNCdlgpMPsKs8Qsdc_R9L_ExKg"), host: g("SwHD0lSDgqfPxweY-UjiEcfQfLYo4FVHP3jg"), desc: "" },
    { id: "rongli-homestay", title: "Homestay in Rongli", type: "Home", place: "Rongli, Sikkim", lat: 27.19, lng: 88.58, beds: "3 bedrooms · 4 beds", price: 2100, rating: 4.9, reviews: 15, fav: false, amenities: ["wifi", "kitchen", "parking"], img: g("RD5TlRJrGjUVT_BqlfSJgCVdBUlLjN-cvrKQ"), host: g("RMORDoQacb_-wi4PNabBQmPPOPa2ox0zh-ig"), desc: "" },
    { id: "guniyalekh-cottage", title: "Cottage in Guniyalekh", type: "Cottage", place: "Guniyalekh, Uttarakhand", lat: 29.6, lng: 79.6, beds: "2 bedrooms · 3 beds", price: 3100, rating: 5.0, reviews: 35, fav: true, amenities: ["wifi", "kitchen", "parking", "ac"], img: g("RXqkvevCqk4jNgdPWUf7rBLPYVEIs6E18mow"), host: g("SYEX4mC6ksaQci_ENd-uD9MLyeLHXT0HEVag"), desc: "Wooden cottage in the hills." },
    { id: "rongli-guesthouse", title: "Guesthouse in Rongli", type: "Rooms", place: "Rongli, Sikkim", lat: 27.17, lng: 88.62, beds: "2 bedrooms · 2 beds", price: 1850, rating: 4.6, reviews: 6, fav: false, amenities: ["wifi", "ac"], img: g("Rr4PCDfhSVElt_a7mgbeo6xnMr4CtvjG0wEA"), host: g("QzpO8nZtHYxJnP-j1vo1xbT4ZureOFWEal3w"), desc: "" },
    { id: "vengola-home", title: "Home in Vengola", type: "Home", place: "Vengola, Kerala", lat: 10.11, lng: 76.48, beds: "3 bedrooms · 3 beds", price: 2800, rating: 5.0, reviews: 17, fav: true, amenities: ["wifi", "kitchen", "pool", "parking", "ac"], img: g("RDZExQXdp0InNzZ4DQ4yi473LBeOB8CSyBPQ"), host: g("Ryr3NhC7re86a2QAlX5LeOKPwVz77E-yN8mg"), desc: "Spacious family home with a pool." }
  ];

  var OTHERS = [
    { title: "Villa in Vengalarajukuppam", tag: "Entire villa", rating: "5", reviews: 7, img: g("RU4kQefzLgJZRQXCzL8vLP_o9IgwZRvUSGfg") },
    { title: "Villa in Kotagiri", tag: "Entire villa", rating: "5", reviews: 14, img: g("Rnp0Ju6iq_hdNNka8LEyMu22544SmQfG7aWw") },
    { title: "Houseboat in Alappuzha", tag: "Houseboat", rating: "4.9", reviews: 10, img: g("SpHkPs9exraBftsJsOoYVPN-nTnXQdJXeW_Q") },
    { title: "Bungalow in Kattappana", tag: "Entire bungalow", rating: "5", reviews: 3, img: g("QRSQHp5Vx996K2oUd8L9C6OrGwCtPw5g7GGA") },
    { title: "Villa in Tamhini", tag: "Entire villa", rating: "5", reviews: 28, img: g("Q5gwC-vySkUeL_Bnn7p4A-FOL1qCXiLmdLoA") },
    { title: "Home in Jari", tag: "Entire home", rating: "5", reviews: 4, img: g("T4bb8gYBLbLNVUbogsej1zOJ4WC57dblcPIg") },
    { title: "Cottage in Galgibaga Beach", tag: "Entire cottage", rating: "5", reviews: 3, img: g("QNnzj1laSxKWbMJYuvM9r_q5YVM2VLuD-QEw") },
    { title: "Tiny home in Naggar", tag: "Tiny home", rating: "5", reviews: 4, img: g("QrmwuwCAckETgzXj35jESQ_a5mBpC-JkRvqw") }
  ];

  var AMENITY_LABELS = { wifi: "Wifi", kitchen: "Kitchen", pool: "Pool", parking: "Free parking", ac: "Air conditioning" };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function inr(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function toISO(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return isNaN(d) ? null : d;
  }
  function addDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; }

  window.Stays = { LISTINGS: LISTINGS, OTHERS: OTHERS, AMENITY_LABELS: AMENITY_LABELS, esc: esc, inr: inr, toISO: toISO, parseDate: parseDate, addDays: addDays };
})();
