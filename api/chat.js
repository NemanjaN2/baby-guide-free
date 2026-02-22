export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: 'You are a warm, calm assistant for first-time parents. Answer questions about baby care, development, and health in simple, reassuring language. Keep answers concise. Always remind parents to consult their pediatrician for serious concerns. Understood?' }]
            },
            {
              role: 'model',
              parts: [{ text: 'Understood! I am here to help first-time parents with warm, clear answers about baby care.' }]
            },
            {
              role: 'user',
              parts: [{ text: question }]
            }
          ]
        })
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Gemini API error');
    const text = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ response: text });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
