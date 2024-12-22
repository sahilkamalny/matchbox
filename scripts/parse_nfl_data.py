import os
import pandas as pd
import json
import re

# Directory containing the CSV files
csv_dir = "../public/data/nfl"

# Output JSON file
output_json = "../public/data/nfl/nfl_player_data.json"

# Initialize the JSON structure
player_data = {}

# Function to clean player names by removing non-letter characters
def clean_player_name(name):
    # Remove all non-letter characters except spaces between words
    return re.sub(r"[^a-zA-Z ]", "", name)

# Loop through each CSV file in the directory
for filename in os.listdir(csv_dir):
    if filename.endswith(".csv"):
        # Extract the year and stat type from the filename
        filename_parts = filename.split("_")
        stat_type = filename_parts[1]  # This extracts the stat type (e.g., 'passing', 'rushing')
        year = int(filename_parts[-1].split(".")[0])  # Extract the year from the filename
        
        # Read the CSV file
        filepath = os.path.join(csv_dir, filename)
        df = pd.read_csv(filepath)
        
        # Process each row in the DataFrame
        for index, row in df.iterrows():
            player_name = row["Player"]
            
            # Clean the player name to remove non-letter characters
            cleaned_name = clean_player_name(player_name)
            
            # Convert the row to a dictionary excluding "Player"
            stats = row.to_dict()
            del stats["Player"]
            
            # Replace NaN values with empty strings for all fields
            stats = {key: ("" if pd.isna(value) else value) for key, value in stats.items()}
            
            # Add the stat type and year to the stats dictionary
            stats["STAT"] = stat_type
            stats["YEAR"] = year
            
            # Add the "Rank" field based on the line number (index + 1)
            stats["Rank"] = index + 1  # Rank is the row index + 1
            
            # Initialize the player's data if not already present
            if cleaned_name not in player_data:
                player_data[cleaned_name] = []
            
            # Append the stats to the player's data
            player_data[cleaned_name].append(stats)

# Save the JSON structure to a file
with open(output_json, "w") as json_file:
    json.dump(player_data, json_file, indent=4)

print(f"Player data parsed successfully into {output_json}!")