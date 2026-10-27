import{fileURLToPath as __sdk_f}from'node:url';import{dirname as __sdk_d}from'node:path';const __filename=__sdk_f(import.meta.url);const __dirname=__sdk_d(__filename);

// ../zero_addon_sdk/src/manifest.ts
var SDK_PROTOCOL_VERSION = 3;

// ../zero_addon_sdk/src/addon.ts
function defineAddon(def) {
  return {
    manifest: def.manifest,
    async register(host) {
      const { resources: resources2 = {}, actions = {}, routes = {}, services = {}, api } = await def.setup(host);
      const sdk = def.manifest.zero.sdk ?? Math.min(2, SDK_PROTOCOL_VERSION);
      return { sdk, manifest: def.manifest, resources: resources2, actions, routes, services, ...api !== void 0 ? { api } : {} };
    }
  };
}

// src/host.ts
var _host = null;
function setHost(host) {
  _host = host;
}
function hasHost() {
  return _host !== null;
}
function getHost() {
  if (!_host) throw new Error("Subtitles host not configured \u2014 call setHost() first");
  return _host;
}
async function config() {
  if (!_host) return {};
  try {
    const values = await _host.settings.get();
    return Object.fromEntries(Object.entries(values).map(([k, v]) => [k, String(v)]));
  } catch {
    return {};
  }
}
var cache = {
  get: async (key) => _host ? _host.cache.get(key).catch(() => null) : null,
  set: async (key, value, ttl) => {
    if (_host) await _host.cache.set(key, value, ttl).catch(() => {
    });
  }
};

// src/languages.ts
var ISO_639_2_TO_1 = {
  eng: "en",
  spa: "es",
  fre: "fr",
  fra: "fr",
  ger: "de",
  deu: "de",
  por: "pt",
  ita: "it",
  rus: "ru",
  jpn: "ja",
  kor: "ko",
  chi: "zh",
  zho: "zh",
  ara: "ar",
  dut: "nl",
  nld: "nl",
  pol: "pl",
  tur: "tr",
  swe: "sv",
  dan: "da",
  fin: "fi",
  nor: "no",
  nob: "no",
  nno: "no",
  heb: "he",
  hin: "hi",
  tha: "th",
  vie: "vi",
  ind: "id",
  ron: "ro",
  rum: "ro",
  cze: "cs",
  ces: "cs",
  hun: "hu",
  gre: "el",
  ell: "el",
  bul: "bg",
  hrv: "hr",
  ukr: "uk",
  srp: "sr",
  slk: "sk",
  slo: "sk",
  slv: "sl",
  est: "et",
  lav: "lv",
  lit: "lt",
  per: "fa",
  fas: "fa",
  ben: "bn",
  cat: "ca",
  baq: "eu",
  eus: "eu",
  glg: "gl",
  bos: "bs",
  mac: "mk",
  mkd: "mk",
  alb: "sq",
  sqi: "sq",
  bel: "be",
  aze: "az",
  geo: "ka",
  kat: "ka",
  mal: "ml",
  tam: "ta",
  tel: "te",
  urd: "ur",
  may: "ms",
  msa: "ms",
  tgl: "tl",
  fil: "tl",
  ice: "is",
  isl: "is",
  kur: "ku",
  ckb: "ku",
  prs: "fa",
  afr: "af",
  swa: "sw",
  wel: "cy",
  cym: "cy"
};
var ISO_639_1_TO_NAME = {
  en: "english",
  es: "spanish",
  fr: "french",
  de: "german",
  pt: "portuguese",
  it: "italian",
  ru: "russian",
  ja: "japanese",
  ko: "korean",
  zh: "chinese",
  ar: "arabic",
  nl: "dutch",
  pl: "polish",
  tr: "turkish",
  sv: "swedish",
  da: "danish",
  fi: "finnish",
  no: "norwegian",
  he: "hebrew",
  hi: "hindi",
  th: "thai",
  vi: "vietnamese",
  id: "indonesian",
  ro: "romanian",
  cs: "czech",
  hu: "hungarian",
  el: "greek",
  bg: "bulgarian",
  hr: "croatian",
  uk: "ukrainian",
  sr: "serbian",
  sk: "slovak",
  sl: "slovenian",
  et: "estonian",
  lv: "latvian",
  lt: "lithuanian",
  fa: "farsi_persian",
  bn: "bengali",
  ca: "catalan",
  eu: "basque",
  gl: "galician",
  bs: "bosnian",
  mk: "macedonian",
  sq: "albanian",
  be: "belarusian",
  az: "azerbaijani",
  ka: "georgian",
  ml: "malayalam",
  ta: "tamil",
  te: "telugu",
  ur: "urdu",
  ms: "malay",
  tl: "tagalog",
  is: "icelandic",
  ku: "kurdish",
  af: "afrikaans",
  sw: "swahili",
  cy: "welsh"
};
function normalize(input) {
  return input.toLowerCase().trim();
}
function toIso639_1(input) {
  const n = normalize(input);
  const base = n.split(/[-_]/)[0];
  if (base.length === 2 && /^[a-z]{2}$/.test(base)) return base;
  if (base.length === 3 && ISO_639_2_TO_1[base]) return ISO_639_2_TO_1[base];
  const fromName = Object.entries(ISO_639_1_TO_NAME).find(([, name]) => name === base);
  if (fromName) return fromName[0];
  return null;
}
function buildProviderLangs(inputs, format) {
  const out = /* @__PURE__ */ new Set();
  for (const raw of inputs) {
    const code = toIso639_1(raw);
    if (!code) continue;
    if (format === "iso1") out.add(code);
    else if (format === "iso1-upper") out.add(code.toUpperCase());
    else {
      const name = ISO_639_1_TO_NAME[code];
      if (name) out.add(name);
    }
  }
  return [...out];
}

