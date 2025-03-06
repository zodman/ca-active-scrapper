import * as data from "../all_output.json";
import moment from "moment";
moment.suppressDeprecationWarnings = true;

const order = [
  "Breithaupt Centre",
  "Downtown Cmty Centre",
  "St Johns School",
  "Waterloo Memorial Rec Cplx",
  "WMRC",
  "Queensmount Arena",
  "Forest Heights Cmty Centre",
  "Kingsdale Cmty Centre",
  "RIM Park",
  "Country Hills Community Centre",
  "Doon Pioneer Park Cmty Centre",
  "Huron Cmty Centre",
];

const groupData = data.map((entry) => entry.location.label);
const uniqueList = [...new Set(groupData)];
uniqueList.forEach((e) => {
  if (!order.includes(e)) {
    order.push(e);
  }
});

export const groups = order.map((entry, idx) => ({
  title: entry,
  id: idx,
}));

const getDateRange = (firstDate, lastDate, day) => {
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
    if (day === undefined) {
      date = moment(date).add(1, "days");
    } else {
      date = moment(date).add(1, "weeks").day(day);
    }

    dates.push(date.format("YYYY-MM-DD"));
  } while (moment(date).isBefore(lastDate));
  return dates;
};

export const items = data
  .map((entry, idx) => {
    const group = groups.find((e) => e.title === entry.location.label);
    let time_range = entry.time_range.split(" - ");

    let bgColor = "is-available";

    if (entry.activity_online_start_time !== "") {
      let isAfter = moment().isAfter(moment(entry.activity_online_start_time));

      if (isAfter) {
        bgColor = "is-available";
      } else {
        bgColor = "is-pending";
      }
    }

    if (Number(entry.openings) === 0) {
      bgColor = "is-full";
    }

    const partData = {
      id: `${entry.id}${idx}`,
      group: group.id,
      title: entry.name,
      time_range,
      meta: {
        ...entry,
      },
      itemProps: {
        className: bgColor,
      },
    };

    if (entry.only_one_day) {
      return {
        ...partData,
        start_time: moment(`${entry.date_range_start} ${time_range[0]}`),
        end_time: moment(`${entry.date_range_start} ${time_range[1]}`),
      };
    }

    const entriesDate = getDateRange(
      entry.date_range_start,
      entry.date_range_end,
      entry.days_of_week,
    );

    const all = entriesDate.map((e, idx) => ({
      ...partData,
      id: `${partData.id}${idx}`,
      start_time: moment(`${e} ${partData.time_range[0]}`),
      end_time: moment(`${e} ${partData.time_range[1]}`),
    }));

    return all;
  })
  .flat()
  .filter(Boolean);

export const genCalendarLink = ({
  title,
  details,
  location,
  dateStr,
  zt = "America%2FToronto",
}) => {
  //"20250306T031300Z/20250306T031300Z",
  const format = (d) => {
    return d.utc().format();
  };
  let from = moment(dateStr);
  let to = moment(from).add(5, "minutes");
  let dates = `${format(from)}/${format(to)}`;
  dates = dates.split("-").join("");
  dates = dates.split(":").join("");
  title = `[REMINDER ENROLL] ${title}`.split(" ").join("%20");
  location = location.split(" ").join("%20");

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}&ctz=${zt}`;
};
