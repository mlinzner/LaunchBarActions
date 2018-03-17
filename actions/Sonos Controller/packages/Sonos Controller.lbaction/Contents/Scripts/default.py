#!/usr/bin/env python
#
# LaunchBar Action Script
#
import sys
import os
import json
sys.path.append('../lib')
import soco

def load_zone_info():
    # When CMD key was pressed, we do not read setting and let the user
    # select a new zone.
    if os.getenv('LB_OPTION_COMMAND_KEY') == '1':
        return None

    # If not, we attempt to read setting file to retrieve zone ip_address
    try:
        settings_file_path = os.path.join(os.getenv('LB_SUPPORT_PATH'), 'settings.json')
        settings = json.load(file(settings_file_path))
        sonos_zone = settings['zone_ip_address']
        return sonos_zone
    except:
        print >> sys.stderr, 'Error retrieving settings. Trigger setup.'

    return None

def list_item(title, icon, action=None, zone=None, subtitle= None):
    item = {}
    item['title'] = title
    item['icon'] = icon

    if action:
        item['action'] = 'action.py'
        item['action_argument'] = action

    if zone:
        item['action_zone'] = zone

    if subtitle:
        item['subtitle'] = subtitle
        item['alwaysShowsSubtitle'] = True

    return item


items = []
sonos_zone = load_zone_info()

if not sonos_zone:
    items.append(list_item(title="Please choose the zone to control:",
                           icon="font-awesome:question-circle"))

    for zone in soco.discover():
        if zone.is_visible:
            items.append(list_item(title=zone.player_name,
                                   subtitle=zone.ip_address,
                                   icon='font-awesome:volume-down',
                                   action='set_zone',
                                   zone=zone.ip_address))

else:
    items.append(list_item(title="Play / Pause",
                           icon='font-awesome:play-circle',
                           action='pp',
                           zone=sonos_zone))

    items.append(list_item(title="Next Track",
                           icon='font-awesome:forward',
                           action='next',
                           zone=sonos_zone))

    items.append(list_item(title="Previous Track",
                           icon='font-awesome:backward',
                           action='prev',
                           zone=sonos_zone))

    items.append(list_item(title="Increase Volume",
                           icon='font-awesome:volume-up',
                           action='v+5',
                           zone=sonos_zone))

    items.append(list_item(title="Decrease Volume",
                           icon='font-awesome:volume-down',
                           action='v-5',
                           zone=sonos_zone))

    items.append(list_item(title="Mute",
                           icon='font-awesome:volume-off',
                           action='mute',
                           zone=sonos_zone))

print json.dumps(items)
