import os
import json
import requests
from urllib.parse import urlparse
from pathlib import Path

# Create necessary directories
PUBLIC_DIR = Path("public")
TEAM_LOGOS_DIR = PUBLIC_DIR / "team-logos"
DATA_DIR = Path("data")

TEAM_LOGOS_DIR.mkdir(exist_ok=True, parents=True)
DATA_DIR.mkdir(exist_ok=True, parents=True)

# CSV-like data from the instructions
data = """Image URL,Team Name,League Name
https://images.daznservices.com/di/library/DAZN_News/ab/26/al-ain-logo_zou57pu5ubsf12f8e6vfzhdrg.png,Al Ain,UAE Pro League
https://images.daznservices.com/di/library/DAZN_News/1b/4f/al-hilal-logo_zprqere6m5bp1jybq01bjn1d1.png,Al Hilal,Saudi Pro League
https://images.daznservices.com/di/library/DAZN_News/da/62/ulsan-hd-logo_b7gqrwib7rtv17mftircuwdck.png,Ulsan HD,K League 1
https://images.daznservices.com/di/library/DAZN_News/65/a9/urawa-red-diamonds-logo_10kie30mpq9v41bp4sxdw1ung5.png,Urawa Red Diamonds,J1 League
https://images.daznservices.com/di/library/DAZN_News/e3/7/al-ahly-logo_9njfuw5097nh1df5yjd46ekg6.png,Al Ahly,Egyptian Premier League
https://images.daznservices.com/di/library/DAZN_News/9d/75/esperance-tunis-logo_m4ldd3g1s2nf1p4uxm303ip11.png,Espérance de Tunis,Tunisian Ligue Professionnelle 1
https://images.daznservices.com/di/library/DAZN_News/fb/dc/malmelodi-sundowns-logo_v4qd6zbme8o818s6p00c5dzye.png,Mamelodi Sundowns,Betway Premiership
https://images.daznservices.com/di/library/DAZN_News/d1/7d/wydad-casablanca-logo_f2atewhnaf5d10i826wyjnrk8.png,Wydad AC,Botola
https://images.daznservices.com/di/library/DAZN_News/4d/2a/inter-miami-logo_1u1yfsmwx8klf12ipbsr7ctrb1.png,Inter Miami,MLS
https://images.daznservices.com/di/library/DAZN_News/23/d/club-leon-logo_lgrzwp93ml9e1wcadm07lh9mf.png,Leon,Liga MX
https://images.daznservices.com/di/library/DAZN_News/ef/d5/cf-monterrey-logo_1i01y5d42u1jz1sx3s5m8jrrg9.png,Monterrey,Liga MX
https://images.daznservices.com/di/library/DAZN_News/79/fa/cf-pachuca-logo_kqpt5sma18iw1ohctg13z75ls.png,Pachuca,Liga MX
https://images.daznservices.com/di/library/DAZN_News/da/86/seattle-sounders-logo_121wwe57qqtqn1vayzqcutj0aq.png,Seattle Sounders,MLS
https://images.daznservices.com/di/library/DAZN_News/f7/c2/boca-juniors-logo_1xlx1yz5g3w2h1r64lusypx9pt.png,Boca Juniors,Primera División
https://images.daznservices.com/di/library/DAZN_News/26/31/botafogo-logo_7dj8qwe2yhxb16nbuv3we5th4.png,Botafogo,Campeonato Brasileiro Série A
https://images.daznservices.com/di/library/DAZN_News/69/ca/cr-flamengo-logo_1n5aotxttvqhq1tdesle0eeuqu.png,Flamengo,Campeonato Brasileiro Série A
https://images.daznservices.com/di/library/DAZN_News/80/57/fluminense-fc-logo_qprpdepq340p15idpdqe3ryxi.png,Fluminense,Campeonato Brasileiro Série A
https://images.daznservices.com/di/library/DAZN_News/90/20/palmeiras-logo_547omgmw972q1vow309427d3h.png,Palmeiras,Campeonato Brasileiro Série A
https://images.daznservices.com/di/library/DAZN_News/fc/ca/river-plate-logo_zl813gqtv0ih11dcbdsaabeqs.png,River Plate,Primera División
https://images.daznservices.com/di/library/DAZN_News/ce/7c/auckland-city-fc-logo_fu1tv283llcl18bonk3gl26gd.png,Auckland City,National League/Northern League
https://images.daznservices.com/di/library/DAZN_News/c8/d8/atletico-madrid-logo_p0hkcbmgtbbd1exbuv9c6igkd.png,Atletico Madrid,LaLiga
https://images.daznservices.com/di/library/DAZN_News/c9/df/fc-bayern-munchen-logo_xtqqnzqnzgh415a1jj0xaitsd.png,Bayern Munich,Bundesliga
https://images.daznservices.com/di/library/DAZN_News/ae/e0/sl-benfica-logo_1sbpqszc5xbvr118fqx8l5999e.png,Benfica,Primeira Liga
https://images.daznservices.com/di/library/DAZN_News/59/93/borussia-dortmund-bvb-logo_145z140ukgpmp1vn2kzuztbcqi.png,Borussia Dortmund,Bundesliga
https://images.daznservices.com/di/library/DAZN_News/e3/37/fc-chelsea-logo_eeek2adhc1151hmb4a14sipi2.png,Chelsea,Premier League
https://images.daznservices.com/di/library/DAZN_News/68/59/inter-mailand-logo_1tdea7udicn781rm7h1evyaqbc.png,Inter Milan,Serie A
https://images.daznservices.com/di/library/DAZN_News/a4/f7/juventus-logo_12qepu8iylkzu1trraqlydbyrk.png,Juventus,Serie A
https://images.daznservices.com/di/library/DAZN_News/be/48/manchester-city-logo_8uuu2nkizeko1q4u46v93ge8l.png,Manchester City,Premier League
https://images.daznservices.com/di/library/DAZN_News/a2/b0/psg-paris-sg-logo_9pjifam2alue1uavuzo3vrlhn.png,Paris Saint-Germain,Ligue 1
https://images.daznservices.com/di/library/DAZN_News/91/dc/fc-porto-logo_15wxn0cih4niv16aqb2m9y65hb.png,Porto,Primeira Liga
https://images.daznservices.com/di/library/DAZN_News/33/2e/real-madrid-logo_1adys15h12b5e10nsvgbc2eoy7.png,Real Madrid,LaLiga
https://images.daznservices.com/di/library/DAZN_News/b5/7/rb-salzburg-logo_txs3m2xwvhp1173xzqfgtswf4.png,Red Bull Salzburg,Bundesliga"""

