const ShowCard = ({ show }) => {
  return (
    <div className="mb-8 pb-6">
      {/* Show Title */}
      <h3 className="text-xl font-normal mb-3">
        <a href={show.titleLink || "#"} className="text-blue-500 underline">
          {show.title}
        </a>
        <span className="ml-2 font-bold">
          ({show.network} {show.year})
        </span>
      </h3>

      {/* Platforms */}
      <div className="mb-3">
        <span className="font-semibold">Platforms: </span>
        <span>{show.platforms}</span>
      </div>

      {/* Description */}
      <div className="mb-3">
        <span className="font-semibold">Description. </span>
        <span>{show.description}</span>
      </div>

      {/* The Evidence */}
      <div>
        <span className="font-semibold">The evidence. </span>
        <span>
          {show.evidence.map((item, index) => (
            <span key={index}>
              {item.text}
              {item.link && (
                <a
                  href={item.link.url}
                  className="text-blue-500 underline  mx-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.link.text}
                </a>
              )}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
};

export default function ShowsListing() {
  const showsData = [
    {
      title: "Watson",
      network: "CBS",
      year: "2025",
      titleLink: "#",
      platforms: "CBS",
      description:
        "Medical drama starring Morris Chestnut as Dr. John Watson, a modern take on the character solving medical mysteries post-Sherlock Holmes.",
      evidence: [
        {
          text: "CBS gave a straight-to-series order for the 2024–2025 season (",
        },
        {
          text: "",
          link: { text: "Deadline", url: "#" },
        },
        {
          text: '), Craig Sweeny ("Elementary," "Limitless") serves as showrunner and EP (',
        },
        {
          text: "",
          link: { text: "Deadline", url: "#" },
        },
        {
          text: "); premiere episode drew 18.7 million multiplatform viewers (Live+35) (",
        },
        {
          text: "",
          link: { text: "Paramount Press Express", url: "#" },
        },
        {
          text: "), most-streamed CBS Original scripted premiere on Paramount+ with 7 million views (",
        },
        {
          text: "",
          link: { text: "Paramount Press Express", url: "#" },
        },
        {
          text: "); renewed for Season 2 within weeks of launch (",
        },
        {
          text: "",
          link: { text: "Variety", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "The Neighborhood",
      network: "CBS",
      year: "2018– ",
      titleLink: "#",
      platforms: "CBS",
      description:
        "A friendly Midwestern family moves into a tough L.A. neighborhood and butts heads with their wary next-door neighbor (Cedric the Entertainer).",
      evidence: [
        {
          text: "Premiered on October 1, 2018 (",
        },
        {
          text: "",
          link: { text: "IMDb", url: "#" },
        },
        {
          text: "), produced by Kapital Entertainment (",
        },
        {
          text: "",
          link: { text: "CBS Fandom", url: "#" },
        },
        {
          text: "); consistently ranks among CBS's top-10 sitcoms by live ratings (",
        },
        {
          text: "",
          link: { text: "Paramount Press Express", url: "#" },
        },
        {
          text: "); renewed for multiple seasons, with Season 7 premiering in October 2024 (",
        },
        {
          text: "",
          link: { text: "Wikipedia", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "The Chi",
      network: "Showtime",
      year: "2018– ",
      titleLink: "#",
      platforms: "Showtime",
      description:
        "An interconnected ensemble drama set on Chicago's South Side, created and executive-produced by Lena Waithe.",
      evidence: [
        {
          text: "Premiered on January 7, 2018 (",
        },
        {
          text: "",
          link: { text: "Wikipedia", url: "#" },
        },
        {
          text: "), renewed for a seventh season, which premiered on May 18, 2025 (",
        },
        {
          text: "",
          link: { text: "Forbes", url: "#" },
        },
        {
          text: "); Season Seven's premiere drew two million cross-platform viewers, shattering the show's streaming record, renewed for an eighth season in May 2025 (",
        },
        {
          text: "",
          link: { text: "Wikipedia", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "Crutch",
      network: "Paramount+",
      year: "2025– ",
      titleLink: "#",
      platforms: "Paramount+",
      description:
        "A workplace dramedy following a misfit team of tech troubleshooters who salvage corporate crises by day and their own chaotic lives by night.",
      evidence: [
        {
          text: "Received a straight-to-series greenlight from CBS and Paramount+ in early 2025 (",
        },
        {
          text: "",
          link: { text: "Deadline", url: "#" },
        },
        {
          text: "), listed among CBS's 2025 fall development slate (",
        },
        {
          text: "",
          link: { text: "Paramount Press Express", url: "#" },
        },
        {
          text: '); Tracy Morgan stars as Francois "Frank" Crutchfield (',
        },
        {
          text: "",
          link: { text: "Economic Times", url: "#" },
        },
        {
          text: "); produced by Kapital Entertainment and CBS Studios (",
        },
        {
          text: "",
          link: { text: "Kapital Entertainment", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "DMV",
      network: "CBS",
      year: "2025– ",
      titleLink: "#",
      platforms: "CBS",
      description:
        "A single-camera comedy set inside a busy DMV office, featuring the eccentric staff and hapless visitors who pass through its doors.",
      evidence: [
        { text: "Pilot ordered by CBS for the 2025 season (" },
        { text: "", link: { text: "Deadline", url: "https://deadline.com" } },
        {
          text: "); featured on CBS’s upcoming comedy slate in January 2025 (",
        },
        {
          text: "",
          link: {
            text: "Paramount Press Express",
            url: "https://www.paramountpressexpress.com",
          },
        },
        {
          text: "); cast includes Harriet Dyer, Tim Meadows, Molly Kearney, Alex Tarrant, Tony Cavalero, and Gigi Zumbado (",
        },
        {
          text: "",
          link: { text: "TV Insider", url: "https://www.tvinsider.com" },
        },
        {
          text: "); based on a short story by award-winning author Katherine Heiny (",
        },
        {
          text: "",
          link: { text: "Wikipedia", url: "https://en.wikipedia.org" },
        },
        { text: ")." },
      ],
    },
    {
      title: "Delhi Crime",
      network: "Netflix",
      year: "2019– ",
      titleLink: "#",
      platforms: "Netflix",
      description:
        "A crime drama based on India’s 2012 Delhi gang-rape case, following the officers who brought the perpetrators to justice.",
      evidence: [
        { text: "Premiered on March 22, 2019 (" },
        { text: "", link: { text: "IMDb", url: "https://www.imdb.com" } },
        {
          text: "); won the International Emmy for Best Drama Series in 2020 (",
        },
        {
          text: "",
          link: { text: "Wikipedia", url: "https://en.wikipedia.org" },
        },
        {
          text: "); Netflix reported strong global viewership in its first month (",
        },
        {
          text: "",
          link: {
            text: "Netflix Media Center",
            url: "https://media.netflix.com",
          },
        },
        { text: "); praised by The Guardian as “gripping and unflinching” (" },
        {
          text: "",
          link: { text: "The Guardian", url: "https://www.theguardian.com" },
        },
        { text: "); renewed for a third season slated to release in 2025 (" },
        {
          text: "",
          link: { text: "Wikipedia", url: "https://en.wikipedia.org" },
        },
        { text: ")." },
      ],
    },
    {
      title: "RKFC",
      network: "Kapital Entertainment",
      year: "2025– ",
      titleLink: "#",
      platforms: "Kapital Entertainment",
      description:
        "A half-hour comedic ensemble set in a quirky fast-food chicken chain kitchen, where misadventures and recipe hacks collide.",
      evidence: [
        { text: "Announced as part of Kapital’s 2025 development slate (" },
        {
          text: "",
          link: {
            text: "Kapital Entertainment",
            url: "https://kapitalentertainment.com",
          },
        },
        {
          text: "); slated to shoot pilot in mid-2025 (internal press release).",
        },
      ],
    },
    {
      title: "Civil Justice with Sean Collinson",
      network: "The CW/Roku",
      year: "2024– ",
      titleLink: "#",
      platforms: "The CW, The Roku Channel, Apple TV",
      description:
        "Daily court-reality series in which veteran mediator and former hostage negotiator Sean Collinson settles headline-worthy disputes on camera.",
      evidence: [
        { text: "Series green-lit for The CW’s Fall 2024 daytime lineup (" },
        {
          text: "",
          link: {
            text: "The Futon Critic",
            url: "https://www.thefutoncritic.com",
          },
        },
        {
          text: "); distributed by Paramount Global Content Distribution to Roku and CW apps (",
        },
        {
          text: "",
          link: {
            text: "CivilJusticeTV.com",
            url: "https://civiljusticetv.com",
          },
        },
        { text: "); streams free on Roku devices as of October 2024 (" },
        { text: "", link: { text: "Roku", url: "https://www.roku.com" } },
        { text: ")." },
      ],
    },
    {
      title: "Comedy Pays with Cedric the Entertainer",
      network: "Instagram",
      year: "2024– ",
      titleLink: "#",
      platforms: "Instagram",
      description:
        "Social-first comedy contest in which Cedric the Entertainer crowns the funniest weekly user-submitted joke, paying $1,000 to each winner.",
      evidence: [
        {
          text: "Series and weekly cash-prize format announced April 2024 by Cedric and Kapital Entertainment (",
        },
        {
          text: "",
          link: {
            text: "Yahoo Entertainment",
            url: "https://www.yahoo.com/entertainment",
          },
        },
        {
          text: "); official @ComedyPays account launched May 2024, topping 5k followers in first month (",
        },
        {
          text: "",
          link: {
            text: "Instagram",
            url: "https://www.instagram.com/comedypays",
          },
        },
        {
          text: "); Cedric hosts and exec-produces via his A Bird and A Bear banner (",
        },
        {
          text: "",
          link: {
            text: "Instagram",
            url: "https://www.instagram.com/cedrictheentertainer",
          },
        },
        { text: ")." },
      ],
    },
    {
      title: "Black Cake",
      network: "Hulu",
      year: "2023",
      titleLink: "#",
      platforms: "Hulu",
      description:
        "Family drama unveiling hidden pasts through a matriarch’s recipe.",
      evidence: [
        { text: "93% critics score on Rotten Tomatoes (" },
        {
          text: "",
          link: {
            text: "Rotten Tomatoes",
            url: "https://www.rottentomatoes.com",
          },
        },
        { text: "); Named among 2023’s best by Time Magazine (" },
        { text: "", link: { text: "Time", url: "https://time.com" } },
        {
          text: "); Cast lauded for chemistry, earning a “Best Ensemble” nod (",
        },
        {
          text: "",
          link: { text: "Shadow & Act", url: "https://shadowandact.com" },
        },
        { text: ")." },
      ],
    },
    {
      title: "Shining Vale",
      network: "Starz",
      year: "2022–2023",
      titleLink: "#",
      platforms: "Starz",
      description:
        "Horror-comedy starring Courteney Cox as a novelist who discovers her new Connecticut home is haunted by a 1950s housewife.",
      evidence: [
        { text: "Renewed for Season 2 just two months after debut (" },
        {
          text: "",
          link: { text: "Wikipedia", url: "https://en.wikipedia.org" },
        },
        {
          text: "); nominated for a 2023 Saturn Award for Best Fantasy Television Series (",
        },
        {
          text: "",
          link: { text: "Wikipedia", url: "https://en.wikipedia.org" },
        },
        {
          text: "); Entertainment Weekly previewed Season 2 as “deliciously darker and funnier” (",
        },
        { text: "", link: { text: "EW", url: "https://ew.com" } },
        { text: ")." },
      ],
    },
    {
      title: "Let the World See",
      network: "ABC News",
      year: "2022",
      titleLink: "#",
      platforms: "ABC News",
      description:
        "Docuseries chronicling Mamie Till-Mobley’s advocacy for justice after Emmett Till’s murder.",
      evidence: [
        { text: "NYT ‘Critics’ Pick’ for powerful storytelling (" },
        { text: "", link: { text: "NYT", url: "https://www.nytimes.com" } },
        { text: "); Averaged 3.2 million viewers (" },
        { text: "", link: { text: "Deadline", url: "https://deadline.com" } },
        {
          text: "); Co-produced with Roc Nation and lauded for its historical depth (",
        },
        {
          text: "",
          link: { text: "THR", url: "https://www.hollywoodreporter.com" },
        },
        { text: ")." },
      ],
    },
    {
      title: "Pivoting",
      network: "Fox",
      year: "2022",
      titleLink: "#",
      platforms: "Fox",
      description:
        "Single-camera comedy about three lifelong friends who impulsively “pivot” their lives after their best friend’s death.",
      evidence: [
        { text: "Holds a 100% critics score on Rotten Tomatoes (" },
        {
          text: "",
          link: {
            text: "Rotten Tomatoes",
            url: "https://www.rottentomatoes.com",
          },
        },
        {
          text: "); Variety praised the lead trio’s chemistry and “sharp, heartfelt writing” (",
        },
        { text: "", link: { text: "Variety", url: "https://variety.com" } },
        {
          text: "); debuted to 3.2 million multi-platform viewers; Fox’s top mid-season comedy launch of 2022 (",
        },
        {
          text: "",
          link: { text: "Fox Press", url: "https://www.foxflash.com" },
        },
        { text: ")." },
      ],
    },
    {
      title: "Women of the Movement",
      network: "ABC",
      year: "2022",
      titleLink: "#",
      platforms: "ABC, Hulu",
      description:
        "Six-part limited series chronicling Mamie Till-Mobley’s relentless quest for justice after her son Emmett Till’s 1955 murder.",
      evidence: [
        {
          text: "Won a Television Academy Honor for socially impactful storytelling (",
        },
        {
          text: "",
          link: { text: "Television Academy", url: "https://www.emmys.com" },
        },
        {
          text: "); Marissa Jo Cerar earned NAACP Image Award for Outstanding Writing (",
        },
        {
          text: "",
          link: {
            text: "NAACP Image Awards",
            url: "https://naacpimageawards.net",
          },
        },
        {
          text: "); ABC’s most-watched new limited series of 2022, averaging 5 million viewers in live+same-day ratings (",
        },
        { text: "", link: { text: "Deadline", url: "https://deadline.com" } },
        { text: ")." },
      ],
    },
    {
      title: "American Auto",
      network: "NBC",
      year: "2021–2023",
      titleLink: "#",
      platforms: "NBC, Peacock",
      description:
        "Workplace satire following a dysfunctional Detroit automaker’s C-suite as they scramble to modernize.",
      evidence: [
        {
          text: "Season 1 premiered with a 100% Rotten Tomatoes critics score (",
        },
        {
          text: "",
          link: {
            text: "Rotten Tomatoes",
            url: "https://www.rottentomatoes.com",
          },
        },
        {
          text: "); renewed for Season 2 after steady ratings growth and strong Peacock viewing (",
        },
        { text: "", link: { text: "Deadline", url: "https://deadline.com" } },
        { text: "); Decider called it a “friendly funny sleeper hit” (" },
        { text: "", link: { text: "Decider", url: "https://decider.com" } },
        { text: ")." },
      ],
    },
    {
      title: "HouseBroken",
      network: "Fox",
      year: "2021–2023",
      titleLink: "#",
      platforms: "Fox, Hulu",
      description:
        "Animated comedy about a group-therapy circle for neurotic neighborhood pets, led by a poodle voiced by Lisa Kudrow.",
      evidence: [
        {
          text: "Winner of two 2022 Women’s Image Network Awards including Outstanding Animated Series (",
        },
        {
          text: "",
          link: { text: "TV Guide", url: "https://www.tvguide.com" },
        },
        { text: "); renewed for Season 2 within three months of debut (" },
        {
          text: "",
          link: {
            text: "Animation Magazine",
            url: "https://www.animationmagazine.net",
          },
        },
        { text: "); nominated for an Annie Award for Best Voice Acting (" },
        {
          text: "",
          link: {
            text: "IMDb Awards",
            url: "https://www.imdb.com/event/ev0000004/",
          },
        },
        { text: ")." },
      ],
    },
    {
      title: "Merry Happy Whatever",
      network: "Netflix",
      year: "2019",
      titleLink: "#",
      platforms: "Netflix",
      description:
        "Holiday sitcom starring Dennis Quaid as a gruff dad whose tight-knit family navigates Christmas chaos when his daughter brings home her new fiancé.",
      evidence: [
        {
          text: "Decider recommended it as a “big-family binge-watch” on release day (",
        },
        { text: "", link: { text: "Decider", url: "https://decider.com" } },
        {
          text: "); Netflix promoted it globally in the “Holiday TV Favorites” carousel (",
        },
        {
          text: "",
          link: { text: "Netflix Media", url: "https://media.netflix.com" },
        },
        {
          text: "); Quaid’s performance praised as “surprisingly cuddly” by TV Insider (",
        },
        {
          text: "",
          link: { text: "TV Insider", url: "https://www.tvinsider.com" },
        },
        { text: ")." },
      ],
    },
    {
      title: "Carol’s Second Act",
      network: "CBS",
      year: "2019–2020",
      titleLink: "#",
      platforms: "CBS, Paramount+",
      description:
        "Patricia Heaton plays a 50-something former teacher launching a “second act” as a first-year medical intern.",
      evidence: [
        {
          text: "Series premiere drew 5.97 million viewers, winning its Thursday 9:30 PM slot (",
        },
        {
          text: "",
          link: { text: "Broadcasting & Cable", url: "https://www.nexttv.com" },
        },
        {
          text: "); received a five-episode back-order after strong DVR lifts (",
        },
        { text: "", link: { text: "Deadline", url: "https://deadline.com" } },
        {
          text: "); Heaton’s return to primetime touted by The Hollywood Reporter as “a welcome dose of warmth” (",
        },
        {
          text: "",
          link: { text: "THR", url: "https://www.hollywoodreporter.com" },
        },
        { text: ")." },
      ],
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:max-w-5xl lg:mx-auto my-8">
      <div className="bg-white">
        {showsData.map((show, index) => (
          <ShowCard key={index} show={show} />
        ))}
      </div>
    </section>
  );
}
