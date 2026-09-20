module.exports = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify({
    status: 'ok',
    application: 'Margdarshak AI',
    tagline: 'From Classroom to Dream Career — Guided by AI',
    creator: 'Mehak',
    edition: 'SIH 2024 Edition',
    features: [
      'Resume Gap Analyzer',
      'Scholarship Engine & SOP',
      'AI Mock Interviewer',
      '9 Indian Languages',
      'PWA Offline',
      'Multi-User Cloud DB',
      'Gemini AI'
    ]
  }));
};
