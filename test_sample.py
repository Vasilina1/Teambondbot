# content of test_sample.py

from phoneValidator import *
from intent import *

def test_something():
    assert True == True

# def func(x):
#     return x + 2
#
# def test_answer():
#     assert func(3) == 5
#
#
# def test_ifWeCanExecuteTests():
#     assert True
#
# def test_validatePhome():
#     assert isValid("+1(111)11-11-111")
#     assert isValid("this is definitely not valid phone number") == False
#
def test_clean_up():
    assert clean_up("Привет")=="привет"
    assert clean_up("Привет!!")=="привет"
#
#
# def test_text_match():
#     assert text_match(clean_up("Привет"), "привет") == True
#     assert text_match(clean_up("Привет!!!"), "Привет") == True
#

