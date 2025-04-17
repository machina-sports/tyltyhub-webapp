import re
from bs4 import BeautifulSoup
from html import unescape

def extract_teams(html_content):
    """Extract team information from HTML content."""
    soup = BeautifulSoup(html_content, 'html.parser')
    teams = []
    
    # Find all table cells that contain team information
    cells = soup.find_all('td', style=lambda value: value and 'text-align:center' in value)
    
    for cell in cells:
        # Skip empty cells
        if not cell:
            continue
            
        # Extract image URL
        img_tag = cell.find('img')
        if not img_tag:
            continue
            
        image_url = img_tag.get('src', '').strip()
        
        # Extract team name and league
        strong_tag = cell.find('strong')
        if not strong_tag:
            continue
            
        text = strong_tag.get_text(strip=True)
        
        # Parse team name and league
        match = re.search(r'(.+?)\s*\((.+?)\)', text)
        if match:
            team_name = match.group(1).strip()
            league_name = match.group(2).strip()
            
            # Extract confederation from row header
            row = cell.parent
            if row:
                confederation_cell = row.find('th')
                confederation = confederation_cell.get_text(strip=True) if confederation_cell else "Unknown"
                
                teams.append({
                    'team': team_name,
                    'league': league_name,
                    'image_url': image_url,
                    'confederation': confederation
                })
    
    return teams

def save_to_file(teams, filename='teams_data.txt'):
    """Save extracted team information to a text file."""
    with open(filename, 'w', encoding='utf-8') as f:
        f.write("FIFA Club World Cup 2025 Teams\n")
        f.write("=" * 50 + "\n\n")
        
        # Group teams by confederation
        teams_by_confederation = {}
        for team in teams:
            conf = team['confederation']
            if conf not in teams_by_confederation:
                teams_by_confederation[conf] = []
            teams_by_confederation[conf].append(team)
        
        # Write teams by confederation
        for conf, conf_teams in teams_by_confederation.items():
            f.write(f"{conf}\n")
            f.write("-" * len(conf) + "\n")
            
            for team in conf_teams:
                f.write(f"Team: {team['team']}\n")
                f.write(f"League: {team['league']}\n")
                f.write(f"Image URL: {team['image_url']}\n")
                f.write("\n")
            
            f.write("\n")
            
    print(f"Data has been saved to {filename}")

def main():
    # Get HTML content from file or paste it directly
    html_input_method = input("Enter '1' to input HTML from a file or '2' to paste HTML: ")
    
    if html_input_method == '1':
        file_path = input("Enter the HTML file path: ")
        with open(file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
    else:
        print("Paste your HTML content here (press Ctrl+Z on Windows or Ctrl+D on Unix/Linux and then Enter when done):")
        html_content = ""
        while True:
            try:
                line = input()
                html_content += line + "\n"
            except EOFError:
                break
    
    # Extract teams from HTML
    teams = extract_teams(html_content)
    
    # Save to file
    output_file = input("Enter output filename (default: teams_data.txt): ") or "teams_data.txt"
    save_to_file(teams, output_file)
    
    # Display summary
    print(f"\nExtracted {len(teams)} teams from {len(set(team['confederation'] for team in teams))} confederations.")

if __name__ == "__main__":
    main() 