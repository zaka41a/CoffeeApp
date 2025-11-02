// frontend/src/_api.js  (nouveau helper – importez-le où besoin)
const PROTOCOL = window.location.protocol === "https:" ? "https" : "http";
const HOSTNAME = window.location.hostname || "localhost";
const BASE = `${PROTOCOL}://${HOSTNAME}`;
const APP_DIR = "CoffeeApp";

export const API = `${BASE}/${APP_DIR}/backend/api`;
export const IMG = `${BASE}/${APP_DIR}/backend/`;
export const fetchJSON = (url, opts = {}) =>
  fetch(url, { credentials: "include", ...opts }).then((r) =>
    r.json().catch(() => ({}))
  );
