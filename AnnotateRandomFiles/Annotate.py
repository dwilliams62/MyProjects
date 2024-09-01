import cbpro

# Constants for authentication; replace with your actual keys
API_KEY = 'YOUR_API_KEY'
API_SECRET = 'YOUR_API_SECRET'
API_PASSPHRASE = 'YOUR_API_PASSPHRASE'

# Initialize authenticated client
auth_client = cbpro.AuthenticatedClient(API_KEY, API_SECRET, API_PASSPHRASE)

def get_crypto_holdings(auth_client):
    """Retrieve crypto holdings, filtering out non-USD accounts."""
    accounts = auth_client.get_accounts()
    return {
        account['currency']: float(account['balance'])
        for account in accounts
        if account['currency'] != 'USD' and float(account['balance']) > 0
    }

def get_exchange_rates(auth_client, crypto_holdings):
    """Retrieve current exchange rates for the given crypto holdings."""
    exchange_rates = {}
    for currency in crypto_holdings.keys():
        try:
            ticker_info = auth_client.get_product_ticker(product_id=f'{currency}-USD')
            exchange_rates[currency] = float(ticker_info['price'])
        except Exception as e:
            print(f"Error retrieving ticker for {currency}: {e}")
            exchange_rates[currency] = None
    return exchange_rates

def calculate_net_usd_value(crypto_holdings, exchange_rates):
    """Calculate the net USD value of crypto holdings."""
    return sum(
        amount * exchange_rates[currency]
        for currency, amount in crypto_holdings.items() if currency in exchange_rates and exchange_rates[currency] is not None
    )

def main():
    crypto_holdings = get_crypto_holdings(auth_client)
    exchange_rates = get_exchange_rates(auth_client, crypto_holdings)
    net_usd_value = calculate_net_usd_value(crypto_holdings, exchange_rates)
    print("Net USD value of crypto holdings:", net_usd_value)

if __name__ == "__main__":
    main()