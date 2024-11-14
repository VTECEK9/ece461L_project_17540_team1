from cryptography.fernet import Fernet
from hashlib import sha256

def encrypt(str):
    return sha256(str.encode()).hexdigest()

def decrypt(str):
    return None#fernet.decrypt(str.encode()).decode('utf-8')

print(encrypt("gouldh"))
print(encrypt("gouldh"))
print(encrypt("bruh"))