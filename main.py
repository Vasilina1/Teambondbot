import datetime

from telethon.tl.custom import Button
from telethon import TelegramClient, events
import psycopg2
import configparser
import sys
import os





#----

#---

config_name = 'config.ini'
if getattr(sys, 'frozen', False):
    application_path = os.path.dirname(sys.executable)
else:
    application_path = os.path.dirname(__file__)
config_path = os.path.join(application_path, config_name)
config = configparser.ConfigParser()
config.read(config_path, encoding='utf-8')
blacklist = list(map(int, config["bot"]["blacklist"].split(","))) if config["bot"]["blacklist"] else []
admins = list(map(int, config["bot"]["admins"].split(",")))
dispatchers = list(map(int, config["bot"]["dispatchers"].split(",")))
chats = map(lambda x: x.strip().split(":"), config["bot"]["chats"].split(","))
chats = {x: int(y) for x, y in chats}

connection = psycopg2.connect(
    database=config["db"]["name"],
    user=config["db"]["user"],
    password=config["db"]["password"],
    host=config["db"]["host"],
    port=int(config["db"]["port"]))
connection.autocommit = True

client = TelegramClient('session', int(config["main"]["api_id"]), config["main"]["api_hash"])
buttons = [
    [Button.inline('Заказы/Возвраты/Мульти поставщик страхования', 'Заказы'), True, False],
    [Button.inline('Маркетплейсы/Goods/Сбер/Tmall/DPD/PickPoint', 'Маркет'), True, True],
    [Button.inline('Склад', 'Склад'), True, True, Button.inline('Лояльность', 'Лояльность'), True, True,
     Button.inline('Гарантия', 'Гарантия'), True, True],
    [Button.inline('Доставка/TMS (Антор)/Подряд ТК', 'Доставка'), True, True],
    [Button.inline('Закупки/Внешние поставщики/Вельвика/АЦО', 'Закупки'), True, True],
    [Button.inline('ЭДО/Корректировочные счет-фактуры', 'ЭДО'), True, True],
    [Button.inline('Финансы/Бухгалтерия/Кассы/Холдирование', 'Финансы'), True, True],
    [Button.inline('Права доступа', 'Права'), True, True, Button.inline('Маркировка', 'Маркировка'), True, True],
    [Button.inline('Зависание/Планировщик/Печать документов', 'Зависание'), True, True],
    [Button.inline('Открытие новых ТТ/складов', 'Открытия'), True, False],
    [Button.inline('Супервизоры', 'Супервизоры'), True, False, Button.inline('Консультанты', 'Консультанты'), True, False],
    [Button.inline('Диспетчеры', 'Диспетчеры'), True, False, Button.inline('Веб', 'Веб'), False, False]

    #   [Button.inline('4', '4'), Button.inline('5', '5'), Button.inline('6', '6')],
    #   [Button.inline('7', '7'), Button.inline('8', '8'), Button.inline('9', '9')],
    #  [Button.inline('10', '10'), Button.inline('11', '11'), Button.inline('12', '12')],
    #   [Button.inline('13', '13'), Button.inline('14', '14')]
]

admin_buttons = [[Button.inline("Статистика", "stats")], [Button.inline('Отправить запрос', 'send')],
                 [Button.inline("Черный список", "blacklist")]]

dispatcher_buttons = []
for x in buttons:
    temp = []
    for y in range(0, len(x), 3):
        if x[y + 1]:
            temp.append(x[y])
    if temp:
        dispatcher_buttons.append(temp)
user_buttons = []
for x in buttons:
    temp = []
    for y in range(0, len(x), 3):
        if x[y + 2]:
            temp.append(x[y])
    if temp:
        user_buttons.append(temp)

temp1 = []
for x in buttons:
    temp = []
    for y in range(0, len(x), 3):
        temp.append(x[y])
    temp1.append(temp)
buttons = temp1
today = 'AND "sentAt" >= \'today\''


