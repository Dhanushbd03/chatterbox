export const chatWithAI = async (req, res, next) => {
  try {
    const { userId, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Simple AI responses based on keywords
    // In a production environment, you would integrate with an AI service like OpenAI, Claude, etc.
    const responses = {
      greeting: [
        "Hello! How can I assist you today?",
        "Hi there! What can I help you with?",
        "Hey! I'm here to help. What's on your mind?",
      ],
      goodbye: [
        "Goodbye! Have a great day!",
        "See you later! Feel free to come back anytime.",
        "Bye! Take care!",
      ],
      help: [
        "I'm an AI assistant here to help you. You can ask me questions, have a conversation, or just chat!",
        "I can help with various topics. Try asking me about technology, general knowledge, or just chat with me!",
      ],
      default: [
        "That's interesting! Tell me more.",
        "I understand. Is there anything specific you'd like to know?",
        "Thanks for sharing! What else would you like to discuss?",
        "Interesting point! Can you elaborate?",
        "I see. How can I help you with that?",
      ],
      thanks: [
        "You're welcome! Happy to help!",
        "My pleasure! Let me know if you need anything else.",
        "Glad I could assist! Feel free to ask more questions.",
      ],
      question: [
        "That's a great question! Let me think about that...",
        "Interesting question! Based on what I know, I'd say...",
        "Good question! Here's what I think...",
      ],
    };

    // Simple keyword matching
    const lowerMessage = message.toLowerCase();
    let response;

    if (lowerMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
      response = responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (lowerMessage.match(/\b(bye|goodbye|see you|later)\b/)) {
      response = responses.goodbye[Math.floor(Math.random() * responses.goodbye.length)];
    } else if (lowerMessage.match(/\b(help|assist|support)\b/)) {
      response = responses.help[Math.floor(Math.random() * responses.help.length)];
    } else if (lowerMessage.match(/\b(thank|thanks|appreciate)\b/)) {
      response = responses.thanks[Math.floor(Math.random() * responses.thanks.length)];
    } else if (lowerMessage.includes("?")) {
      response = responses.question[Math.floor(Math.random() * responses.question.length)];
    } else {
      response = responses.default[Math.floor(Math.random() * responses.default.length)];
    }

    // Add some contextual responses
    if (lowerMessage.includes("weather")) {
      response = "I don't have access to real-time weather data, but you can check a weather service for accurate information!";
    } else if (lowerMessage.includes("time")) {
      response = `The current time is ${new Date().toLocaleTimeString()}`;
    } else if (lowerMessage.includes("date")) {
      response = `Today's date is ${new Date().toLocaleDateString()}`;
    } else if (lowerMessage.includes("name")) {
      response = "I'm your AI Assistant! I'm here to help you with your questions and have friendly conversations.";
    } else if (lowerMessage.includes("how are you")) {
      response = "I'm doing great, thank you for asking! I'm here and ready to help. How are you?";
    }

    return res.json({ response });
  } catch (ex) {
    console.error("Error in AI chat:", ex);
    next(ex);
  }
};
