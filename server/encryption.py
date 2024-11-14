from hashlib import sha256

#These are our very basic "keys"
n = 13
d = 1

def encrypt(str):
    return sha256(str.encode()).hexdigest()

def encrypt(inputText):
    reversed = inputText[::-1]
    outputText = shift(reversed, d)
    return outputText

def decrypt(inputText):
    outputText = shift(inputText, -d)
    reversed = outputText[::-1]
    return reversed

def shift(inputText, dir):
    toReturn = []
    for ch in inputText:
        idx = ord(ch)
        if dir == 1: #Shifting right
            if idx+n > 126: 
                idx = (idx+n)%127+34
            else:
                idx += n
        elif dir == -1: #Shifting left
            if idx-n < 34:
                idx = (idx-n)+93
            else:
                idx -= n
        toReturn.append(chr(idx))
    return "".join(toReturn)

print(encrypt("huddyg"))