def execute_statement(query, vars):
    try:
        connection.cursor().execute(query, vars=vars)
    except Exception as e:
        print(e)


def execute_read_statement(query, vars):
    cursor = connection.cursor()
    try:
        cursor.execute(query, vars=vars)
        result = cursor.fetchall()
        return result
    except Exception as e:
        print(e)
        return []


async def get_user(telegramId):
    res = execute_read_statement("SELECT category, lastmsg FROM users WHERE telegramid=%s::INTEGER", (telegramId,))
    if (res):
        return User(telegramId, res[0][1], res[0][0])
    else:
        execute_statement('''INSERT INTO users VALUES (%s::INTEGER,%s,%s::INTEGER)''', (telegramId, "0", 1))
        return User(telegramId)


class User:
    def __init__(self, telegramId, last=1, category="0"):
        self.last = last
        self.category = str(category)
        self.telegramId = telegramId

    def set_category(self, category):
        self.category = category
        execute_statement('''UPDATE users SET category = %s WHERE telegramid = %s::INTEGER''',
                          (category, self.telegramId))

    def get_category(self):
        return self.category

    async def send_message(self, text, buttons_to_send=None, with_save=True):
        res = await client.send_message(self.telegramId, text, parse_mode="markdown", buttons=buttons_to_send)
        try:
            await client.delete_messages(self.telegramId, self.last)
        except:
            pass
        if with_save:
            self.last = res.id
            execute_statement('''UPDATE users SET lastmsg=%s::INTEGER WHERE telegramid=%s::INTEGER''',
                              (res.id, self.telegramId))

    def save_message(self, text, category):
        execute_statement('''INSERT INTO messages VALUES (%s::INTEGER,%s,%s,%s)''',
                          (self.telegramId, category, text, datetime.datetime.now()))

    def is_admin(self):
        return self.telegramId in admins

    def is_dispatcher(self):
        return self.telegramId in dispatchers

    def prepare_buttons(self):
        if self.is_admin():
            return buttons
        if self.is_dispatcher():
            return dispatcher_buttons
        return user_buttons


def get_name(message):
    name = "Пользователя"
    try:
        if message.sender.first_name:
            name = message.sender.first_name
            if message.sender.last_name:
                name += " " + message.sender.last_name
    except:
        pass
    return name


@client.on(events.NewMessage())
async def message_handler(event):
    user = await get_user(event.message.sender_id)
    if user.telegramId in blacklist:
        await user.send_message("Вы попали в черный список. Для разблокировки обратитесь к")
        return

    if user.category == "b":
        if event.message.text.isdigit():
            blacklist.append(int(event.message.text))
            config["bot"]["blacklist"] = ", ".join(map(str, blacklist))
            with open(config_path, "w", encoding="utf-8") as f:
                config.write(f)
        user.set_category("0")
        await user.send_message(
            "Выберите действие:",
            buttons_to_send=admin_buttons)
        return

    if user.category != "0":
        if user.is_admin():
            await user.send_message(
                "Ваше сообщение принято на обработку.\n\nВыберите действие:",
                buttons_to_send=admin_buttons)
        else:
            await user.send_message(
                "Ваше сообщение принято на обработку.\n\nВы можете выбрать категорию для другого обращения:",
                buttons_to_send=user.prepare_buttons())
        await client.send_message(chats[user.get_category()],
                                  f"{event.message.text} от {'*' if user.is_dispatcher() else '§' if user.is_admin() else ''}[{get_name(event.message)}](tg://user?id={user.telegramId})",
                                  parse_mode="markdown")
        user.save_message(event.message.text, user.category)
        user.set_category("0")
    else:
        if user.is_admin():
            await user.send_message("Выберите действие:", admin_buttons)
            return
        await user.send_message("Выберите категорию для обращения:", buttons_to_send=user.prepare_buttons())


