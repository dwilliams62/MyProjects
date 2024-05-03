import math

def smallest_prime_factor(n):
    if n == 2:
        return 2
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            return i
    return n

def generate_rows(starting_row, num_rows, mod):
    rows = [[x % mod for x in starting_row]]
    zero_count = 0
    nonzero_count = 0
    for num in starting_row:
        if num % mod == 0:
            zero_count += 1
        else:
            nonzero_count += 1
    for _ in range(num_rows - 1):
        new_row = []
        for i in range(len(starting_row)):
            if i == 0:
                new_row.append(starting_row[i] % mod)
            else:
                new_row.append((starting_row[i] + starting_row[i-1]) % mod)
        new_row.append((starting_row[-1]) % mod)
        rows.append(new_row)
        starting_row = new_row
        for num in new_row:
            if num == 0:
                zero_count += 1
            else:
                nonzero_count += 1
    return rows, zero_count, nonzero_count

starting_row = [int(x) for x in input("Enter the starting row (separated by spaces): ").split()]
num_rows = int(input("Enter the number of rows: "))
mod = int(input("Enter the modulus: "))

rows, zero_count, nonzero_count = generate_rows(starting_row, num_rows, mod)

print(zero_count)
print(nonzero_count)
for row in rows:
    print(row)

a = smallest_prime_factor(mod)
print("top", nonzero_count / zero_count)
print("bottom", a)
result = math.log(nonzero_count / zero_count) / math.log(a)
print("Result:", result)