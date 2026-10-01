/* Lossless transport for Unity data. All assets and Unity's loader stay unchanged. */
(function () {
  'use strict';
  const prefix = new TextEncoder().encode('BIM-DATA-PART-01\n');
  window.prepareGameData = async function (manifestUrl, report) {
    const base = new URL(manifestUrl, location.href);
    const response = await fetch(base, { cache: 'no-cache' });
    if (!response.ok) throw new Error('Could not load game download list.');
    const manifest = await response.json();
    const blobs = new Array(manifest.parts.length);
    let next = 0, completedBytes = 0;
    const controller = new AbortController();
    async function worker() {
      while (next < manifest.parts.length) {
        const index = next++;
        const part = manifest.parts[index];
        let result;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const res = await fetch(new URL(part.path, base), { signal: controller.signal });
            if (!res.ok) throw new Error('Download returned ' + res.status);
            const bytes = new Uint8Array(await res.arrayBuffer());
            if (bytes.length !== part.bytes + prefix.length || !prefix.every((b, i) => bytes[i] === b))
              throw new Error('Incomplete game download.');
            const payload = bytes.subarray(prefix.length);
            const digest = await crypto.subtle.digest('SHA-256', payload);
            const hash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
            if (hash !== part.sha256) throw new Error('Game download integrity check failed.');
            result = new Blob([payload], { type: 'application/octet-stream' });
            break;
          } catch (error) {
            if (controller.signal.aborted || attempt === 2) throw error;
            await new Promise(resolve => setTimeout(resolve, 700 * (attempt + 1)));
          }
        }
        blobs[index] = result;
        completedBytes += part.bytes;
        report(completedBytes / manifest.bytes);
      }
    }
    try { await Promise.all([worker(), worker()]); }
    catch (error) { controller.abort(); throw error; }
    const blob = new Blob(blobs, { type: 'application/octet-stream' });
    if (blob.size !== manifest.bytes) throw new Error('Game download size mismatch.');
    const url = URL.createObjectURL(blob);
    return { url, release: () => URL.revokeObjectURL(url) };
  };
})();
