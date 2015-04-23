function run() {
	var scriptOutput = [];
    
    var title    = LaunchBar.executeAppleScript('tell application "Spotify" to return name of current track');
    var artist   = LaunchBar.executeAppleScript('tell application "Spotify" to return artist of current track');
    var trackURL = LaunchBar.executeAppleScript('tell application "Spotify" to return spotify url of current track');
    trackURL = trackURL.replace('spotify:track:','http://open.spotify.com/track/').trim();
    
    var shareText = '#NowPlaying ' + title.trim() + ' by ' + artist.trim() + ' on #Spotify\n' + trackURL;
    
	scriptOutput.push({
		title: 'Twitter',
		icon: 'at.obdev.LaunchBar:SharingServices_com.apple.share.Twitter.post',
		url: 'x-launchbar:perform-action?name=Post%20on%20Twitter&string=' + encodeURIComponent(shareText)
	},
    {
    	title: 'Facebook',
    	icon: 'at.obdev.LaunchBar:SharingServices_com.apple.share.Facebook.post',
    	url: 'x-launchbar:perform-action?name=Post%20on%20Facebook&string=' + encodeURIComponent(shareText)
    });
    
    return scriptOutput;
}