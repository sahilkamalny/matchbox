import requests
from bs4 import BeautifulSoup
import pandas as pd
import sys
import time  # Import time module for sleep functionality

def scrape_nfl_data(stat, year):
    # URL of the page to scrape
    url = f"https://www.pro-football-reference.com/years/{year}/{stat}.htm"

    # Fetch the page content
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code != 200:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")
        return
    
    soup = BeautifulSoup(response.content, 'html.parser')

    # Locate the table
    table = soup.find('table', {'id': stat})  # Ensure the 'id' is correct for the table
    if not table:
        print(f"Could not find table with id '{stat}'")
        return

    # Extract the headers dynamically
    thead = table.find('thead')
    if not thead:
        print("Table does not contain a <thead> element")
        return

    headers = [th.text.strip() for th in thead.find_all('th')]

    # Debug output to check headers count
    print(f"Extracted Headers: {headers}")
    print(f"Number of Headers: {len(headers)}")

    # Ignore the first few columns and keep only the relevant ones starting from 'Player'
    start_index = headers.index('Player')  # Find the 'Player' column to start from
    headers = headers[start_index:]  # Keep only the relevant headers

    # Remove 'Rk' column and any other irrelevant columns from the data
    if headers[0] == 'Rk':
        headers = headers[1:]

    # Extract rows dynamically based on column count
    rows = []
    for tr in table.find('tbody').find_all('tr'):
        cells = [td.text.strip() for td in tr.find_all('td')]
        if cells:
            rows.append(cells)

    # Debug output to check rows count
    print(f"Number of Rows: {len(rows)}")
    print(f"Number of Columns in First Row: {len(rows[0]) if rows else 'No rows'}")

    # Adjust the number of columns in data to match headers
    if len(headers) < len(rows[0]):
        rows = [row[:len(headers)] for row in rows]  # Truncate rows to match header length

    # Convert to DataFrame with the dynamic number of columns
    df = pd.DataFrame(rows, columns=headers)

    # Save to CSV or Use Directly
    df.to_csv(f"../public/data/nfl/nfl_{stat}_stats_{year}.csv", index=False)
    print(df.head())

# Entry point for command-line execution
if __name__ == "__main__":
    stats = ["passing", "rushing", "receiving", "defense", "kicking", "punting", "returns", "scoring"]
    
    # If no arguments are passed, scrape for all years and stats
    if len(sys.argv) == 1:
        for year in range(1980, 2025):
            for stat in stats:
                print(f"Scraping {stat} stats for year {year}...")
                scrape_nfl_data(stat, year)
                print("Waiting for 30 seconds before the next scrape...")
                time.sleep(10)  # Wait for 10 seconds between scrapes

    # If arguments are passed, use them to scrape a specific stat and year
    elif len(sys.argv) == 3:
        stat = sys.argv[1]
        year = sys.argv[2]
        scrape_nfl_data(stat, year)

    else:
        print("Usage: python scrape_nfl_data.py [stat] [year]")
        sys.exit(1)