// src/log.ts
var consoleLogger = {
  info: (c, m) => console.log(`[${c}] ${m}`),
  success: (c, m) => console.log(`[${c}] ${m}`),
  warn: (c, m) => console.warn(`[${c}] ${m}`),
  error: (c, m, e) => console.error(`[${c}] ${m}`, e ?? "")
};
var sink = () => hasHost() ? getHost().logger : consoleLogger;
var logger = {
  info: (c, m) => sink().info(c, m),
  success: (c, m) => sink().success(c, m),
  warn: (c, m) => sink().warn(c, m),
  error: (c, m, e) => sink().error(c, m, e)
};

// src/release.ts
function releaseRefOf(fileName) {
  if (!fileName) return null;
  return {
    sourceType: parseSourceType(fileName),
    resolution: parseResolution(fileName),
    codec: parseCodec(fileName),
    releaseGroup: parseReleaseGroup(fileName)
  };
}
function parseSourceType(name) {
  const n = (name || "").toLowerCase();
  if (!n) return null;
  if (/\bremux\b/.test(n)) return "remux";
  if (/\bblu[\s._-]?ray\b|\bbdrip\b|\bbrrip\b|\bbd(?:25|50|r)\b/.test(n)) return "bluray";
  if (/\bweb[\s._-]?dl\b|\bwebdl\b/.test(n)) return "webdl";
  if (/\bweb[\s._-]?rip\b|\bwebrip\b/.test(n)) return "webrip";
  if (/\bweb\b/.test(n)) return "webdl";
  if (/\bhdtv\b/.test(n)) return "hdtv";
  if (/\bdvd(?:rip|scr|r)?\b/.test(n)) return "dvd";
  if (/\bhd[\s._-]?cam\b|\bcam[\s._-]?rip\b|\bcam\b|\bhd[\s._-]?ts\b|\btelesync\b/.test(n)) return "cam";
  return null;
}
function parseResolution(name) {
  const n = (name || "").toLowerCase();
  if (!n) return null;
  if (/\b(2160p?|4k|uhd)\b/.test(n)) return "2160p";
  if (/\b1080p?\b/.test(n)) return "1080p";
  if (/\b720p?\b/.test(n)) return "720p";
  if (/\b480p?\b/.test(n)) return "480p";
  return null;
}
function parseCodec(name) {
  const n = (name || "").toLowerCase();
  if (!n) return null;
  if (/\b(x265|h[\s._-]?265|hevc)\b/.test(n)) return "h265";
  if (/\b(x264|h[\s._-]?264|avc)\b/.test(n)) return "h264";
  if (/\bav1\b/.test(n)) return "av1";
  return null;
}
function parseReleaseGroup(name) {
  const n = (name || "").trim();
  if (!n) return null;
  const m = /-([a-z0-9]{2,20})(?:\.(?:mkv|mp4|avi|ts|srt))?\s*$/i.exec(n);
  if (!m) return null;
  const g = m[1];
  if (/^(?:\d+|x?26[45]|hevc|avc|av1|aac|ddp?\d*|atmos|hdr(?:10)?(?:plus)?|dv|sdr|web|webdl|webrip|bluray|remux|hdtv|dl|rip|multi|dual|proper|repack)$/i.test(g)) {
    return null;
  }
  return g;
}
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var COMPATIBLE_TYPES = {
  webdl: ["webrip"],
  webrip: ["webdl"],
  bluray: ["remux"],
  remux: ["bluray"]
};
function releaseMatchScore(candidateRelease, ref) {
  if (!ref || !candidateRelease) return 0;
  let score = 0;
  if (ref.releaseGroup) {
    const g = escapeRegExp(ref.releaseGroup);
    if (new RegExp(`(^|[^a-z0-9])${g}([^a-z0-9]|$)`, "i").test(candidateRelease)) {
      score += 60;
    }
  }
  const candType = parseSourceType(candidateRelease);
  if (ref.sourceType && candType) {
    if (candType === ref.sourceType) score += 30;
    else if (COMPATIBLE_TYPES[ref.sourceType]?.includes(candType)) score += 15;
    else score -= 15;
  }
  const candRes = parseResolution(candidateRelease);
  if (ref.resolution && candRes && candRes === ref.resolution) score += 10;
  const candCodec = parseCodec(candidateRelease);
  if (ref.codec && candCodec && candCodec === ref.codec) score += 5;
  return score;
}

