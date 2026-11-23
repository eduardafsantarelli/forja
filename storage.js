'use strict';

(() => {
  const keys = Object.freeze({
    appData: 'forja-v1',
    preferences: 'forja-experience-v1',
    account: 'forja-local-account-v1',
    session: 'forja-local-session',
    resetMarker: 'forja-initial-reset-v4',
  });

  function read(key, fallback = null) {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function readJSON(key, fallback = null) {
    const value = read(key);
    if (value === null) return fallback;

    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, String(value));
      return true;
    } catch {
      return false;
    }
  }

  // Quem precisa saber de gravações (ex.: sincronização com a nuvem) se inscreve aqui.
  const listeners = new Set();

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function writeJSON(key, value) {
    let saved = false;
    try {
      saved = write(key, JSON.stringify(value));
    } catch {
      return false;
    }
    if (saved) {
      listeners.forEach((listener) => {
        try {
          listener(key);
        } catch {
          /* um ouvinte com erro não impede a gravação */
        }
      });
    }
    return saved;
  }

  function remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  function readSession(key, fallback = null) {
    try {
      return sessionStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeSession(key, value) {
    try {
      sessionStorage.setItem(key, String(value));
      return true;
    } catch {
      return false;
    }
  }

  function removeSession(key) {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  function resetForjaDataOnce() {
    if (read(keys.resetMarker) === 'done') return;

    for (const key of [keys.appData, keys.preferences, keys.account]) remove(key);
    removeSession(keys.session);
    write(keys.resetMarker, 'done');
  }

  window.ForjaStorage = Object.freeze({
    keys,
    read,
    readJSON,
    write,
    writeJSON,
    remove,
    readSession,
    writeSession,
    removeSession,
    resetForjaDataOnce,
    subscribe,
  });

  resetForjaDataOnce();
})();