# Parse the data
lines = data.strip().split('\n')
header = lines[0].split(',')
teams_data = []

for line in lines[1:]:
    image_url, team_name, league_name = line.split(',', 2)
    
    # Create a normalized filename from the team name
    normalized_name = team_name.lower().replace(' ', '-')
    
    # Get file extension from URL
    url_path = urlparse(image_url).path
    file_extension = os.path.splitext(url_path)[1]
    
    # Define the local filename
    filename = f"{normalized_name}{file_extension}"
    local_path = TEAM_LOGOS_DIR / filename
    
    # Download the image
    print(f"Downloading {team_name} logo...")
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        
        with open(local_path, 'wb') as f:
            f.write(response.content)
        
        # Store team data with relative path for frontend use
        teams_data.append({
            "id": normalized_name,
            "name": team_name,
            "league": league_name,
            "logo": f"/team-logos/{filename}"
        })
        
        print(f"  Saved to {local_path}")
    except Exception as e:
        print(f"  Error downloading {team_name} logo: {e}")

# Save the team mapping data
teams_map_path = DATA_DIR / "teams.json"
with open(teams_map_path, 'w', encoding='utf-8') as f:
    json.dump({"teams": teams_data}, f, ensure_ascii=False, indent=2)

print(f"\nDownloaded {len(teams_data)} team logos")
print(f"Team mapping data saved to {teams_map_path}") 