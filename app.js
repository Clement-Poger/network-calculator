const translations = {
  uk: {
    "brand-home": "На головну — Subnet Studio",
    "language-label": "Мова",
    "breadcrumb-parent": "Ваша мережа",
    "breadcrumb-current": "Калькулятор",
    eyebrow: "ТРОХИ ЯСНОСТІ ДЛЯ ВАШОЇ МЕРЕЖІ",
    title: 'Розберіться зі своєю <span>підмережею.</span>',
    intro: "Введіть IPv4-адресу та маску підмережі. Ми визначимо адресу мережі, broadcast і діапазон доступних адрес вузлів.",
    "section-kicker": "ПАРАМЕТРИ ПІДМЕРЕЖІ",
    "form-title": "Почніть з адреси",
    "ip-label": "IPv4-адреса",
    "ip-hint": "Адреса, за якою потрібно виконати розрахунок.",
    "mask-label": "Маска підмережі",
    "mask-hint": "Введіть маску у десятковому форматі або префікс (0–32).",
    calculate: "Обчислити підмережу",
    example: "Спробувати приклад",
    "results-kicker": "ВАША МЕРЕЖА НА КАРТІ",
    "results-title": 'Ось ваша підмережа<span class="heading-period">.</span>',
    network: "Адреса мережі",
    "network-note": "Ідентифікатор підмережі",
    broadcast: "Broadcast-адреса",
    "broadcast-note": "Надсилає дані всім вузлам підмережі",
    "host-min": "Перша доступна адреса вузла",
    "host-min-note": "Початок діапазону вузлів",
    "host-max": "Остання доступна адреса вузла",
    "host-max-note": "Кінець діапазону вузлів",
    "host-count": "Доступні адреси вузлів",
    "host-count-note": "Адреси для призначення, включно з введеною IP",
    footnote: "У /31 обидві адреси доступні для з’єднання точка-точка. Підмережа /32 містить одну адресу.",
    footer: "Невеликий інструмент для кращого розуміння мереж.",
    "theme-dark": "Темна тема",
    "theme-light": "Світла тема",
    "error-address": "Введіть коректну IPv4-адресу, наприклад 192.168.1.10.",
    "error-mask": "Введіть коректну суміжну маску підмережі або префікс від 0 до 32."
  },
  fr: {
    "breadcrumb-parent": "Votre réseau",
    "breadcrumb-current": "Calculateur",
    eyebrow: "UN PEU DE CLARTÉ POUR VOTRE RÉSEAU",
    title: 'Comprenez votre <span>sous-réseau.</span>',
    intro: "Saisissez une adresse IPv4 et un masque de sous-réseau. Retrouvez le réseau, le broadcast et la plage d’hôtes utilisables.",
    "section-kicker": "DÉTAILS DU SOUS-RÉSEAU",
    "form-title": "Commencez par une adresse",
    "ip-label": "Adresse IPv4",
    "ip-hint": "L’adresse à partir de laquelle effectuer le calcul.",
    "mask-label": "Masque de sous-réseau",
    "mask-hint": "Saisissez un masque décimal ou un préfixe (0–32).",
    calculate: "Calculer le sous-réseau",
    example: "Essayer un exemple",
    "results-kicker": "VOTRE RÉSEAU EN UN COUP D’ŒIL",
    "results-title": 'Voici votre sous-réseau<span class="heading-period">.</span>',
    network: "Adresse réseau",
    "network-note": "Identifiant du sous-réseau",
    broadcast: "Adresse de broadcast",
    "broadcast-note": "Atteint tous les hôtes du sous-réseau",
    "host-min": "Premier hôte utilisable",
    "host-min-note": "Début de la plage d’hôtes",
    "host-max": "Dernier hôte utilisable",
    "host-max-note": "Fin de la plage d’hôtes",
    "host-count": "Adresses hôtes utilisables",
    "host-count-note": "Adresses attribuables, IP saisie incluse",
    footnote: "En /31, les deux adresses sont utilisables sur un lien point à point. Un /32 contient une adresse.",
    footer: "Un petit outil pour mieux voir son réseau.",
    "theme-dark": "Mode sombre",
    "theme-light": "Mode clair",
    "error-address": "Saisissez une adresse IPv4 valide, par exemple 192.168.1.10.",
    "error-mask": "Saisissez un masque contigu valide ou un préfixe de 0 à 32.",
    "error-generic": "Impossible de calculer ce sous-réseau. Vérifiez l’adresse et le masque."
  }
};

const root = document.documentElement;
const form = document.getElementById("calculator-form");
const addressInput = document.getElementById("ip-address");
const netmaskInput = document.getElementById("netmask");
const errorMessage = document.getElementById("form-error");
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");
const themeIcon = document.querySelector(".theme-icon");
const languageNavigation = document.getElementById("language-navigation");
let language = readPreference("subnet-studio-language", "uk");
let theme = readPreference("subnet-studio-theme", getPreferredTheme());
if (!translations[language]) language = "uk";
if (theme !== "light" && theme !== "dark") theme = getPreferredTheme();

