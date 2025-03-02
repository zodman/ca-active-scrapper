import moment from "moment";

function Intro() {
  return (
    <div>
      <article>
        <h2>Pickleball from active kitchener and active waterloo </h2>
        <div className="grid">
          <img src={"https://imgur.com/zqCFlmH.png"} />
          <img src={"https://imgur.com/hbOCu7A.png"} />
          <div>
            <a href="https://t.me/pickleballkw" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="100"
                fill="currentColor"
                class="bi bi-telegram"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
              </svg>
              <br />
              Receive notifications <br /> https://t.me/pickleballkw
            </a>
          </div>
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
