const https = require('https');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { to, subject, html } = JSON.parse(event.body);

  const data = JSON.stringify({
    from: 'Nexfolio <info@thenexfolio.com>',
    to: to,
    subject: subject,
    html: html
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_J9ZD5uZ1_J3bcSN2xNMiEMBVNq5yq7ifD',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: body
        });
      });
    });
    req.on('error', (e) => {
      resolve({ statusCode: 500, body: e.message });
    });
    req.write(data);
    req.end();
  });
};
