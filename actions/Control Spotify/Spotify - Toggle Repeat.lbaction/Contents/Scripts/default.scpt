tell application "Spotify"
	if repeating then		
		set repeating to false
		tell application "LaunchBar" to display in notification center "Repeating Disabled" with title "Spotify"
	else
		set repeating to true
		tell application "LaunchBar" to display in notification center "Repeating Enabled" with title "Spotify"
	end if
end tell