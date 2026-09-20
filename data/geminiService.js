// Margdarshak AI - Google Gemini 1.5 Flash Live AI Service
// Real-time AI interview generation, customized resume critiques, and dynamic SOP writing
// Zero-external dependencies (uses native HTTPS)

const https = require('https');

class GeminiService {
  constructor() {
    this.defaultApiKey = process.env.GEMINI_API_KEY || '';
  }

  async generateContent(prompt, userApiKey = '') {
    const apiKey = userApiKey || this.defaultApiKey;
    if (!apiKey) {
      // Fallback to built-in rule-based engine
      return null;
    }

    return new Promise((resolve) => {
      const postData = JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      });

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 10000 // 10s timeout
      };

      const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', (d) => { responseBody += d; });
        res.on('end', () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const parsed = JSON.parse(responseBody);
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || null;
              resolve({ success: true, text: text });
            } else {
              console.warn(`Gemini API returned status ${res.statusCode}:`, responseBody);
              resolve({ success: false, fallback: true });
            }
          } catch (e) {
            console.warn("Error parsing Gemini API response", e);
            resolve({ success: false, fallback: true });
          }
        });
      });

      req.on('error', (e) => {
        console.warn("Gemini HTTPS error, activating offline fallback:", e.message);
        resolve({ success: false, fallback: true });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ success: false, fallback: true });
      });

      req.write(postData);
      req.end();
    });
  }
}

module.exports = new GeminiService();
