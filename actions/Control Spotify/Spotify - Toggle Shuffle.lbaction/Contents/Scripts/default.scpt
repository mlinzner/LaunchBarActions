tell application "Spotify"
	if shuffling then		
		set shuffling to false
		tell application "LaunchBar" to display in notification center "Shuffling Disabled" with title "Spotify"
	else
		set shuffling to true
		tell application "LaunchBar" to display in notification center "Shuffling Enabled" with title "Spotify"
	end if
end tell