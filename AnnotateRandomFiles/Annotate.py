import requests
import json

# Replace 'your_api_key' with your actual API key
api_key = "1aa860c6e1a64bed98c2fa8f8797a014"

# Specify the base URL and the city you're interested in
base_url = f'http://api.openweathermap.org/data/2.5/forecast'
city = 'London'

# Construct the full URL with the API key and city
url = f'{base_url}?q={city}&appid={api_key}'

try:
    # Send a GET request to the API
    response = requests.get(url)

    # Check if the request was successful
    response.raise_for_status()

    # Parse the JSON response
    data = response.json()

    # Print the 3-hour forecasts for the next 5 days
    for forecast in data['list']:
        print(f"Date: {forecast['dt_txt']}")
        print(f"Temperature: {forecast['main']['temp']}°C")
        print(f"Humidity: {forecast['main']['humidity']}%")
        print(f"Weather: {forecast['weather'][0]['description']}")
        print("")

except requests.exceptions.HTTPError as http_err:
    print(f'HTTP error occurred: {http_err}')
except requests.exceptions.ConnectionError as conn_err:
    print(f'Connection error occurred: {conn_err}')
except requests.exceptions.Timeout as time_err:
    print(f'Timeout error occurred: {time_err}')
except requests.exceptions.RequestException as err:
    print(f'Something went wrong: {err}')
except json.JSONDecodeError as json_err:
    print(f'Failed to parse JSON: {json_err}')
except KeyError as key_err:
    print(f'Missing key in JSON: {key_err}')