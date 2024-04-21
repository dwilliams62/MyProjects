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
        for i in range(len(line)):
            if line[i].isdigit():
                firstDigit = line[i]
                break
            if line[i] == 'o':
                if i + 2 < len(line):
                    if line[i] + line[i + 1] + line[i + 2] == "one":
                        firstDigit = 1
                        break
            if line[i] == 't':
                if i + 2 < len(line):
                    if line[i] + line[i + 1] + line[i + 2] == "two":
                        firstDigit = 2
                        break
            if line[i] == 't':
                if i + 4 < len(line):
                    if line[i] + line[i + 1] + line[i + 2] + line[i + 3] + line[i + 4] == "three":
                        firstDigit = 3
                        break
            if line[i] == 'f':
                if i + 3 < len(line):
                    if line[i] + line[i + 1] + line[i + 2] + line[i + 3] == "four":
                        firstDigit = 4
                        break
            if line[i] == 'f':
                if i + 3 < len(line):
                    if line[i] + line[i + 1] + line[i + 2] + line[i + 3] == "five":
                        firstDigit = 5
                        break
            if line[i] == 's':
                if i + 2 < len(line):
                    if line[i] + line[i + 1] + line[i + 2] == "six":
                        firstDigit = 6
                        break
            if line[i] == 's':
                if i + 4 < len(line):
                    if line[i] + line[i + 1] + line[i + 2] + line[i + 3] + line[i + 4] == "seven":
                        firstDigit = 7
                        break
            if line[i] == 'e':
                if i + 4 < len(line):
                    if line[i] + line[i + 1] + line[i + 2] + line[i + 3] + line[i + 4] == "eight":
                        firstDigit = 8
                        break
            if line[i] == 'n':
                if i + 3 < len(line):
                    if line[i] + line[i + 1] + line[i + 2] + line[i + 3] == "nine":
                        firstDigit = 9
                        break
                    

        line = line[::-1]
        for i in range(len(line)):
            if line[i].isdigit():
                lastDigit = line[i]
                break
            if line[i] == 'o':
                if i - 2 > 0:
                    if line[i] + line[i - 1] + line[i - 2] == "one":
                        lastDigit = 1
                        break
            if line[i] == 't':
                if i - 2 > 0:
                    if line[i] + line[i - 1] + line[i - 2] == "two":
                        lastDigit = 2
                        break
            if line[i] == 't':
                if i - 4 > 0:
                    if line[i] + line[i - 1] + line[i - 2] + line[i - 3] + line[i - 4] == "three":
                        lastDigit = 3
                        break
            if line[i] == 'f':
                if i - 3 > 0:
                    if line[i] + line[i - 1] + line[i - 2] + line[i - 3] == "four":
                        lastDigit = 4
                        break
            if line[i] == 'f':
                if i - 3 > 0:
                    if line[i] + line[i - 1] + line[i - 2] + line[i - 3] == "five":
                        lastDigit = 5
                        break
            if line[i] == 's':
                if i - 2 > 0:
                    if line[i] + line[i - 1] + line[i - 2] == "six":
                        lastDigit = 6
                        break
            if line[i] == 's':
                if i - 4 > 0:
                    if line[i] + line[i - 1] + line[i - 2] + line[i - 3] + line[i - 4] == "seven":
                        lastDigit = 7
                        break
            if line[i] == 'e':
                if i - 4 > 0:
                    if line[i] + line[i - 1] + line[i - 2] + line[i - 3] + line[i - 4] == "eight":
                        lastDigit = 8
                        break
            if line[i] == 'n':
                if i - 3 > 0:
                    if line[i] + line[i - 1] + line[i - 2] + line[i - 3] == "nine":
                        lastDigit = 9
                        break
        #then the total is increased by the first digit and the second digit combined to make one number
        total += (int(firstDigit)*10) + int(lastDigit)

#print the result
print(total)