const { startTunnel } = require('untun');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    console.log('Initiating secure Cloudflare public tunnel for port 5173...');
    const tunnel = await startTunnel({ port: 5173 });
    const url = await tunnel.getURL();
    const log = `\n======================================================\n` +
                `🌐 PUBLIC URL (Accessible on Android, iPhone & Laptop):\n` +
                `👉 ${url}\n` +
                `======================================================\n`;
    fs.writeFileSync(path.join(__dirname, 'public_url.txt'), url);
    console.log(log);
  } catch (err) {
    console.error('Tunnel error:', err);
    fs.writeFileSync(path.join(__dirname, 'public_url.txt'), 'ERR: ' + err.message);
  }
})();
