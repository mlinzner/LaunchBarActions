function runWithString(argument)
{
    // There are three different kind of searches in Tweetbot:
    // 1. Tweet with [searchString]
    // 2. Users with [searchString]
    // 3. Open User Profile for @[searchString]

    // It appears that option 2 can not be triggered via URL Scheme right now (Version 1.6)
    // Currently we are looking for a leading @-Sign, if yes we are trying to open the user profile directly (Option 3), otherwise we are triggering a content search (Option 1)

    url = "tweetbot:///search"

    if (argument != "") {
        if (argument.lastIndexOf('@', 0) === 0) {
            // Found a leading @-sign, let's try to open the user profile directly
            url = "tweetbot:///user_profile/" + encodeURIComponent(argument.substr(1,argument.length));
        } else {
            // Other input, trigger a content search
            url += "?query=" + encodeURIComponent(argument);
        }

        LaunchBar.openURL(url);

        // The url scheme doesn't activate Tweetbot under all circumstances, therefore we need to activate "manually"
        LaunchBar.executeAppleScript('tell application "Tweetbot" to activate');  
    }
}

function run()
{
    // no input received, do nothing
}