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

"""
{"activity_search_pattern":{
"skills":[],"time_after_str":"","days_of_week":None,"activity_select_param":2,"center_ids":[],"time_before_str":"","open_spots":None,"activity_id":None,"activity_category_ids":[],"date_before":"","min_age":None,"date_after":"","activity_type_ids":[],"site_ids":[],"for_map":false,"geographic_area_ids":[],"season_ids":[],"activity_department_ids":[],"activity_other_category_ids":[],"child_season_ids":[],"activity_keyword":"","instructor_ids":[],"max_age":None,"custom_price_from":"","custom_price_to":""},"activity_transfer_pattern":{}}
"""
results = []
activity = sys.argv[1]

search_params = [
    {
        "activity_search_pattern": {
            "activity_select_param": 2,
            "activity_keyword": activity,
            "time_after_str": "16:00:00",
            "days_of_week": None,  # "1000001"
            "center_ids": [],
            "time_before_str": "",
            "open_spots": 1,
            "activity_id": None,
            "activity_category_ids": [],
            "date_before": "",
            "min_age": None,
            "date_after": "",
            "activity_type_ids": [],
            "site_ids": [],
            "for_map": False,
            "geographic_area_ids": [],
            "season_ids": [],
            "activity_department_ids": [],
            "activity_other_category_ids": [],
            "child_season_ids": [],
            "instructor_ids": [],
            "max_age": None,
            "custom_price_from": "",
            "custom_price_to": "",
        },
    },
    {
        "activity_search_pattern": {
            "activity_select_param": 2,
            "activity_keyword": activity,
            "time_after_str": "",
            "days_of_week": "1000001",
            "center_ids": [],
            "time_before_str": "",
            "open_spots": 1,
            "activity_id": None,
            "activity_category_ids": [],
            "date_before": "",
            "min_age": None,
            "date_after": "",
            "activity_type_ids": [],
            "site_ids": [],
            "for_map": False,
            "geographic_area_ids": [],
            "season_ids": [],
            "activity_department_ids": [],
            "activity_other_category_ids": [],
            "child_season_ids": [],
            "instructor_ids": [],
            "max_age": None,
            "custom_price_from": "",
            "custom_price_to": "",
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
                try:
                    avail = int(i["openings"])
                except ValueError:
                    avail = False

                results.append(i)
                if avail == 0:
                    continue

                if avail is not False or avail > 0:
                    openings = i["openings"]
                    total_open = i["total_open"]

                    loc = py_.get(i, "location.label")
                    # print(
                    #     f"{location}:  {i['name']} {i['id']} available {openings}/{total_open} "
                    #     f"dates: {i['date_range']} - {i['days_of_week']} time: {i['time_range']} ages:{i['ages']} location: {loc}"
                    # )
                    # results.append(i)

with open(os.path.join(BASE_DIR, "output.json"), "w") as f:
    json.dump(results, f)
