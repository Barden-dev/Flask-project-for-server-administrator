import os

from aiogram import Bot, Dispatcher
from dotenv import load_dotenv

load_dotenv()

Bot_Token = os.getenv('bot_token')
bot = Bot(token=str(Bot_Token))

dp = Dispatcher()