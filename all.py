import requests
import json
import jq
import pydash as py_
import sys
import os

BASE_DIR = os.path.dirname(os.path.realpath(__file__))


s = requests.Session()
waterloo = "activewaterloo"
kitchener = "activekitchener"


results = []
activity = sys.argv[1]

search_params = [
    {
        "activity_search_pattern": {
            "activity_select_param": 2,
            "activity_keyword": activity,
        },
    },
]

for json_data in search_params:
    for location in [kitchener, waterloo]:
        url = (
            f"https://anc.ca.apm.activecommunities.com/{location}/rest/activities/list"
        )
        page = 1
        while True:
            resp = s.post(
                url,
                json=json_data,
                headers={
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    "Page_info": json.dumps(
                        {
                            "order_by": "Date range",
                            "page_number": page,
                            "total_records_per_page": 90,
                        }
                    ),
                },
            )
            page += 1

            data = resp.json()

            items = jq.all(".body.activity_items[]", data)
            if not items:
                break
            for i in items:
                i.update({"active_location": location})
                results.append(i)


with open(os.path.join(BASE_DIR, "all_output.json"), "w") as f:
    json.dump(results, f)
