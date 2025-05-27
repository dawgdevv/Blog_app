import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const analyzeContent = async (req, res) => {
  const { content, analysisType } = req.body;

  if (!content || !analysisType) {
    return res
      .status(400)
      .json({ message: "Content and analysis type are required" });
  }

  try {
    let suggestions = [];

    switch (analysisType) {
      case "grammar":
        suggestions = await analyzeGrammarWithAI(content);
        break;
      case "enhance":
        suggestions = await enhanceContentWithAI(content);
        break;
      case "tone":
        suggestions = await adjustToneWithAI(content);
        break;
      default:
        return res.status(400).json({ message: "Invalid analysis type" });
    }

    res.json({
      suggestions,
      analysisType,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("AI analysis error:", error);
    res.status(500).json({ message: "Failed to analyze content" });
  }
};

const getSystemPrompt = (analysisType) => {
  switch (analysisType) {
    case "grammar":
      return `You are a professional grammar checker. Analyze the text and provide specific corrections. For each issue, return ONLY the improved version without explanations. Format your response as a JSON array of objects with "original", "improved", and "type" fields.`;

    case "enhance":
      return `You are a content enhancement expert. Improve the given text for better clarity, engagement, and readability. Return ONLY improved versions of sentences/paragraphs. Format as JSON array with "original", "improved", and "type" fields.`;

    case "tone":
      return `You are a tone adjustment expert. Modify the text to make it more engaging and appropriate for blog readers. Return ONLY the improved versions. Format as JSON array with "original", "improved", and "type" fields.`;

    default:
      return "You are a writing assistant.";
  }
};

const createPromptForAnalysis = (content, analysisType) => {
  const instructions = {
    grammar: `Find and fix grammar, spelling, and punctuation errors in this text. Return a JSON array where each object has:
- "original": the incorrect text
- "improved": the corrected text  
- "type": "grammar"
- "reason": brief explanation

Text to analyze: "${content}"

Return only valid JSON, no other text.`,

    enhance: `Improve this text for better clarity, engagement, and flow. Return a JSON array where each object has:
- "original": the original sentence/paragraph
- "improved": the enhanced version
- "type": "enhancement" 
- "reason": what was improved

Text to enhance: "${content}"

Return only valid JSON, no other text.`,

    tone: `Adjust the tone of this text to be more engaging and reader-friendly for a blog. Return a JSON array where each object has:
- "original": the original text
- "improved": the tone-adjusted version
- "type": "tone"
- "reason": what tone aspect was changed

Text to adjust: "${content}"

Return only valid JSON, no other text.`,
  };

  return instructions[analysisType] || instructions.grammar;
};

const parseAIResponse = (response, analysisType) => {
  try {
    // Clean the response
    let cleanResponse = response.trim();

    // Remove any markdown code blocks
    cleanResponse = cleanResponse
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "");

    // Try to find JSON in the response
    const jsonMatch =
      cleanResponse.match(/\[[\s\S]*\]/) || cleanResponse.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      let jsonStr = jsonMatch[0];

      // If it's a single object, wrap in array
      if (jsonStr.startsWith("{")) {
        jsonStr = `[${jsonStr}]`;
      }

      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : [parsed];
    }

    // Fallback: create structured suggestions from text
    return createStructuredSuggestions(response, analysisType);
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return createStructuredSuggestions(response, analysisType);
  }
};

const createStructuredSuggestions = (response, analysisType) => {
  // Split into logical parts and create structured suggestions
  const lines = response.split("\n").filter((line) => line.trim().length > 10);

  return lines.slice(0, 5).map((line, index) => {
    const suggestion = line.trim();

    // Try to extract before/after if pattern exists
    const beforeAfterMatch = suggestion.match(/(.+?)\s*->\s*(.+)/);

    if (beforeAfterMatch) {
      return {
        original: beforeAfterMatch[1].trim(),
        improved: beforeAfterMatch[2].trim(),
        type: analysisType,
        reason: `AI ${analysisType} improvement`,
        confidence: 0.8,
      };
    }

    // If no clear before/after, treat as improvement suggestion
    return {
      original: null,
      improved: suggestion,
      type: analysisType,
      reason: `AI ${analysisType} suggestion`,
      confidence: 0.7,
    };
  });
};

const analyzeGrammarWithAI = async (content) => {
  try {
    const result = await hf.chatCompletion({
      model: "sarvamai/sarvam-m",
      messages: [
        {
          role: "system",
          content: getSystemPrompt("grammar"),
        },
        {
          role: "user",
          content: createPromptForAnalysis(content, "grammar"),
        },
      ],
      temperature: 0.2,
      max_tokens: 800,
    });

    const response = result.choices[0].message.content;
    const suggestions = parseAIResponse(response, "grammar");

    // Ensure we have valid suggestions
    return suggestions.length > 0
      ? suggestions
      : [
          {
            original: null,
            improved: "No grammar issues found in your content.",
            type: "grammar",
            reason: "Content appears to be grammatically correct",
            confidence: 0.9,
          },
        ];
  } catch (error) {
    console.error("Grammar analysis error:", error);
    return [
      {
        original: null,
        improved: "Grammar analysis temporarily unavailable. Please try again.",
        type: "grammar",
        reason: "Service error",
        confidence: 0.1,
      },
    ];
  }
};

const enhanceContentWithAI = async (content) => {
  try {
    const result = await hf.chatCompletion({
      model: "sarvamai/sarvam-m",
      messages: [
        {
          role: "system",
          content: getSystemPrompt("enhance"),
        },
        {
          role: "user",
          content: createPromptForAnalysis(content, "enhance"),
        },
      ],
      temperature: 0.4,
      max_tokens: 800,
    });

    const response = result.choices[0].message.content;
    const suggestions = parseAIResponse(response, "enhance");

    return suggestions.length > 0
      ? suggestions
      : [
          {
            original: null,
            improved:
              "Your content is already well-written. Consider adding more specific examples or details to make it even more engaging.",
            type: "enhancement",
            reason: "General enhancement suggestion",
            confidence: 0.7,
          },
        ];
  } catch (error) {
    console.error("Enhancement analysis error:", error);
    return [
      {
        original: null,
        improved:
          "Content enhancement temporarily unavailable. Please try again.",
        type: "enhancement",
        reason: "Service error",
        confidence: 0.1,
      },
    ];
  }
};

const adjustToneWithAI = async (content) => {
  try {
    const result = await hf.chatCompletion({
      model: "sarvamai/sarvam-m",
      messages: [
        {
          role: "system",
          content: getSystemPrompt("tone"),
        },
        {
          role: "user",
          content: createPromptForAnalysis(content, "tone"),
        },
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    const response = result.choices[0].message.content;
    const suggestions = parseAIResponse(response, "tone");

    return suggestions.length > 0
      ? suggestions
      : [
          {
            original: null,
            improved:
              "Your tone is appropriate for blog content. Consider adding more personal touches or questions to engage readers further.",
            type: "tone",
            reason: "Tone enhancement suggestion",
            confidence: 0.7,
          },
        ];
  } catch (error) {
    console.error("Tone analysis error:", error);
    return [
      {
        original: null,
        improved: "Tone analysis temporarily unavailable. Please try again.",
        type: "tone",
        reason: "Service error",
        confidence: 0.1,
      },
    ];
  }
};
