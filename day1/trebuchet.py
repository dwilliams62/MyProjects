firstDigit = 0
lastDigit = 0
total = 0

with open('calibrationValues.txt', 'r') as i_file:
    while True:
        line = i_file.readline()
        if not line:
            break
        for character in line:
            if character.isdigit():
                firstDigit = character
        for character in reversed(line):
            if character.isdigit():
                lastDigit = character
        total += (int(lastDigit)*10) + int(firstDigit)
        print(total)

print(total)