function readPreference(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The app remains usable when storage is disabled.
  }
}

function applyLanguage() {
  root.lang = language === "uk" ? "uk" : "fr";
  document.title = language === "uk" ? "Subnet Studio — калькулятор IPv4" : "Subnet Studio — calculateur IPv4";
  languageNavigation.setAttribute("aria-label", translations[language]["language-label"]);
  document.querySelector(".brand").setAttribute("aria-label", translations[language]["brand-home"]);
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[language][key]) element.innerHTML = translations[language][key];
  });
  document.querySelectorAll(".language-button").forEach((button) => {
    const selected = button.dataset.language === language;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  updateThemeLabel();
  savePreference("subnet-studio-language", language);
}

function getPreferredTheme() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme() {
  root.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", translations[language][theme === "light" ? "theme-dark" : "theme-light"]);
  themeIcon.textContent = theme === "light" ? "☾" : "☀";
  updateThemeLabel();
  savePreference("subnet-studio-theme", theme);
}

function updateThemeLabel() {
  themeLabel.textContent = translations[language][theme === "light" ? "theme-dark" : "theme-light"];
}

function parseIPv4(value) {
  const parts = value.trim().split(".");
  if (parts.length !== 4 || parts.some((part) => !/^\d{1,3}$/.test(part))) return null;
  const octets = parts.map(Number);
  if (octets.some((octet) => octet < 0 || octet > 255)) return null;
  return octets.reduce((total, octet) => total * 256 + octet, 0);
}

function formatIPv4(value) {
  return [24, 16, 8, 0].map((shift) => Math.floor(value / (2 ** shift)) % 256).join(".");
}

function parseNetmask(value) {
  const trimmed = value.trim();
  if (/^\d{1,2}$/.test(trimmed)) {
    const prefix = Number(trimmed);
    if (prefix <= 32) return prefix;
    return null;
  }

  const mask = parseIPv4(trimmed);
  if (mask === null) return null;
  for (let prefix = 0; prefix <= 32; prefix += 1) {
    const expected = prefix === 0 ? 0 : (2 ** 32) - (2 ** (32 - prefix));
    if (mask === expected) return prefix;
  }
  return null;
}

function calculate(address, prefix) {
  const blockSize = 2 ** (32 - prefix);
  const network = Math.floor(address / blockSize) * blockSize;
  const broadcast = network + blockSize - 1;
  const totalAddresses = blockSize;
  const usableCount = prefix <= 30 ? Math.max(0, totalAddresses - 2) : totalAddresses;
  const firstHost = prefix <= 30 ? network + 1 : network;
  const lastHost = prefix <= 30 ? broadcast - 1 : broadcast;

  return { network, broadcast, firstHost, lastHost, usableCount, prefix };
}

function displayResult(result) {
  document.getElementById("network-result").textContent = formatIPv4(result.network);
  document.getElementById("broadcast-result").textContent = formatIPv4(result.broadcast);
  document.getElementById("host-min-result").textContent = formatIPv4(result.firstHost);
  document.getElementById("host-max-result").textContent = formatIPv4(result.lastHost);
  document.getElementById("host-count-result").textContent = result.usableCount.toLocaleString(language === "fr" ? "fr-FR" : "uk-UA");
  document.getElementById("prefix-badge").textContent = `/${result.prefix}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const address = parseIPv4(addressInput.value);
  const prefix = parseNetmask(netmaskInput.value);

  if (address === null) {
    errorMessage.textContent = translations[language]["error-address"];
    addressInput.setAttribute("aria-invalid", "true");
    netmaskInput.removeAttribute("aria-invalid");
    return;
  }
  if (prefix === null) {
    errorMessage.textContent = translations[language]["error-mask"];
    netmaskInput.setAttribute("aria-invalid", "true");
    addressInput.removeAttribute("aria-invalid");
    return;
  }

  errorMessage.textContent = "";
  addressInput.removeAttribute("aria-invalid");
  netmaskInput.removeAttribute("aria-invalid");
  displayResult(calculate(address, prefix));
});

document.getElementById("example-button").addEventListener("click", () => {
  addressInput.value = "10.0.5.23";
  netmaskInput.value = "255.255.252.0";
  form.requestSubmit();
});

document.querySelectorAll(".language-button").forEach((button) => {
  button.addEventListener("click", () => {
    language = button.dataset.language;
    applyLanguage();
    const errorKey = addressInput.getAttribute("aria-invalid") ? "error-address" : netmaskInput.getAttribute("aria-invalid") ? "error-mask" : null;
    if (errorKey) errorMessage.textContent = translations[language][errorKey];
    const count = document.getElementById("host-count-result");
    const numericCount = Number(count.textContent.replace(/[^\d]/g, ""));
    if (Number.isFinite(numericCount)) count.textContent = numericCount.toLocaleString(language === "fr" ? "fr-FR" : "uk-UA");
  });
});

themeToggle.addEventListener("click", () => {
  theme = theme === "light" ? "dark" : "light";
  applyTheme();
});

applyLanguage();
applyTheme();
form.requestSubmit();