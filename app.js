const translations = {
  en: {
    "brand-home": "Network Calculator home",
    "language-label": "Language",
    "breadcrumb-parent": "Your network",
    "breadcrumb-current": "Calculator",
    eyebrow: "A LITTLE CLARITY FOR YOUR NETWORK",
    title: 'Make sense of your <span>subnet.</span>',
    intro: "Enter an IPv4 address and subnet mask to find the network address, broadcast address and usable host range.",
    "section-kicker": "YOUR SUBNET DETAILS",
    "form-title": "Start with an address",
    "ip-label": "IPv4 address",
    "ip-hint": "The ip address you want to calculate from (e.g., 192.168.1.10).",
    "mask-label": "Subnet mask",
    "mask-hint": "Enter a dotted mask or prefix length (0–32).",
    calculate: "Calculate subnet",
    example: "Use example",
    "results-kicker": "YOUR NETWORK, MAPPED OUT",
    "results-title": 'Here’s your subnet<span class="heading-period">.</span>',
    network: "Network address",
    "network-note": "The subnet identifier",
    broadcast: "Broadcast address",
    "broadcast-note": "Reaches every host in the subnet",
    "host-min": "First usable host",
    "host-min-note": "Host range begins",
    "host-max": "Last usable host",
    "host-max-note": "Host range ends",
    "host-count": "Usable host addresses",
    "host-count-note": "Assignable addresses, including the entered IP",
    footnote: "For /31, both addresses are usable on point-to-point links. A /32 contains one address.",
    footer: "Small tool, clearer networks.",
    "theme-dark": "Dark mode",
    "theme-light": "Light mode",
    "error-address": "Enter a valid IPv4 address, for example 192.168.1.10.",
    "error-mask": "Enter a valid contiguous subnet mask or a prefix from 0 to 32.",
    "error-generic": "Unable to calculate this subnet. Check the address and mask."
  },
  fr: {
    "brand-home": "Accueil — Network Calculator",
    "language-label": "Langue",
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
const languageNavigation = document.getElementById("language-navigation");
let language = readPreference("network-calculator-language", readPreference("subnet-studio-language", "en"));
let theme = readPreference("subnet-studio-theme", getPreferredTheme());
if (language === "uk" || !translations[language]) language = "en";
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
  root.lang = language === "en" ? "en-GB" : "fr";
  document.title = language === "en" ? "Network Calculator — IPv4 subnet calculator" : "Network Calculator — calculateur de sous-réseau IPv4";
  languageNavigation.setAttribute("aria-label", translations[language]["language-label"]);
  languageNavigation.dataset.activeLanguage = language;
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
  savePreference("network-calculator-language", language);
}

function getPreferredTheme() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme() {
  root.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", translations[language][theme === "dark" ? "theme-dark" : "theme-light"]);
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  updateThemeLabel();
  savePreference("subnet-studio-theme", theme);
}

function updateThemeLabel() {
  themeLabel.textContent = translations[language][theme === "dark" ? "theme-dark" : "theme-light"];
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

function formatMaskedBinary(value, prefix) {
  const octets = [24, 16, 8, 0].map((shift) => {
    const octet = Math.floor(value / (2 ** shift)) % 256;
    return octet.toString(2).padStart(8, "0");
  });

  let bitIndex = 0;
  return octets.map((octet) => {
    const networkLength = Math.max(0, Math.min(8, prefix - bitIndex));
    bitIndex += 8;
    const networkBits = octet.slice(0, networkLength);
    const hostBits = octet.slice(networkLength);
    return [
      networkBits ? `<span class="binary-network">${networkBits}</span>` : "",
      hostBits ? `<span class="binary-host">${hostBits}</span>` : ""
    ].join("");
  }).join(" ");
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
  document.getElementById("network-bin-result").innerHTML = formatMaskedBinary(result.network, result.prefix);
  document.getElementById("broadcast-bin-result").innerHTML = formatMaskedBinary(result.broadcast, result.prefix);
  document.getElementById("host-min-bin-result").innerHTML = formatMaskedBinary(result.firstHost, result.prefix);
  document.getElementById("host-max-bin-result").innerHTML = formatMaskedBinary(result.lastHost, result.prefix);
  document.getElementById("host-count-result").textContent = result.usableCount.toLocaleString(language === "fr" ? "fr-FR" : "en-GB");
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
    if (Number.isFinite(numericCount)) count.textContent = numericCount.toLocaleString(language === "fr" ? "fr-FR" : "en-GB");
  });
});

themeToggle.addEventListener("click", () => {
  theme = theme === "light" ? "dark" : "light";
  applyTheme();
});

applyLanguage();
applyTheme();
form.requestSubmit();