@client.on(events.CallbackQuery())
async def query_handler(event):
    if event.sender_id in blacklist:
        return
    user = await get_user(event.sender_id)
    data = event.data.decode('utf-8')
    if data == "stats":
        await user.send_message("Выберите тип статистики:",
                                buttons_to_send=[[Button.inline("За сегодня", "day"), Button.inline("Всё время", "all")],
                                                 [Button.inline("Назад", "back")]])
        return
    if data == "all" or data == "day":
        await user.send_message("Выберите тип статистики:", buttons_to_send=[
            [Button.inline('Сообщения', f'{data}_messages'), Button.inline('Категории', f'{data}_categories'),
             Button.inline('Заявки', f'{data}_requests')], [Button.inline("Назад", "back")]])
        return
    if data.endswith("messages"):
        msgs = execute_read_statement(
            f'''SELECT COUNT(*) FROM messages WHERE NOT category = '0' AND NOT category = 'b' {today if data.startswith("day") else ''} ''',
            ())
        count = 0 if not msgs else msgs[0][0]
        await user.send_message(f"Отправлено {count} сообщений", with_save=False)
        await user.send_message("Выбрите действие:", buttons_to_send=admin_buttons)
        return

    if data.endswith("requests"):
        requests = execute_read_statement(
            f'''SELECT userid,COUNT(*) as c FROM messages WHERE NOT category = '0' AND NOT category = 'b' {today if data.startswith("day") else ''} GROUP BY userid ORDER BY c DESC''',
            ())
        result = ""
        for request in requests:
            result += f"[{request[0]}](tg://user?id={request[0]}) - {request[1]} запросов.\n"
        await user.send_message(result, with_save=False)
        await user.send_message("Выбрите действие:", buttons_to_send=admin_buttons)
        return

    if data.endswith("categories"):
        categories = execute_read_statement(
            f'''SELECT category,COUNT(*) as c FROM messages WHERE NOT category = '0' AND NOT category = 'b' {today if data.startswith("day") else ''} GROUP BY category ORDER BY c DESC''',
            ())
        result = ""
        for category in categories:
            result += f"{category[0]} - {category[1]} запросов.\n"
        await user.send_message(result, with_save=False)
        await user.send_message("Выбрите действие:", buttons_to_send=admin_buttons)
        return

    if data == "blacklist":
        bl_buttons = [[Button.inline("Добавить", "add_blacklist")]]
        temp = []
        for x in blacklist:
            temp.append(Button.inline(str(x), "del" + str(x)))
            if len(temp) == 3:
                bl_buttons.append(temp)
                temp = []
        if temp:
            bl_buttons.append(temp)
        bl_buttons.append([Button.inline("Назад", "back")])
        text = ", ".join(
            map(lambda x: f"[{x}](tg://user?id={x})", blacklist)) if blacklist else "Не добавлено пользователей"
        await user.send_message(text,
                                bl_buttons)
        return

    if data.startswith("del"):
        target = int(data[3:])
        blacklist.remove(target)
        config["bot"]["blacklist"] = ", ".join(map(str, blacklist))
        with open(config_path, "w", encoding="utf-8") as f:
            config.write(f)
        await user.send_message(
            "Выберите действие:",
            buttons_to_send=admin_buttons)
        return

    if data == "add_blacklist":
        user.set_category("b")
        await user.send_message("Введите айди для добавления в черный список",
                                buttons_to_send=[[Button.inline("Назад", "back")]])
        return

    if data == "send":
        await user.send_message("Выберите категорию для обращения:",
                                buttons_to_send=user.prepare_buttons() + [[Button.inline("Назад", "back")]])
        return

    if data == "back":
        if user.telegramId in admins:
            await user.send_message("Выберите действие:", admin_buttons)
            return
        user.set_category("0")
        await user.send_message("Выберите категорию для обращения:", buttons_to_send=user.prepare_buttons())
        return
    user.set_category(data)
    await user.send_message(f"Введите номер обращения и текст (выбрана {data} категория):",
                            buttons_to_send=[[Button.inline("Назад", "back")]])


client.start(bot_token=config["main"]["token"])

while True:
    try:
        client.loop.run_forever()
    except:
        continue
