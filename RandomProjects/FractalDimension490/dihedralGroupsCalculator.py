import math
import time

def generate_rows_Zn(starting_row, num_rows, mod):
    start_time = time.time()
    rows = [[x % mod for x in starting_row]]
    total_nonzero_count = sum(1 for x in starting_row if x % mod != 0) + 1
    sub_triangle_nonzero_count = total_nonzero_count
    for num in starting_row:
        if num % mod != 0:
            total_nonzero_count += 1
            sub_triangle_nonzero_count += 1
    for i in range(num_rows - 1):
        new_row = []
        for j in range(len(starting_row)):
            if j == 0:
                new_row.append(starting_row[j] % mod)
            else:
                new_row.append((starting_row[j] + starting_row[j-1]) % mod)
        new_row.append((starting_row[-1]) % mod)
        rows.append(new_row)
        starting_row = new_row
        for num in new_row:
            if num != 0:
                total_nonzero_count += 1
                if i < num_rows // 2:
                    sub_triangle_nonzero_count += 1
        print(f"\rCalculating row: {i+2:{7}}/{num_rows}", end="")
    print()
    print(f"Time taken: {time.time() - start_time:.2f} seconds")
    print()
    return rows, total_nonzero_count, sub_triangle_nonzero_count


def generate_rows_Dn(starting_row, num_rows, n):
    start_time = time.time()
    rows = [starting_row]
    total_nonzero_count = 0
    sub_triangle_nonzero_count = 0
    for elem in starting_row:
        if elem != "r0":
            total_nonzero_count += 1
            sub_triangle_nonzero_count += 1
    for i in range(num_rows - 1):
        new_row = []
        for j in range(len(starting_row)):
            if j == 0:
                new_row.append(starting_row[j])
            else:
                left = starting_row[j-1]
                right = starting_row[j]
                if left[0] == 'r' and right[0] == 'r':
                    new_elem = 'r' + str((int(left[1:]) + int(right[1:])) % n)
                elif left[0] == 'r' and right[0] == 'f':
                    new_elem = 'f' + str((int(left[1:]) + int(right[1:])) % n)
                elif left[0] == 'f' and right[0] == 'r':
                    new_elem = 'f' + str((int(left[1:]) - int(right[1:])) % n)
                elif left[0] == 'f' and right[0] == 'f':
                    new_elem = 'r' + str((int(left[1:]) - int(right[1:])) % n)
                new_row.append(new_elem)
                if new_elem != "r0":
                    total_nonzero_count += 1
                    if i < num_rows // 2:
                        sub_triangle_nonzero_count += 1
        new_row.append(starting_row[-1])
        rows.append(new_row)
        starting_row = new_row
        # print(f"\rCalculating row: {i+2:{7}}/{num_rows}", end="")
        print(new_row)
    print()
    print(f"Time taken: {time.time() - start_time:.2f} seconds")
    print()
    return rows, total_nonzero_count, sub_triangle_nonzero_count

alphabet = input("Enter the alphabet (Zn or Dn): ")
if alphabet.upper() == "ZN":
    generate_rows = generate_rows_Zn
elif alphabet.upper() == "DN":
    generate_rows = generate_rows_Dn
else:
    print("Invalid alphabet. Please enter Zn or Dn.")
    exit()

if alphabet.upper() == "ZN":
    starting_row = [int(x) for x in input("Enter the starting row (separated by spaces): ").split()]
    num_rows = int(input("Enter the number of rows: "))
    mod = int(input("Enter the modulus: "))
else:
    n = int(input("Enter the number of sides of the polygon: "))
    starting_row = [x for x in input("Enter the starting row (separated by spaces), using 'r' for rotations and 'f' for reflections: ").split()]
    num_rows = int(input("Enter the number of rows: "))

rows, total_nonzero_count, sub_triangle_nonzero_count = generate_rows(starting_row, num_rows, n if alphabet.upper() == "DN" else mod)

print("Total Nonzero Count", total_nonzero_count)
print("Sub Triangle Nonzero Count", sub_triangle_nonzero_count)
print("Result", math.log(total_nonzero_count / sub_triangle_nonzero_count) / math.log(2))