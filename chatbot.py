import google.generativeai as genai

API_KEY = "GOOGLE_APIKEY_YOURS"
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro-latest")
chat_session = model.start_chat()


def get_gemini_response(message: str) -> str:
    message = message.strip().lower()
    if message in ["hi", "hello", "hey"]:
        return "Hello 👋! How can I assist you today regarding traffic or safety?"
    try:
        response = chat_session.send_message(message)
        return response.text
    except Exception as e:
        return f"Error communicating with Gemini: {e}"


