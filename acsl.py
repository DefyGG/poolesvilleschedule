#!/bin/python3

import math
import os
import random
import re
import sys


#
# Complete the 'encodeMessage' function below.
#
# The function is expected to return a STRING.
# The function accepts following parameters:
#  1. STRING text
#  2. STRING message
#

def splitText(text):
    # text = text.split("  ")
    text = re.split('\.|\!|\?', text)
    for i in range(len(text)):
        split = []
        string = ""
        for char in text[i]:
            if (char != " " and char.isalnum()):
                string += char
            else:
                if (string != ""):
                    split.append(string)
                string = ""
        if (string != ""):
            split.append(string)
        text[i] = split
    return text

def generateMap(text):
    vals = {}
    for i in range(len(text)):
        for j in range(len(text[i])):
            for k in range(len(text[i][j])):
                if (text[i][j][k] not in vals):
                    vals[text[i][j][k]] = [str(i+1)+"."+str(j+1)+"."+str(k+1)]
                else:
                    vals[text[i][j][k]].append(str(i+1)+"."+str(j+1)+"."+str(k+1))
    return vals
def encodeMessage(text, message):
    text = splitText(text)
    print(text)
    chars = generateMap(text)
    ans = ""
    counter = 1
    for i in range(len(message)):
        char = message[i]

        if (char == " "):
            ans = ans.rstrip(" ")
            ans += "_"
        elif (not char.isalnum()):
            ans = ans.rstrip(" ")
            ans += char
        else:
            index = counter
            while (index > len(chars[char])):
                index = index // 2
    
            ans += chars[char][index-1]
            ans += " "
            counter += 1
        # print(ans)
    
        
    return ans.rstrip(" ")
text = "There are 10 kinds of people in the world:  those who know binary and those who don't!  Make sure you learn binary.  Computers all use it."
message = "Could you be the 0 kind or the 1 kind?"
print(encodeMessage(text, message))
