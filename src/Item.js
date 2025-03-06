import moment from "moment";
moment.suppressDeprecationWarnings = true;
import { Intro } from "./Intro";
import { genCalendarLink } from "./utils";

export function Item({ item }) {
  if (!item) return <Intro />;

  const startAt = item.meta.activity_online_start_time;
  const startTime = moment(startAt);
  const timeAgo = startTime.fromNow();

  const isBefore = moment().isBefore(startTime);
  const icon = isBefore ? `🔜 ` : `⏰`;

  let startAtStr = (
    <a href={item.meta.enroll_now.href} target="_blank">
      <h3>
        {icon} Enroll start {timeAgo}
      </h3>
    </a>
  );
  if (startAt === "" || isBefore) {
    startAtStr = (
      <a href={item.meta.enroll_now.href} target="_blank">
        <h3> {icon}Enroll now </h3>
      </a>
    );
  }

  const calendarLink = genCalendarLink({
    title: item.meta.name,
    details: "",
    dateStr: item.meta.activity_online_start_time,
    location: item.meta.location.label,
  });

  return (
    <div>
      <article>
        <section>
          {item.meta.date_range} at {item.meta.time_range_landing_page},
          openings: ({item.meta.openings})
        </section>
        <div className="grid">
          <a href={item.meta.detail_url} target="_blank">
            <h2>{item.meta.name}</h2>
          </a>
          <div className="container">{startAtStr}</div>
        </div>
        <div className="grid">
          <h3>
            <a
              href={`https://maps.google.com/?q=${item.meta.location.label},${item.meta.active_location.includes("kitchener") ? "Kitchener" : "waterloo"}, Ontario,canada`}
              target="_blank"
            >
              🏟️ {item.meta.active_location.split("active")[1][0].toUpperCase()}{" "}
              - {item.meta.location.label}
            </a>
          </h3>
          {moment().isBefore(startAt) && (
            <a href={calendarLink} target="_blank">
              📅 Create reminder
            </a>
          )}
        </div>
        <section dangerouslySetInnerHTML={{ __html: item.meta.desc }}></section>
        <div>Ages: {item.meta.ages}</div>
      </article>
      {process.env.NODE_ENV !== "production" && (
        <pre>{item && JSON.stringify(item, null, 4)}</pre>
      )}
    </div>
  );
}