// src/providers/opensubtitles.ts
var BASE = "https://api.opensubtitles.com/api/v1";
var USER_AGENT = "ZeroMedia v1";
var MAX_PER_LANG = 8;
async function loginJwt(cfg) {
  const key = `os_jwt:${cfg.username}`;
  const cached = await cache.get(key);
  if (cached) return cached;
  try {
    const res = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Api-Key": cfg.apiKey, "User-Agent": USER_AGENT, Accept: "*/*" },
      body: JSON.stringify({ username: cfg.username, password: cfg.password }),
      signal: AbortSignal.timeout(1e4)
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.token) return null;
    await cache.set(key, data.token, 20 * 60 * 60);
    return data.token;
  } catch {
    return null;
  }
}
async function headersFor(cfg) {
  const headers = { "Content-Type": "application/json", Accept: "*/*", "User-Agent": USER_AGENT, "Api-Key": cfg.apiKey };
  if (cfg.username && cfg.password) {
    const jwt = await loginJwt(cfg);
    if (jwt) headers.Authorization = `Bearer ${jwt}`;
  }
  return headers;
}
async function searchOpenSubtitles(p, cfg) {
  if (!cfg.apiKey || !p.imdbId) return [];
  const langs = buildProviderLangs(p.langs, "iso1").slice(0, 5);
  if (!langs.length) return [];
  const headers = await headersFor(cfg);
  const out = [];
  for (const lang of langs) {
    const sp = new URLSearchParams({ imdb_id: p.imdbId.replace(/^tt/, ""), type: p.type, languages: lang, order_by: "download_count" });
    if (p.type === "series" && p.season != null) sp.set("season_number", String(p.season));
    if (p.type === "series" && p.episode != null) sp.set("episode_number", String(p.episode));
    if (p.videoHash) sp.set("moviehash", p.videoHash);
    try {
      const res = await fetch(`${BASE}/subtitles?${sp}`, { headers, signal: AbortSignal.timeout(1e4) });
      if (!res.ok) {
        logger.warn("subtitles", `OpenSubtitles ${lang} \u2192 HTTP ${res.status} (imdb ${p.imdbId})`);
        continue;
      }
      const entries = (await res.json()).data ?? [];
      entries.sort((a, b) => {
        const ha = a.attributes?.moviehash_match ? 1 : 0;
        const hb = b.attributes?.moviehash_match ? 1 : 0;
        if (ha !== hb) return hb - ha;
        const ra = releaseMatchScore(a.attributes?.release || a.attributes?.files?.[0]?.file_name, p.release);
        const rb = releaseMatchScore(b.attributes?.release || b.attributes?.files?.[0]?.file_name, p.release);
        if (ra !== rb) return rb - ra;
        return (b.attributes?.download_count ?? 0) - (a.attributes?.download_count ?? 0);
      });
      for (const e of entries.slice(0, MAX_PER_LANG)) {
        const file = e.attributes?.files?.[0];
        if (!file?.file_id) continue;
        out.push({
          id: `os:${file.file_id}`,
          lang,
          label: "OpenSubtitles",
          format: "srt",
          release: e.attributes?.release || file.file_name || void 0,
          hashMatch: e.attributes?.moviehash_match === true,
          score: e.attributes?.download_count ?? 0,
          hearingImpaired: e.attributes?.hearing_impaired === true
        });
      }
    } catch (err) {
      logger.warn("subtitles", `OpenSubtitles ${lang}: ${err.message} (imdb ${p.imdbId})`);
    }
  }
  return out;
}
async function downloadOpenSubtitles(fileId, cfg) {
  if (!cfg.apiKey) return null;
  try {
    const res = await fetch(`${BASE}/download`, {
      method: "POST",
      headers: await headersFor(cfg),
      body: JSON.stringify({ file_id: Number(fileId), sub_format: "srt" }),
      signal: AbortSignal.timeout(1e4)
    });
    if (!res.ok) {
      logger.warn("subtitles", `OpenSubtitles download \u2192 HTTP ${res.status}`);
      return null;
    }
    const link = (await res.json()).link;
    return link ? { url: link } : null;
  } catch {
    return null;
  }
}

// src/providers/subdl.ts
var API = "https://api.subdl.com/api/v1/subtitles";
var DL_BASE = "https://dl.subdl.com";
var MAX_RESULTS = 10;
async function searchSubDL(p, apiKey) {
  if (!apiKey || !p.imdbId) return [];
  const langs = buildProviderLangs(p.langs, "iso1-upper");
  if (!langs.length) return [];
  const sp = new URLSearchParams({
    api_key: apiKey,
    imdb_id: p.imdbId,
    type: p.type === "movie" ? "movie" : "tv",
    languages: langs.join(","),
    subs_per_page: "30"
  });
  if (p.type === "series") {
    if (p.season != null) sp.set("season_number", String(p.season));
    if (p.episode != null) sp.set("episode_number", String(p.episode));
  }
  let data;
  try {
    const res = await fetch(`${API}?${sp}`, { signal: AbortSignal.timeout(1e4) });
    if (!res.ok) {
      logger.warn("subtitles", `SubDL \u2192 HTTP ${res.status} (imdb ${p.imdbId})`);
      return [];
    }
    data = await res.json();
  } catch (err) {
    logger.warn("subtitles", `SubDL: ${err.message} (imdb ${p.imdbId})`);
    return [];
  }
  if (!data.status || !data.subtitles?.length) return [];
  const scored = data.subtitles.map((sub) => {
    let score = sub.download_count ?? 0;
    score += releaseMatchScore(sub.release_name, p.release) * 1e3;
    if (p.type === "series" && p.episode != null) {
      if (sub.episode != null && Number(sub.episode) === p.episode) score += 5e3;
      if (sub.episode_from != null && sub.episode_end != null && sub.episode_from !== sub.episode_end) score -= 100;
    }
    return { sub, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const { sub } of scored.slice(0, MAX_RESULTS)) {
    const url = sub.full_link?.startsWith("http") ? sub.full_link : sub.url ? `${DL_BASE}${sub.url}` : "";
    if (!url || seen.has(url)) continue;
    seen.add(url);
    out.push({
      id: `subdl:${url}`,
      url,
      lang: sub.language?.toLowerCase() ?? sub.lang?.toLowerCase().slice(0, 2) ?? "und",
      label: "SubDL",
      format: "zip",
      release: sub.release_name || void 0,
      score: sub.download_count ?? 0,
      hearingImpaired: sub.hi === true
    });
  }
  return out;
}

// src/providers/subsource.ts
var BASE2 = "https://api.subsource.net/api/v1";
var BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "application/json, application/*+json, application/zip, application/octet-stream, */*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://subsource.net/",
  Origin: "https://subsource.net"
};
var CODE = {
  english: "en",
  spanish: "es",
  french: "fr",
  german: "de",
  portuguese: "pt",
  italian: "it",
  russian: "ru",
  japanese: "ja",
  korean: "ko",
  chinese: "zh",
  arabic: "ar",
  dutch: "nl",
  polish: "pl",
  turkish: "tr",
  indonesian: "id",
  romanian: "ro",
  swedish: "sv",
  danish: "da",
  finnish: "fi",
  norwegian: "no",
  hebrew: "he",
  hindi: "hi",
  thai: "th",
  vietnamese: "vi",
  greek: "el",
  bulgarian: "bg",
  ukrainian: "uk",
  czech: "cs",
  hungarian: "hu",
  croatian: "hr",
  serbian: "sr",
  slovak: "sk",
  slovenian: "sl",
  estonian: "et",
  latvian: "lv",
  lithuanian: "lt",
  farsi_persian: "fa",
  bengali: "bn",
  catalan: "ca",
  basque: "eu",
  galician: "gl"
};
var headersFor2 = (apiKey) => ({ ...BROWSER_HEADERS, "X-API-Key": apiKey, "api-key": apiKey });
async function fetchWithRetry(url, init, label) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { ...init, signal: AbortSignal.timeout(8e3) });
      if (res.ok || res.status < 500) {
        if (!res.ok) logger.warn("subtitles", `SubSource ${label} \u2192 HTTP ${res.status}`);
        return res;
      }
      logger.warn("subtitles", `SubSource ${label} \u2192 HTTP ${res.status}${attempt === 0 ? " \u2014 retrying" : ""}`);
    } catch (err) {
      logger.warn("subtitles", `SubSource ${label}: ${err.message}${attempt === 0 ? " \u2014 retrying" : ""}`);
    }
    if (attempt === 0) await new Promise((r) => setTimeout(r, 400));
  }
  return null;
}
async function movieIdOf(imdbId, season, headers) {
  const key = `subsource_movie:${imdbId}:${season ?? ""}`;
  const cached = await cache.get(key);
  if (cached) return parseInt(cached, 10) || null;
  const sp = new URLSearchParams({ searchType: "imdb", imdb: imdbId });
  if (season != null) sp.set("season", String(season));
  const res = await fetchWithRetry(`${BASE2}/movies/search?${sp}`, { headers }, "movies/search");
  if (!res?.ok) return null;
  try {
    const movie = (await res.json()).data?.[0];
    const id = movie?.movieId ?? movie?.id ?? null;
    if (id) await cache.set(key, String(id), 7 * 24 * 60 * 60);
    return id;
  } catch {
    return null;
  }
}
async function searchSubSource(p, apiKey) {
  if (!apiKey || !p.imdbId) return [];
  const names = buildProviderLangs(p.langs, "english-name");
  if (!names.length) return [];
  const headers = headersFor2(apiKey);
  const movieId = await movieIdOf(p.imdbId, p.season, headers);
  if (!movieId) return [];
  const sp = new URLSearchParams({ movieId: String(movieId), language: names.join(","), sort: "downloads", limit: "30" });
  const res = await fetchWithRetry(`${BASE2}/subtitles?${sp}`, { headers }, "subtitles");
  if (!res?.ok) return [];
  let entries;
  try {
    entries = (await res.json()).data ?? [];
  } catch {
    return [];
  }
  const ep = p.type === "series" && p.season != null && p.episode != null ? [`s${String(p.season).padStart(2, "0")}e${String(p.episode).padStart(2, "0")}`, `s${p.season}e${p.episode}`, `${p.season}x${String(p.episode).padStart(2, "0")}`] : null;
  const scored = entries.map((e) => {
    const blob = (e.releaseInfo ?? []).join(" ");
    let score = (e.downloads ?? 0) + releaseMatchScore(blob, p.release) * 1e3;
    if (ep && ep.some((t) => blob.toLowerCase().includes(t))) score += 5e3;
    return { e, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 12).map(({ e }) => {
    const name = e.language.toLowerCase();
    return {
      id: `ss:${e.subtitleId}`,
      lang: CODE[name] ?? name.slice(0, 2),
      label: "SubSource",
      format: "zip",
      release: e.releaseInfo?.join(" ") || void 0,
      score: e.downloads ?? 0,
      hearingImpaired: e.hearingImpaired === true
    };
  });
}
async function downloadSubSource(subtitleId, apiKey) {
  if (!apiKey) return null;
  const res = await fetchWithRetry(`${BASE2}/subtitles/${encodeURIComponent(subtitleId)}/download`, { headers: headersFor2(apiKey) }, "download");
  if (!res?.ok) return null;
  const bytes = Buffer.from(await res.arrayBuffer());
  return bytes.length ? { data: bytes.toString("base64"), format: "zip" } : null;
}

// src/resources.ts
function providersOf(cfg) {
  const on = (k) => cfg[`${k}_enabled`] !== "false" && !!cfg[`${k}_api_key`]?.trim();
  const os = {
    apiKey: cfg.opensubtitles_api_key?.trim() ?? "",
    username: cfg.opensubtitles_username?.trim() ?? "",
    password: cfg.opensubtitles_password?.trim() ?? ""
  };
  return {
    opensubtitles: on("opensubtitles") ? os : null,
    subdl: on("subdl") ? cfg.subdl_api_key.trim() : null,
    subsource: on("subsource") ? cfg.subsource_api_key.trim() : null
  };
}
function paramsOf(req, extra) {
  const [imdbId, s, e] = req.id.split(":");
  if (!imdbId || !/^tt\d+$/.test(imdbId)) return null;
  return {
    imdbId,
    type: req.type === "series" ? "series" : "movie",
    season: s ? Number(s) : null,
    episode: e ? Number(e) : null,
    langs: Array.isArray(extra.langs) && extra.langs.length ? extra.langs.map(String) : ["en"],
    videoHash: typeof extra.videoHash === "string" ? extra.videoHash : null,
    release: releaseRefOf(typeof extra.filename === "string" ? extra.filename : null)
  };
}
async function download(id, cfg) {
  const p = providersOf(cfg);
  const sep = id.indexOf(":");
  const [kind, ref] = [id.slice(0, sep), id.slice(sep + 1)];
  const file = kind === "os" && p.opensubtitles ? await downloadOpenSubtitles(ref, p.opensubtitles) : kind === "ss" && p.subsource ? await downloadSubSource(ref, p.subsource) : kind === "subdl" ? { url: ref } : null;
  return { subtitles: file ? [{ id, lang: "", ...file }] : [] };
}
var resources = {
  async subtitles(req) {
    const extra = req.extra;
    const cfg = await config();
    if (typeof extra.download === "string" && extra.download) return download(extra.download, cfg);
    const params = paramsOf(req, extra);
    if (!params) return { subtitles: [] };
    const p = providersOf(cfg);
    const found = await Promise.all([
      p.opensubtitles ? searchOpenSubtitles(params, p.opensubtitles).catch(() => []) : [],
      p.subdl ? searchSubDL(params, p.subdl).catch(() => []) : [],
      p.subsource ? searchSubSource(params, p.subsource).catch(() => []) : []
    ]);
    return { subtitles: found.flat() };
  }
};

// manifest.json
var manifest_default = {
  id: "zero.subtitles",
  name: "Subtitles",
  version: "1.0.1",
  description: "Subtitles from OpenSubtitles, SubDL and SubSource, matched to the version you play.",
  resources: ["subtitles"],
  types: ["movie", "series"],
  idPrefixes: ["tt"],
  provides: { subtitles: ["movies", "series", "anime"] },
  zero: {
    kind: "subtitles",
    sdk: 3,
    repo: "j4ckgrey/zero_subtitles",
    branch: "main",
    bundlePath: "dist/index.mjs",
    bundleUrl: "https://raw.githubusercontent.com/j4ckgrey/zero_subtitles/main/dist/index.mjs",
    settings: [
      { key: "opensubtitles_enabled", type: "toggle", label: "Use OpenSubtitles", default: true },
      {
        key: "opensubtitles_api_key",
        showIf: { key: "opensubtitles_enabled", equals: true },
        type: "secret",
        label: "API key",
        description: "Required. opensubtitles.com \u2192 your profile \u2192 API consumers \u2192 New consumer."
      },
      {
        key: "opensubtitles_username",
        showIf: { key: "opensubtitles_enabled", equals: true },
        type: "text",
        label: "Username",
        description: "Optional. Logging in raises the daily download limit from 5 to 20 or more."
      },
      { key: "opensubtitles_password", type: "secret", label: "Password", showIf: { key: "opensubtitles_enabled", equals: true } },
      { key: "subdl_enabled", type: "toggle", label: "Use SubDL", default: true },
      { key: "subdl_api_key", type: "secret", label: "API key", description: "subdl.com \u2192 account \u2192 API key.", showIf: { key: "subdl_enabled", equals: true } },
      { key: "subsource_enabled", type: "toggle", label: "Use SubSource", default: true },
      { key: "subsource_api_key", type: "secret", label: "API key", description: "subsource.net \u2192 account \u2192 API key.", showIf: { key: "subsource_enabled", equals: true } }
    ],
    actions: [{ id: "sources", label: "Subtitle providers" }],
    ui: {
      card: [
        { kind: "status", id: "sources", title: "Providers", source: "sources" },
        {
          kind: "form",
          id: "opensubtitles",
          title: "OpenSubtitles",
          description: "The largest library; it can match the exact file you play.",
          fields: ["opensubtitles_enabled", "opensubtitles_api_key", "opensubtitles_username", "opensubtitles_password"]
        },
        { kind: "form", id: "subdl", title: "SubDL", fields: ["subdl_enabled", "subdl_api_key"] },
        { kind: "form", id: "subsource", title: "SubSource", fields: ["subsource_enabled", "subsource_api_key"] }
      ]
    }
  }
};

// src/plugin.ts
var LABELS = { opensubtitles: "OpenSubtitles", subdl: "SubDL", subsource: "SubSource" };
var addon = defineAddon({
  manifest: manifest_default,
  setup(host) {
    setHost(host);
    return {
      resources,
      actions: {
        async sources() {
          const cfg = await config();
          const on = providersOf(cfg);
          return {
            ok: true,
            items: Object.keys(LABELS).map((k) => {
              const value = on[k] ? "On" : cfg[`${k}_enabled`] === "false" ? "Off" : "Off \u2014 add a key";
              return { label: LABELS[k], value, tone: on[k] ? "success" : "warning" };
            })
          };
        }
      }
    };
  }
});
var manifest = addon.manifest;
var register = addon.register;
export {
  addon,
  manifest,
  register
};
