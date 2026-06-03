/**
 * 部署路徑設定 / Deployment path config
 *
 * 你的 GitHub Pages 範例：
 *   https://kyssai.github.io/hku/FYP/team.html
 * 網站根路徑為 /hku/FYP（會自動偵測，一般無需手動設定）
 *
 * 若自動偵測失效，可改為：
 *   window.FYP_SITE_BASE = "/hku/FYP";
 */
window.FYP_SITE_BASE = "";

window.fypDetectSiteBase = function () {
  var manual = (window.FYP_SITE_BASE || "").replace(/\/$/, "");
  if (manual) return manual;
  var path = window.location.pathname || "";
  if (/\/[^/]+\.html$/i.test(path)) {
    return path.replace(/\/[^/]+\.html$/i, "");
  }
  return path.replace(/\/$/, "") || "";
};

/**
 * @param {string} relPath e.g. "IMG/mem1.png" or "Source/file.pdf"
 * @returns {string} URL path for href/src
 */
window.fypAsset = function (relPath) {
  relPath = (relPath || "").replace(/^\//, "");
  var base = window.fypDetectSiteBase();
  if (!base) return relPath;
  return base + "/" + relPath;
};

function fypFixAssetPaths() {
  document.querySelectorAll("img[src], a[href], video source[src]").forEach(function (el) {
    var attr = el.tagName === "SOURCE" ? "src" : el.getAttribute("href") ? "href" : "src";
    var raw = el.getAttribute(attr);
    if (!raw || /^https?:\/\//i.test(raw) || raw.indexOf("data:") === 0) return;
    if (/^(IMG\/|img\/|Source\/)/.test(raw)) {
      el.setAttribute(attr, window.fypAsset(raw));
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", fypFixAssetPaths);
} else {
  fypFixAssetPaths();
}
