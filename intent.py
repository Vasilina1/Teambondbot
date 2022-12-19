import random
import re
import string
import nltk
import os
import urllib.request




# Словарь

intents = {
    'hello': {
        'examples': ['Хелло', "Привет", "Здравствуйте"],
        'responses': ['Добрый день!', "Как дела?", "Как настроение?"]
    },
    'weather': {
        'examples': ['Какая погода?', 'что за окном', "Во что одеваться?"],
        'responses': ['Погода отличная!', "У природы нет плохой погоды!"],
    }
}



#
# text = input()
# if text == 'Какая погода?':
#     print('weather')

if __name__ == "__main__":
    text = input()
    for intent_name in intents:
        for example in intents[intent_name]['examples']:
            if text == example:
                answer = random.choice(intents[intent_name]['responses'])
                print(answer)


#Очистка текста

def clean_up(text):
    #преобразуем слово к нижнему регистру
    text = text.lower()
    # описываем текстовый шаблон для удаления: "все, что НЕ (^) не является буквой \w или пробелом \s"
    re_not_word = r'[^\w\s]'
    #заменяем в исходном тексте то, что соответствует шаблону, на пустой текст (удаляем)
    text = re.sub(re_not_word, '', text)

    return text


def text_match(user_text, example):
    user_text = clean_up(user_text) #приводим к нижнему регистру
    example = clean_up(example) #приводим к нижнему регистру

    return user_text == example

if __name__ == "__main__":
    print(text_match("Привет", "Привет")) #эталон
    print(text_match("привет", "Привет")) #регистр
    print(text_match("Привет!!!", "Привет")) #знаки
    print(text_match("Привет, как дела?", "Привет")) #лишние слова
    print(text_match("Превет", "Привет"))#ошибки с слове



# def text_match(user_text, example):
#     user_text = clean_up(user_text) #приводим к нижнему регистру
#     example = clean_up(example) #приводим к нижнему регистру
#
#     # if user_text.find(example) !=-1:
#     #     return True
#     #
#     # if example.find(user_text) !=-1:
#     #     return True
#
#     example_len = len(example)
#     difference = nltk.edit_distance(user_text, example)
#
#     return (difference / example_len) < 0.4




# print(text_match("Привет", "Привет"))
# print(text_match("привет", "Привет")) #регистр
# print(text_match("Привет!!!", "Привет"))
# print(text_match("Привет, как дела?", "Привет"))
# print(text_match("Превет", "Привет"))


#Определить намерение по тексту


#----

# INTENTS = {
#     "hello": {
#         "examples": ["Привет", "Хеллоу", "Хай"],
#         "responses": ["Здрасте", "Йоу"],
#     },
#     "how-are-you": {
#         "examples": ["Как дела", "Чем занят", "Что нового"],
#         "responses": ["Вроде ничего", "Хорошо, а как сам?"],
#     },
#     "exit": {
#         "examples": ["Пока", "Выход"],
#         "responses": ["Пока-пока!", "о скорой встречи:"],
#     },
# }
#
# def get_intent():
#     for intent in INTENTS:
#         for example in INTENTS[intent]['examples']:
#             if text_match(text, example):
#                 return intent
#
# #Берем случайные респонсы для данного intent'a
# def get_response(intent):
#     return random.choice(INTENTS[intent]['responses'])
#
# # get_intent('какк дела?')
# # get_response('how-are-you')
#
# # text = input('< ')
# # intent = get_intent(text)
# # answer = get_response(intent)
# # print('>', answer)
#
# text = ''
# while not text_match(text,'Выход'):
#     text = input('< ')
#     intent = get_intent(text)
#     answer = get_response(intent)
#     print('>', answer)