import os
import json

# Function to get the subfiles from a folder
def list_subfiles(folder_path):
    try:
        return [file for file in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, file))]
    except FileNotFoundError:
        print(f"Folder not found: {folder_path}")
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
            
            # Get the list of subfiles in the folder
            subfiles = list_subfiles(folder_path)
            
            # Update the 'spells' field with the list of subfiles
            element['spells'] = subfiles

    # Write the updated JSON data back to the file
    with open(json_file, 'w') as file:
        json.dump(data, file, indent=4)

if __name__ == "__main__":
    json_file_path = 'championTest.json'  # Path to your JSON file
    update_json_with_spells(json_file_path)
    print(f"Updated JSON with spells successfully.")
