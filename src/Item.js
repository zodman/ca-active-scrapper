import moment from "moment";

function Intro() {
  return (
    <div>
      <article>
        <h2>Pickleball from active kitchener and active waterloo </h2>
        <div className="grid">
          <img src={"https://imgur.com/zqCFlmH.png"} />
          <img src={"https://imgur.com/hbOCu7A.png"} />
        </div>
        <div>
          <h5>Green: pending to open </h5>
          <h5>Blue: ready to enroll</h5>
          <h5>Gray: is full</h5>
        </div>
      </article>
    </div>
  );
}

export function Item({ item }) {
  if (!item) return <Intro />;

  const startAt = item.meta.activity_online_start_time;
  const timeAgo = moment(startAt).fromNow();

  let startAtStr = (
    <a href={item.meta.enroll_now.href} target="_blank">
      <h3> Enroll start {timeAgo}</h3>
    </a>
  );
  if (startAt === "") {
    startAtStr = (
      <a href={item.meta.enroll_now.href} target="_blank">
        <h3>Enroll now </h3>
      </a>
    );
  }

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
          <div>
            <h3>
              <a
                href={`https://maps.google.com/?q=${item.meta.location.label},${item.meta.active_location.includes("kitchener") ? "Kitchener" : "waterloo"}, Ontario,canada`}
                target="_blank"
              >
                {item.meta.active_location} - {item.meta.location.label}
              </a>
            </h3>
          </div>
        </div>
        <section dangerouslySetInnerHTML={{ __html: item.meta.desc }}></section>
        <div>Ages: {item.meta.ages}</div>
      </article>
      <pre>{item && JSON.stringify(item, null, 4)}</pre>
    </div>
  );
}
