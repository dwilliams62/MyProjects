function add_names() {
    # Read existing names from file
    names_file=~/names
    if [ -f "$names_file" ]; then
        readarray -t names < "$names_file"
    else
        names=()
    fi

    # Prompt for new names
    while true; do
        read -p "Enter name (or 'done'): " name
        if [[ -z "$name" ]] || [[ $name == "done" ]]; then
            break
        fi
        names+=("$name")
    done

    # Update names file
    printf -v joined_names '%s,' "${names[@]}"  # convert array to comma-separated string
    joined_names=${joined_names%,}  # remove trailing comma
    echo "$joined_names" > "$names_file"

    echo "Names updated in ~/"
}

add_names