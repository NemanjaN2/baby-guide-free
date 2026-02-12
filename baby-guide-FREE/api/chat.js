// api/chat.js - FREE VERSION using Hugging Face
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    // Using Hugging Face Inference API (100% FREE, no credit card)
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        },
        body: JSON.stringify({
          inputs: `You are a caring, knowledgeable pediatric resource for new parents. Answer this question about babies in a warm, reassuring way. Be concise but thorough. If it's a medical concern, remind them to consult their pediatrician for personalized advice.

Question: ${question}

Provide a helpful, calming response (maximum 3 paragraphs):`,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            return_full_text: false
          }
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('HuggingFace Error:', data);
      throw new Error(data.error || 'API request failed');
    }

    // HuggingFace returns an array with generated text
    const aiResponse = data[0]?.generated_text || 
                       'I\'m having trouble right now. Please try again in a moment.';

    res.status(200).json({ response: aiResponse.trim() });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'I\'m having trouble connecting right now. Please try again in a moment.' 
    });
  }
}
