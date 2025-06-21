import asyncio
import logging

from bot.bot_instance import bot, dp
from bot.handlers import common_handlers, command_handlers

logging.basicConfig(level=logging.INFO)

async def main():
    dp.include_router(common_handlers.router)
    dp.include_router(command_handlers.router)
    
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)
    
if __name__ == "__main__":
    asyncio.run(main())