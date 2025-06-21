import aiohttp

from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message


router = Router()

@router.message(F.text, Command("status"))
async def handle_status_command(message: Message):
    base_url = "http://localhost:5000/api/v1/system/stats"
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(base_url) as response:
                if response.status == 200:
                    data = await response.json()
                    reply_text = f"CPU: {data['cpu_load']}%\nRAM: {data['mem_used_percent']}%"
                    await message.answer(reply_text)
                else:
                    await message.answer(f"Возникал ошибка с api, Статус:{response.status}")
    except:
        await message.answer("Панель управления видимо выключена, глянь её")
        
@router.message(F.text, Command("chat_id"))
async def handle_chat_id_command(message: Message):
    await message.answer(f"{message.chat.id}")