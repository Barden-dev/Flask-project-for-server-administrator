import requests
import os

from dotenv import load_dotenv


def send_telegram_notification(text: str) -> bool:
    
    load_dotenv()
    
    method = "sendMessage"
    url = f"https://api.telegram.org/bot{os.getenv('bot_token')}/{method}"
    
    payload = {
        "chat_id": os.getenv('chat_id'),
        "text": text,
        "parse_mode": "Markdown"
    }
    
    try:
        response = requests.post(url, json=payload)
        print(response)
        return response.ok 
    except requests.exceptions.RequestException:
        return False