import os
import json
import requests  # To make API calls
import unidecode

# Function to get the mp3 files and construct the filename and id for each file
def get_mp3_file_details(folder_path):
    try:
        # List all mp3 files in the folder
        mp3_files = [file for file in os.listdir(folder_path) if file.endswith('.mp3')]
        
        # Create a list of dictionaries with 'filename' (with extension) and 'id' (without extension)
        return [{"id": os.path.splitext(file)[0], "filename": file, "icon": "http://ddragon.leagueoflegends.com/cdn/14.17.1/img/spell/"+os.path.splitext(file)[0]+".png"} for file in mp3_files]
    
    except FileNotFoundError as e:
        #print(f"Folder not found: {folder_path} : {e}")
        return []

def remove_spaces_and_quotes(string):
    result = []
    i = 0

    while i < len(string):
        if string[i] == "'":
            i += 1  # Skip the quote and move to the next character
            if i < len(string):
                result.append(string[i].lower())  # Lowercase the next character
        elif string[i] not in [' ', '.']:  # Skip spaces and dots
            result.append(string[i])  # Add non-space characters
        i += 1

    return ''.join(result)

# Custom sorting function based on the id suffix
def sort_spells(spell):
    # Define the custom order
    priority_order = {"Passiv": 0, "Q": 1, "W": 2, "E": 3, "R": 4}
    
    # Check if the id ends with any of the defined suffixes
    for suffix, priority in priority_order.items():
        if spell['id'].endswith(suffix):
            return priority
    return len(priority_order)  # If no suffix matches, place it at the end

# Function to fetch spell names from an external API
def fetch_spell_names_from_api(folder_name):
    # Construct the API URL based on the folder name
    champion_name_cleaned = remove_spaces_and_quotes(unidecode.unidecode(folder_name))
    api_url = f"https://ddragon.leagueoflegends.com/cdn/14.18.1/data/en_US/champion/{champion_name_cleaned}.json"
    
    # Make the API call
    try:
        response = requests.get(api_url)
        response.raise_for_status()  # Check for HTTP errors
        # Return the 'spells' array from the API response
        return response.json().get('data').get(f'{champion_name_cleaned}')
    except requests.exceptions.RequestException as e:
        print(f"Error fetching API data for folder '{champion_name_cleaned}': {e}")
        return []

# Main function to update JSON
def update_json_with_spells(json_file):
    base_path = './public/audio/'  # Base path to the folders

    # Read JSON data
    with open(json_file, 'r') as file:
        data = json.load(file)

    # Process each element in the list
    for element in data:
        # Get the folder name from the 'name' field
        folder_name = element.get('name')
        if folder_name:
            # Construct the full folder path
            folder_path = os.path.join(base_path, folder_name)
            
            # Get the list of mp3 files with 'path' and 'id'
            mp3_file_details = get_mp3_file_details(folder_path)        
            
            # Sort the spells based on the custom order
            mp3_file_details_sorted = sorted(mp3_file_details, key=sort_spells)
            
            # Fetch spell names from the external API
            champion_fetched = fetch_spell_names_from_api(folder_name)

            # Map API spell names to local spells based on id suffix
            if champion_fetched:
                for api_index, suffix in enumerate(["Q", "W", "E", "R"]):
                    api_spells = champion_fetched.get('spells')
                    if api_index < len(api_spells):
                        for spell in mp3_file_details_sorted:
                            if spell["id"].endswith(suffix):
                                # Add the 'name' from the API to the corresponding local spell
                                spell["nameEn"] = api_spells[api_index].get("name")
                
                for spell in mp3_file_details_sorted:
                    if spell["id"].endswith('Passiv'):
                        spell["nameEn"] = champion_fetched.get('passive', []).get("name")
            
            # Update the 'spells' field with the list of file details
            element['spells'] = mp3_file_details_sorted

    # Write the updated JSON data back to the file
    with open(json_file, 'w') as file:
        json.dump(data, file, indent=4)

if __name__ == "__main__":
    json_file_path = 'src/assets/champions.json'  # Path to your JSON file
    update_json_with_spells(json_file_path)
    print(f"Updated JSON with spells successfully.")
