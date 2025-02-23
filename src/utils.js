import * as data from "../all_output.json";
import moment from "moment";

const groupData = data.map((entry) => entry.location.label);

export const groups = [...new Set(groupData)].map((entry, idx) => ({
  title: entry,
  id: idx,
}));

const getDateRange = (firstDate, lastDate) => {
  if (
    moment(firstDate, "YYYY-MM-DD").isSame(
      moment(lastDate, "YYYY-MM-DD"),
      "day",
    )
  )
    return [lastDate];
  let date = firstDate;
  const dates = [date];
  do {
    date = moment(date).add(1, "day");
    dates.push(date.format("YYYY-MM-DD"));
  } while (moment(date).isBefore(lastDate));
  return dates;
};

export const items = data
  .map((entry, idx) => {
    const group = groups.find((e) => e.title === entry.location.label);
    let time_range = entry.time_range.split(" - ");

    let bgColor = entry.activity_online_start_time === "" ? "blue" : "green";

    if (Number(entry.openings) === 0) {
      bgColor = "gray";
    }

    const partData = {
      id: `${entry.id}${idx}`,
      group: group ? group.id : 1,
      title: entry.name,
      time_range,
      meta: {
        ...entry,
      },
      itemProps: {
        style: {
          backgroundColor: bgColor,
        },
      },
    };

    if (entry.date_range_end === "") {
      return {
        ...partData,
        start_time: moment(`${entry.date_range_start} ${time_range[0]}`),
        end_time: moment(`${entry.date_range_start} ${time_range[1]}`),
      };
    }

    const entriesDate = getDateRange(
      entry.date_range_start,
      entry.date_range_end,
    );

    const all = entriesDate.map((e, idx) => ({
      ...partData,
      id: `${partData.id}${idx}`,
      start_time: moment(`${e} ${partData.time_range[0]}`),
      __start_time: `${e} ${partData.time_range[0]}`,
      end_time: moment(`${e} ${partData.time_range[1]}`),
      __end_time: `${e} ${partData.time_range[1]}`,
    }));

    return all;
  })
  .flat()
  .filter(Boolean);
