import { ExternalLink } from "lucide-react";
import { ParlayBettingWidget } from "../parlay-betting-widget";

interface ObjectCardsProps {
  objects: any[];
}

export function ObjectCards({ objects }: ObjectCardsProps) {
  if (!objects || !Array.isArray(objects) || objects.length === 0) return null;

  // Check if there's a parlay bet in the objects array
  const parlayObject = objects.find(obj => obj.runners && obj.total_odd && obj.leg_count);
  if (parlayObject) {
    return <ParlayBettingWidget parlay={parlayObject} />;
  }

  // Helper to format date/time nicely
  const formatDateTime = (obj: any) => {
    // Try different possible date fields
    const dateStr = obj.startDate || obj["sport:startDate"] || obj.date || obj["schema:startDate"];

    if (!dateStr) return null;

    try {
      const date = new Date(dateStr);
      // Format: "Oct 5, 2025 at 3:00 PM"
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' at ' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Helper to extract competition and venue
  const getCompetitionAndVenue = (obj: any) => {
    const competition = obj.competition || obj["sport:competition"]?.name || obj["schema:eventSchedule"]?.name;

    // Try multiple venue field variations
    let venue = '';
    if (obj["sport:venue"]) {
      const venueName = obj["sport:venue"].name || '';
      const venueCity = obj["sport:venue"]["schema:addressLocality"] || '';
      venue = venueName ? `${venueName}${venueCity ? ', ' + venueCity : ''}` : '';
    } else {
      venue = obj.venue || obj["sport:location"]?.name || obj.location?.name || '';
    }

    return { competition, venue };
  };

  // Helper to extract team names
  const getTeamNames = (obj: any) => {
    if (obj["sport:competitors"]) {
      const homeTeam = obj["sport:competitors"].find((c: any) => c["sport:qualifier"] === "home");
      const awayTeam = obj["sport:competitors"].find((c: any) => c["sport:qualifier"] === "away");
      return {
        home: homeTeam?.name || "",
        away: awayTeam?.name || ""
      };
    }
    return null;
  };

  return (
    <div className="mt-3 space-y-2">
      {objects.map((obj, idx) => {
        const name = obj.name || obj["@id"] || `Object ${idx + 1}`;
        const dateTime = formatDateTime(obj);
        const { competition, venue } = getCompetitionAndVenue(obj);

        // Get status and scores
        const status = obj["sport:status"] || obj.status || 'not_started';
        const showScore = ["live", "ended", "finished", "closed", "completed", "in_progress", "interrupted"].includes(status?.toLowerCase());
        const homeScore = obj["sport:score"]?.["sport:homeScore"] || 0;
        const awayScore = obj["sport:score"]?.["sport:awayScore"] || 0;

        // Get team names
        const teams = getTeamNames(obj);

        // Only create clickable link if id exists
        if (!obj.id) {
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 border rounded-lg opacity-50"
            >
              <div className="flex-1">
                {/* Competition • Venue */}
                {(competition || venue) && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {competition && <span>{competition}</span>}
                    {competition && venue && <span className="mx-1">•</span>}
                    {venue && <span>{venue}</span>}
                  </p>
                )}
                {/* Event name or Team scores */}
                {showScore && teams ? (
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{homeScore} {teams.home}</p>
                    <p className="font-medium text-sm">{awayScore} {teams.away}</p>
                  </div>
                ) : (
                  <p className="font-medium text-sm">{name}</p>
                )}
                {/* Date/Time */}
                {dateTime && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {dateTime}
                  </p>
                )}
              </div>
            </div>
          );
        }

        return (
          <div
            key={idx}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors group"
          >
            <div className="flex-1">
              {/* Competition • Venue */}
              {(competition || venue) && (
                <p className="text-xs text-muted-foreground mb-1">
                  {competition && <span>{competition}</span>}
                  {competition && venue && <span className="mx-1">•</span>}
                  {venue && <span>{venue}</span>}
                </p>
              )}
              {/* Event name or Team scores */}
              {showScore && teams ? (
                <div className="space-y-1">
                  <p className="font-medium text-sm">{homeScore} {teams.home}</p>
                  <p className="font-medium text-sm">{awayScore} {teams.away}</p>
                </div>
              ) : (
                <p className="font-medium text-sm">{name}</p>
              )}
              {/* Date/Time */}
              {dateTime && (
                <p className="text-xs text-muted-foreground mt-1">
                  {dateTime}
                </p>
              )}
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground ml-2 flex-shrink-0" />
          </div>
        );
      })}
    </div>
  );
}

