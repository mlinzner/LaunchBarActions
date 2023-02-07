#!/usr/bin/env python3
#
# LaunchBar Action Script to Search for 2FA Codes in iMessage
# Note: LaunchBar needs Full-Disk Access to run this action, else the database can not be opened
import sqlite3
import json
import re
import os


def first_code_match(text):
    # Only codes that are at the start of a message
    # Have a whitespace before the code
    # Have a hash infront (https://github.com/wicg/sms-one-time-codes)

    # Because of the limited GLOB syntax in the database query, we will
    # also receive things like messages with a shared phone number
    # that should be filtered out here.
    r = re.search("^\d{4,8}|(?<=[\s#])[0-9]{4,8}", text)
                #  ^ at the start of the message 4-8 character code
                #                 ^ code within the message text with whitespace or # in front
                #                   (Positive lookbehind to ensure we do not include
                #                    the whitespace or hash in the result)
    return r.group(0) if r else None

items = []
connection = sqlite3.connect(os.path.expanduser("~/Library/Messages/chat.db"))
cursor = connection.cursor()

# Queries for message content, sender name (or number as fallback) and message date
# * Only incoming messages (not sent by "me")
# * Received in the last 24 hours
# * Received as SMS (not iMessage, iChat, …)
# * Message content that matches one of the GLOBs
#   (unfortunately Regex doesn't seem to be supported by sqlite on macOS Ventura.)
# * The 5 most recent items
query = """
SELECT
    message.text,
    ifnull(handle.uncanonicalized_id, chat.chat_identifier) AS sender,
    datetime(message.date / 1000000000 + strftime ("%s", "2001-01-01"), "unixepoch", "localtime") AS message_date
FROM
    chat
    JOIN chat_message_join ON chat. "ROWID" = chat_message_join.chat_id
    JOIN message ON chat_message_join.message_id = message. "ROWID"
    JOIN handle ON message.handle_id = handle."ROWID"
WHERE message.text is not null
    AND message.is_from_me=0
    AND datetime(message.date / 1000000000 + strftime ("%s", "2001-01-01"), "unixepoch", "localtime") > datetime ("now", "-1 days", "localtime")
    AND message.service = "SMS"
    AND (message.text GLOB "*[0-9][0-9][0-9][0-9]*"
        OR message.text GLOB "*[0-9][0-9][0-9][0-9][0-9]*"
        OR message.text GLOB "*[0-9][0-9][0-9][0-9][0-9][0-9]*"
        OR message.text GLOB "*[0-9][0-9][0-9][0-9][0-9][0-9][0-9]*"
        OR message.text GLOB "*[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]*"
        )
ORDER BY
    message_date DESC
LIMIT 5
"""


for row in cursor.execute(query):
    code = first_code_match(row[0])
    if code:
        item = {}
        item['title'] = code
        item['subtitle'] = row[2]
        item['badge'] = row[1]
        item['icon'] = 'font-awesome:fa-mobile'
        items.append(item)

print (json.dumps(items))
