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

# Function to calculate the first equation
def calculate_equation(p):
    result = math.log((p * (p + 1)) / 2) / math.log(p)
    return result

# Function to calculate the second equation
def calculate_equation_2(p):
    result = math.log((p * p * p * (p + 1)) / 2) / math.log(p)
    return result

powers = [2, 3, 5, 7]
primeList = []
primeGrowthRateDimensions = []
primeGrowthRateDimensions_2 = []

for i in range(2, 100):  # Limit is set to 100, but you can change this to any value
    if is_prime(i):
        primeList.append(i)
        primeGrowthRateDimensions.append(calculate_equation(i))
        primeGrowthRateDimensions_2.append(calculate_equation_2(i))

plt.figure(figsize=(12, 12))

plt.subplot(221)
for power in powers:
    values = [power**i for i in range(1, 8)]
    plt.plot(values, [calculate_equation(i) for i in values], label=f'Powers of {power}')
plt.xlabel('Power of Prime')
plt.ylabel('Growth-Rate Dimension')
plt.legend()

plt.subplot(222)
plt.plot(primeList, primeGrowthRateDimensions, label='Prime Numbers')
plt.xlabel('Prime Number')
plt.ylabel('Growth-Rate Dimension')
plt.legend()

plt.subplot(223)
plt.plot(primeList, primeGrowthRateDimensions_2, label='Prime Numbers')
plt.xlabel('Prime Number')
plt.ylabel('Growth-Rate Dimension (Equation 2)')
plt.legend()

plt.subplot(224)
for power in powers:
    values = [power**i for i in range(1, 8)]
    plt.plot(values, [calculate_equation_2(i) for i in values], label=f'Powers of {power}')
plt.xlabel('Power of Prime')
plt.ylabel('Growth-Rate Dimension (Equation 2)')
plt.legend()

plt.tight_layout()
plt.show()