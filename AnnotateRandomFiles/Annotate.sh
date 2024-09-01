#!/bin/bash

# Function to print the diamond shape
print_diamond() {
size=$1

# Validate the input size
if [ $size -lt 1 ]; then
    echo "Invalid size. Enter a positive integer."
    return
fi  

# Outer loop to handle lines
for i in {1..$size}; do
    # Calculate the number of spaces to pad before the asterisks
    spaces=$(( (size - i) / 2 ))
    # Inner loop to print spaces
    for j in {1..$spaces}; do
        echo -n " "
    done
    # Print asterisks for the line
    echo -n "*"
    # Print more asterisks depending on the line 
    if [ $i -ne 1 ] && [ $i -ne $size ]; then
        echo -n "*"
        for k in {2..$((i-1))}; do
            echo -n " *"
        done
        echo -n "*"
    fi
    echo
done
}

# Take input size from the user
read -p "Enter the size of the diamond: " size

# Call the function to print the diamond
print_diamond $size