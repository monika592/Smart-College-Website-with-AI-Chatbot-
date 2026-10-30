// testDynamicKB.js
const { getChatbotEngine, addToKnowledgeBase } = require('./backend/utils/websiteLoader.js');

// Test the dynamic knowledge base
console.log('🧪 Testing Dynamic Knowledge Base...');

const chatbot = getChatbotEngine();

// Test 1: Add a dynamic answer
console.log('\n1. Adding dynamic answer...');
const addResult = addToKnowledgeBase(
  "What is the college mascot?",
  "RJ College doesn't have an official mascot, but our symbol is the torch of knowledge representing enlightenment and education! 🔥📚",
  "general"
);
console.log('Add Result:', addResult);

// Test 2: Generate response (should use dynamic answer)
console.log('\n2. Testing response generation...');
const response1 = chatbot.generateResponse("What is the college mascot?");
console.log('Response:', response1);

// Test 3: Check if it's using dynamic knowledge base
console.log('\n3. Checking knowledge base stats...');
const stats = chatbot.responseGenerator.getDynamicKnowledgeStats();
console.log('Knowledge Base Stats:', stats);

// Test 4: Test with a different question (should use normal flow)
console.log('\n4. Testing normal question...');
const response2 = chatbot.generateResponse("Who is the principal?");
console.log('Response:', response2.substring(0, 100) + '...');

console.log('\n✅ Dynamic Knowledge Base Test Complete!');