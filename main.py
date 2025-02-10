import requests
import json
import jq
import pydash as py_


waterloo = "activewaterloo"
kitchener = "activekitchener"

"""
{"activity_search_pattern":{"skills":[],"time_after_str":"","days_of_week":null,"activity_select_param":2,"center_ids":[],"time_before_str":"","open_spots":null,"activity_id":null,"activity_category_ids":[],"date_before":"","min_age":null,"date_after":"","activity_type_ids":[],"site_ids":[],"for_map":false,"geographic_area_ids":[],"season_ids":[],"activity_department_ids":[],"activity_other_category_ids":[],"child_season_ids":[],"activity_keyword":"","instructor_ids":[],"max_age":null,"custom_price_from":"","custom_price_to":""},"activity_transfer_pattern":{}}
"""
results = []

for location in [waterloo, kitchener]:
    url = f"https://anc.ca.apm.activecommunities.com/{location}/rest/activities/list"
    page = 1
    while True:
        resp = requests.post(
            url,
            json={
                "activity_search_pattern": {
                    "activity_keyword": "pickleball",
                    "time_after_str": "17:00:00",
                },
            },
            headers={
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                "Page_info": json.dumps(
                    {
                        "order_by": "Date range",
                        "page_number": page,
                        "total_records_per_page": 20,
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
                results.append(i)

with open("output.json", "w") as f:
    json.dump(results, f)
