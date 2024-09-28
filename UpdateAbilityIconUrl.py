import json
import requests

# Function to check if a URL returns a 200 status code
def check_url_status(url):
    try:
        response = requests.head(url)
        if response.status_code == 200:
            return True
        else:
            return False
    except requests.exceptions.RequestException as e:
        print(f"Error checking URL: {url} - {e}")
        return False

# Function to try replacing the URL with alternative ones until one works (status 200)
def try_replace_url(spell, url, ability):
    original_url = url
    alternatives = [
        original_url.replace(ability, spell['nameEn'].replace(" ", "")),
        original_url.replace(ability, ability[:-1]+'_'+ability[-1]),
        original_url.replace('Passiv', '_P'),
        original_url.replace('Passiv', 'P'),
        original_url.replace('Passiv', '_Passiv'),
        original_url.replace('Passiv', '_Passive'),
        original_url.replace('Passiv', '_passive'),
    ]
    
    for alt_url in alternatives:
        print(f"Trying alternative URL: {alt_url}")
        if check_url_status(alt_url):
            spell['icon'] = alt_url
            print(f"Replaced with valid alternative URL: {alt_url}")
            return True
    
    # If no alternatives work, set it to "URL_NOT_FOUND"
    #spell['icon'] = "URL_NOT_FOUND"
    print(f"All alternatives failed, setting URL to 'URL_NOT_FOUND'")
    return False

# Function to parse JSON and check/replace spell icon URLs
def parse_and_check_spells(json_data):
    for champion in json_data:
        if 'spells' in champion:
            spells = champion['spells']
            for spell in spells:
                ability = spell['id']
                if ability.endswith('Passiv'):
                    spell['icon'] = spell['icon'].replace('/img/spell/', '/img/passive/')
                if 'icon' in spell:
                    url = spell['icon']
                    print(f"Checking URL: {url}")
                    if not check_url_status(url):
                        print(f"URL is invalid (non-200): {url}")
                        # Try replacing the URL with alternatives
                        try_replace_url(spell, url, ability)
                    else:
                        print(f"URL is valid (200): {url}")
        else:
            print("No 'spells' found in the JSON data.")

# Example of loading JSON data from a file (you can replace this part with your actual file)
def load_json_from_file(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

# Function to save the modified JSON back to a file
def save_json_to_file(json_data, file_path):
    with open(file_path, 'w') as file:
        json.dump(json_data, file, indent=4)

# Main function
if __name__ == "__main__":
    # Load your JSON data here (replace 'your_json_file.json' with your actual file)
    json_file_path = 'src/assets/champions.json'
    json_data = load_json_from_file(json_file_path)
    
    # Parse the JSON and check/replace the URLs
    parse_and_check_spells(json_data)
    
    # Save the updated JSON data
    save_json_to_file(json_data, json_file_path)
    #print(f"Updated JSON saved to 'updated_json_file.json'")
