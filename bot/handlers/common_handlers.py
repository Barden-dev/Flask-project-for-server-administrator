from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import Message


router = Router()

@router.message(CommandStart())
async def handle_start_command(message: Message):
    user_name = message.from_user.first_name # type: ignore
    await message.answer(f"Привет, {user_name}! Я твой личный ассистент для управления сервером. Крутой прям")
