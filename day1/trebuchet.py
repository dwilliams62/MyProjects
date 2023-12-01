#initialize variables
firstDigit = 0 
lastDigit = 0
total = 0

#open the txt file
with open('calibrationValues.txt', 'r') as i_file:
    #always loops, but if readline failes then the loop breaks
    while True:
        line = i_file.readline()
        if not line:
            break
        #for each character in the line, check if it's a digit, get the first digit that's found and stop looping
        #then checks in reverse order and loops through until a digit is found and breaks
        for character in line:
            if character.isdigit():
                firstDigit = character
                break
        for character in reversed(line):
            if character.isdigit():
                lastDigit = character
                break
        #then the total is increased by the first digit and the second digit combined to make one number
        total += (int(firstDigit)*10) + int(lastDigit)

#print the result
print(total)
