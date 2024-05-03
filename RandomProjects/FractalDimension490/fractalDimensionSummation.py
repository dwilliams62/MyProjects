import math

def is_prime(n):
    if n <= 2:
        return False
    elif n == 3:
        return True
    elif n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

primeData = []
fractalData = []

for prime in range(3, 101):
    if (is_prime(prime)):
        total = sum(range(prime + 1)) # Summation of numbers up to prime
        result = math.log(total) / math.log(prime)
        primeData.append(prime)
        fractalData.append(result)

i=0
while i < len(primeData):
    print(primeData[i], "|", fractalData[i])
    i = i+1