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

  function writeJSON(key, value) {
    try {
      return write(key, JSON.stringify(value));
    } catch {
      return false;
    }
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
  });

  resetForjaDataOnce();
})();