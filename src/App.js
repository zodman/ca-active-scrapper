import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import moment from "moment";
import * as data from "../output.json";
import { useState } from "react";

const groupData = data.map((entry) => entry.location.label);

const groups = [...new Set(groupData)].map((entry, idx) => ({
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

const items = data
  .map((entry, idx) => {
    const group = groups.find((e) => e.title === entry.location.label);
    time_range = entry.time_range.split(" - ");

    const bgColor =
      entry.activity_online_start_time === "" ? "gray" : undefined;

    const partData = {
      id: entry.id + idx,
      group: group ? group.id : 1,
      title: entry.name,
      bgColor,
      time_range,

      meta: {
        ...entry,
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
      id: partData.id + idx,
      start_time: moment(`${e} ${partData.time_range[0]}`),
      __start_time: `${e} ${partData.time_range[0]}`,
      end_time: moment(`${e} ${partData.time_range[1]}`),
      __end_time: `${e} ${partData.time_range[1]}`,
      a: 1,
    }));

    return all;
  })
  .flat()
  .filter(Boolean);

function Item({ item }) {
  if (!item) return null;

  return (
    <div>
      <a href={item.meta.detail_url} target="_blank">
        <h2>{item.title}</h2>
      </a>
      <p dangerouslySetInnerHTML={{ __html: item.meta.desc }}></p>
      <pre>{item && JSON.stringify(item, null, 4)}</pre>
    </div>
  );
}

export function App() {
  const [item, setItem] = useState();

  const onItemSelected = (itemId) => {
    const entry = items.find((e) => e.id === itemId);
    if (entry) {
      setItem(entry);
    }
  };

  return (
    <div>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment().add(-12, "hour")}
        defaultTimeEnd={moment().add(12, "hour")}
        canMove={false}
        canResize={false}
        onItemSelect={onItemSelected}
      ></Timeline>
      <div>
        <Item item={item} />
      </div>
    </div>
  );
}
