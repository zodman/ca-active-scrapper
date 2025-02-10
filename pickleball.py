import json
from marshmallow import Schema
import timeago
from dateutil.parser import parse
import datetime


with open("output.json") as f:
    results = json.loads(f.read())

filtered = []
for i in results:
    r = Schema.from_dict(i)
    if "pickleball" in r.name.lower():
        filtered.append(r)

now = datetime.datetime.now()


def filter_by_date(x):
    if x.activity_online_start_time:
        return parse(x.activity_online_start_time)
    else:
        if "to" in x.date_range:
            return parse(x.date_range.split("to")[0])
        return parse(x.date_range)


filtered = sorted(
    filtered,
    key=filter_by_date,
    reverse=True,
)
for i in filtered:
    if i.activity_online_start_time:
        d = parse(i.activity_online_start_time)
        two_weeks_later = now + datetime.timedelta(days=14)
        # if d >= two_weeks_later:
        # continue
        f = timeago.format(d, now)
    else:
        f = "now"

    print(f"""{i.name}, open: {f}
            {i.date_range if "to" in i.date_range else i.date_range } {parse(i.date_range).strftime('%A') if "to" not in i.date_range else ''} {i.time_range}
            {i.location["label"]}
          {i.detail_url}
        
    """)
