MIN_PHONE_NUMBER_LENGTH = 6
MAX_PHONE_NUMBER_LENGTH = 15

def isValid(phone):
    digits = sum(symbol.isdigit() for symbol in phone)
    if( digits > MAX_PHONE_NUMBER_LENGTH or digits < MIN_PHONE_NUMBER_LENGTH ):
        return False
    return True