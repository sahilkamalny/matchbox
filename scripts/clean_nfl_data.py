import os
import pandas as pd

# Directory containing the CSV files
csv_dir = "../public/data/nfl"

# Loop through each CSV file in the directory
for filename in os.listdir(csv_dir):
    if filename.endswith(".csv"):
        # Read the CSV file
        filepath = os.path.join(csv_dir, filename)
        df = pd.read_csv(filepath)
        
        # Initialize a list to keep track of player names we have seen
        seen_players = set()
        
        # List to store rows to keep
        rows_to_keep = []
        
        # Process each row in the DataFrame
        for _, row in df.iterrows():
            player_name = row["Player"]
            
            # If this player name is not in seen_players, add the row to rows_to_keep
            if player_name not in seen_players:
                rows_to_keep.append(row)
                seen_players.add(player_name)
        
        # Create a new DataFrame with the filtered rows
        df_cleaned = pd.DataFrame(rows_to_keep)
        
        # Save the cleaned DataFrame back to the CSV
        df_cleaned.to_csv(filepath, index=False)
        
        print(f"Processed {filename}, removed consecutive duplicate player entries.")

print("Duplicate removal complete for all CSV files.")
