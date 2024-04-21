#initialize variables
total = 0

#open the txt file
with open('calibrationValues.txt', 'r') as i_file:
    #always loops, but if readline failes then the loop breaks
    while True:
        line = i_file.readline()
        if not line:
            break
        #get all digits in the line
        digits = [character for character in line if character.isdigit()]
        #then the total is increased by the first digit and the second digit combined to make one number
        total += (int(digits[0])*10) + int(digits[-1])

#print the result
print(total)