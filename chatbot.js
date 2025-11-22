// chatbot.js (ESM)

export default async function generateResponse(message) {
    try {
        // Placeholder simple response — extend to call external APIs if needed
        return { reply: `You said: ${message}` };
    } catch (error) {
        console.error("Error generating response:", error);
        return { reply: "Sorry, something went wrong." };
    }
}
