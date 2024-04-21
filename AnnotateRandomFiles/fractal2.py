import math
import matplotlib.pyplot as plt

# Function to check if a number is prime
def is_prime(n):
    if n <= 1:
        return False
    elif n <= 3:
        return True
    elif n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

# Function to calculate the equation
def calculate_equation(p):
    result = math.log((p * (p + 1)) / 2) / math.log(p)
    return result

twoList = []
threeList = []
fiveList = []
sevenList = []

# Iterate through prime numbers less than 20
for i in (2,4,8,16,32,64,128):
    twoList.append(calculate_equation(i))

# Iterate through prime numbers less than 20
for i in (3,9,27,81,243):
    threeList.append(calculate_equation(i))

# Iterate through prime numbers less than 20
for i in (5,25, 125):
    fiveList.apppend(calculate_equation(i))

# Iterate through prime numbers less than 20
for i in (7, 49, 343):
    sevenList.append(calculate_equation(i))

plt.plot([2, 4, 8, 16, 32, 64, 128], twoList, label='Powers of 2')
plt.plot([3, 9, 27, 81, 243], threeList, label='Powers of 3')
plt.plot([5, 25, 125], fiveList, label='Powers of 5')
plt.plot([7, 49, 343], sevenList, label='Powers of 7')

# Setting x and y limits
plt.xlim(0, 100)
plt.ylim(1.5, 2)

# Adding labels and legend
plt.xlabel('Power of Prime')
plt.ylabel('Growth-Rate Dimension')
plt.legend()

# Displaying the plot
plt.show()
