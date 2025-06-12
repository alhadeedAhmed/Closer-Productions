const ShowCard = ({ show }) => {
  return (
    <div className="mb-2 pb-6">
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
    {
      title: "The Unicorn (CBS 2019–2021)",
      network: "CBS",
      year: "2019–2021",
      titleLink: "#",
      platforms: "CBS, Paramount+",
      description:
        "Heartfelt comedy in which widower Wade (Walton Goggins) discovers he’s dating “unicorn” — an unexpected catch.",
      evidence: [
        {
          text: "Holds a 91 % critics score on Rotten Tomatoes (",
        },
        {
          text: "",
          link: { text: "Rotten Tomatoes", url: "#" },
        },
        {
          text: "); Goggins nominated for Critics' Choice TV Award for Best Actor in a Comedy Series 2020 (",
        },
        {
          text: "",
          link: { text: "Critics Choice", url: "#" },
        },
        {
          text: "); CBS granted full‑season order after strong early ratings (",
        },
        {
          text: "",
          link: { text: "Deadline", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "Fam (CBS 2019)",
      network: "CBS",
      year: "2019",
      titleLink: "#",
      platforms: "CBS, Paramount+",
      description:
        "A newly engaged woman (Nina Dobrev) and her fiancé take in her wild teenage sister, instantly testing — and redefining — the idea of family.",
      evidence: [
        {
          text: "Series premiere drew 7.34 million viewers and a 1.2 demo, giving CBS a strong mid‑season comedy launch (",
        },
        {
          text: "",
          link: { text: "Deadline", url: "#" },
        },
        {
          text: "); retained most of its “Big Bang Theory” lead‑in during premiere week (",
        },
        {
          text: "",
          link: { text: "TVLine", url: "#" },
        },
        {
          text: "); praised by Variety for Dobrev’s “surprisingly deft” comedic turn (",
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
      title: "A Million Little Things",
      network: "ABC",
      year: "2018–2023",
      titleLink: "#",
      platforms: "ABC, Hulu",
      description:
        "A close‑knit Boston friend group reevaluates life after a shocking tragedy, discovering that friendship really is a million little things.",
      evidence: [
        {
          text: "Won a Television Academy Honor in 2019 for tackling real‑world mental‑health issues (",
        },
        {
          text: "",
          link: { text: "Television Academy", url: "#" },
        },
        {
          text: "); received a 2022 Sentinel Award for thoughtful portrayal of women’s health (",
        },
        {
          text: "",
          link: { text: "HHA&S", url: "#" },
        },
        {
          text: "); ran five successful seasons, reaching 87 episodes and a devoted fan base (",
        },
        {
          text: "",
          link: { text: "Deadline", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "Tell Me a Story",
      network: "CBS All Access",
      year: "2018–2020",
      titleLink: "#",
      platforms: "CBS All Access, The CW",
      description:
        "Dark anthology that reimagines classic fairy tales — Little Red Riding Hood, Three Little Pigs, Sleeping Beauty — as contemporary psychological thrillers.",
      evidence: [
        {
          text: "Renewed for Season 2 four weeks after launch (",
        },
        {
          text: "",
          link: { text: "Deadline", url: "#" },
        },
        {
          text: "); The CW acquired off‑network rights in 2020, expanding the audience beyond streaming (",
        },
        {
          text: "",
          link: { text: "Variety", url: "#" },
        },
        {
          text: "); Rotten Tomatoes critics called it “slick, stylish pulp” with 70 % positive reviews for S1 (",
        },
        {
          text: "",
          link: { text: "Rotten Tomatoes", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "9JKL",
      network: "CBS",
      year: "2017–2018",
      titleLink: "#",
      platforms: "CBS, Paramount+",
      description:
        "Newly divorced actor Josh Roberts moves into apartment 9K — sandwiched between his meddling parents in 9J and competitive brother in 9L — learning boundaries the hard way.",
      evidence: [
        {
          text: "Premiered to 8.2 million viewers and a 1.6 demo out of “Big Bang Theory,” giving CBS its best Monday 9:30 launch since 2014 (",
        },
        {
          text: "",
          link: { text: "Deadline", url: "#" },
        },
        {
          text: "); full 16‑episode order secured after solid retention (",
        },
        {
          text: "",
          link: { text: "RenewCancelTV", url: "#" },
        },
        {
          text: "); TV Guide highlighted veteran scene‑stealers Elliott Gould & Linda Lavin as “worth tuning in for” (",
        },
        {
          text: "",
          link: { text: "TV Guide", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "Me, Myself & I",
      network: "CBS",
      year: "2017",
      titleLink: "#",
      platforms: "CBS",
      description:
        "Sitcom spanning three stages of one man’s life: 14, 40, and 85.",
      evidence: [
        {
          text: "EW praised its inventive storytelling and non‑linear format (",
        },
        {
          text: "",
          link: { text: "EW", url: "#" },
        },
        {
          text: "); Premiere held ~5 million viewers (~1.0 demo) (",
        },
        {
          text: "",
          link: { text: "Deadline", url: "#" },
        },
        {
          text: "); Pilot earned a Writers Guild nomination (",
        },
        {
          text: "",
          link: { text: "WGA Archive", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "Santa Clarita Diet",
      network: "Netflix",
      year: "2017–2019",
      titleLink: "#",
      platforms: "Netflix",
      description:
        "Dark comedy following a suburban couple coping with the wife’s zombie transformation.",
      evidence: [
        {
          text: "Drew Barrymore called it a career highlight (",
        },
        {
          text: "",
          link: { text: "EW", url: "#" },
        },
        {
          text: "); TV Guide praised its horror‑comedy blend (",
        },
        {
          text: "",
          link: { text: "TV Guide", url: "#" },
        },
        {
          text: "); it was in Netflix’s Top 10 across multiple countries upon release (",
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
      title: "Divorce",
      network: "HBO",
      year: "2016–2019",
      titleLink: "#",
      platforms: "HBO, Max",
      description:
        "Dark comedy charting the long breakup of Frances and Robert after she suddenly asks for a divorce — starring Sarah Jessica Parker and Thomas Haden Church.",
      evidence: [
        {
          text: "Parker earned a Golden Globe nomination for Best Actress (TV Comedy) in 2017 (",
        },
        {
          text: "",
          link: { text: "Golden Globes", url: "#" },
        },
        {
          text: "); series praised by Vulture for “sharply observed midlife satire” (",
        },
        {
          text: "",
          link: { text: "Vulture", url: "#" },
        },
        {
          text: "); ran three seasons, concluding on creator Sharon Horgan’s terms in 2019 (",
        },
        {
          text: "",
          link: { text: "Deadline", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "American Housewife",
      network: "ABC",
      year: "2016–2021",
      titleLink: "#",
      platforms: "ABC, Hulu",
      description:
        "Outspoken mom Katie Otto (Katy Mixon) raises her perfectly imperfect family in wealthy Westport, CT — proving you don’t have to be perfect to fit in.",
      evidence: [
        {
          text: "Nominated for 2017 People’s Choice Award for Favorite New TV Comedy (",
        },
        {
          text: "",
          link: { text: "People", url: "#" },
        },
        {
          text: "); ran five seasons (103 episodes) on ABC, consistently anchoring Wednesday comedy block (",
        },
        {
          text: "",
          link: { text: "THR", url: "#" },
        },
        {
          text: "); Mixon lauded by Variety for her “brassy comic charisma” (",
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
      title: "Secrets & Lies",
      network: "ABC",
      year: "2015–2016",
      titleLink: "#",
      platforms: "ABC, Hulu",
      description:
        "Anthology crime drama where each season investigates a murder that exposes hidden secrets within a seemingly normal family.",
      evidence: [
        {
          text: "Two-hour premiere drew 8.9 million viewers and a 3.0 demo, ABC’s best Sunday launch since 2012 (",
        },
        {
          text: "",
          link: { text: "Deadline", url: "#" },
        },
        {
          text: "); renewed for Season 2 on stable 1.5 average demo (",
        },
        {
          text: "",
          link: { text: "Variety", url: "#" },
        },
        {
          text: "); Hollywood Reporter called it a “gripping whodunnit” anchored by solid performances (",
        },
        {
          text: "",
          link: { text: "THR", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "Life in Pieces",
      network: "CBS",
      year: "2015–2019",
      titleLink: "#",
      platforms: "CBS, Paramount+",
      description:
        "Family sitcom told in four bite-size stories each episode, chronicling hilarious milestones of the sprawling Short family.",
      evidence: [
        {
          text: "2015–16 television season’s most-watched new comedy (9.2 million Live+7 average) (",
        },
        {
          text: "",
          link: { text: "Deadline", url: "#" },
        },
        {
          text: "); earned Critics’ Choice nomination for Best Comedy Series 2016 (",
        },
        {
          text: "",
          link: { text: "Variety", url: "#" },
        },
        {
          text: "); ran four seasons (79 episodes) with consistently high DVR lifts (",
        },
        {
          text: "",
          link: { text: "THR", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "Kevin from Work",
      network: "Freeform",
      year: "2015",
      titleLink: "#",
      platforms: "Freeform (ABC Family)",
      description:
        "Workplace rom-com about Kevin, who confesses love to a coworker right before losing the job offer that would have taken him far away — forcing awkward day-to-day encounters.",
      evidence: [
        {
          text: "Holds a 76 % audience score on Rotten Tomatoes (",
        },
        {
          text: "",
          link: { text: "Rotten Tomatoes", url: "#" },
        },
        {
          text: "); Entertainment Weekly praised its “zippy, amiable charm” (",
        },
        {
          text: "",
          link: { text: "EW", url: "#" },
        },
        {
          text: "); Fans even launched an online petition to renew the show after its lone season.",
        },
      ],
    },
    {
      title: "The Mysteries of Laura",
      network: "NBC",
      year: "2014–2016",
      titleLink: "#",
      platforms: "NBC",
      description:
        "Detective Laura Diamond balances homicide cases with parenting her twin boys.",
      evidence: [
        {
          text: "Premiere attracted over 10 million viewers—NBC’s best fall launch in over a year (",
        },
        {
          text: "",
          link: { text: "Deadline", url: "#" },
        },
        {
          text: "); Entertainment Weekly praised the blend of crime and comedy (",
        },
        {
          text: "",
          link: { text: "EW", url: "#" },
        },
        {
          text: "); Format inspired remakes in Italy and Spain (",
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
      title: "Chasing Life",
      network: "ABC Family",
      year: "2014–2015",
      titleLink: "#",
      platforms: "ABC Family, Hulu",
      description:
        "A journalist pursues career, relationships, and survival after a leukemia diagnosis.",
      evidence: [
        {
          text: "Hollywood Reporter called its illness portrayal “empathetic, authentic” (",
        },
        {
          link: { text: "HR", url: "#" },
        },
        {
          text: "). Cancer advocacy groups praised its treatment of disease (",
        },
        {
          link: { text: "American Cancer Society", url: "#" },
        },
        {
          text: "). Its audience grew from 1.2 million to about 1.6 million by season’s end (",
        },
        {
          link: { text: "Deadline", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "Friends With Better Lives",
      network: "CBS",
      year: "2014",
      titleLink: "#",
      platforms: "CBS",
      description:
        "Ensemble comedy of friends convinced the others have the better life.",
      evidence: [
        {
          text: "Premiere drew 8.1 million viewers—strong mid-season numbers (",
        },
        {
          link: { text: "HR", url: "#" },
        },
        {
          text: "). Developed by 'Friends' veteran Scott Silveri (",
        },
        {
          link: { text: "Variety", url: "#" },
        },
        {
          text: "); LA Times praised its “sharp comedic timing” (",
        },
        {
          link: { text: "LA Times", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "Instant Mom",
      network: "Nick at Nite",
      year: "2013–2015",
      titleLink: "#",
      platforms: "Nick at Nite, Paramount+",
      description:
        "Party girl Steph (Tia Mowry-Hardrict) suddenly becomes step-mom to three kids and learns parenting on the fly.",
      evidence: [
        {
          text: "Ran 65 episodes over three seasons — Nick at Nite’s longest-running original sitcom (",
        },
        {
          link: { text: "Deadline", url: "#" },
        },
        {
          text: "); NAACP Image Award nomination for Outstanding Actress (Tia Mowry) 2014 (",
        },
        {
          link: { text: "NAACP", url: "#" },
        },
        {
          text: "); Nick at Nite reported 1.3 million total viewers for the series launch.",
        },
      ],
    },
    {
      title: "Back in the Game",
      network: "ABC",
      year: "2013–2014",
      titleLink: "#",
      platforms: "ABC",
      description:
        "A divorced mom moves in with her father and starts coaching her son’s baseball team.",
      evidence: [
        {
          text: "Entertainment Weekly praised its “genuine warmth and textured humor” (",
        },
        {
          link: { text: "EW", url: "#" },
        },
        {
          text: "). Hollywood Reporter highlighted the strong ensemble, especially James Caan and Maggie Lawson (",
        },
        {
          link: { text: "HR", url: "#" },
        },
        {
          text: "). Common Sense Media gave it high marks for family appeal (",
        },
        {
          link: { text: "CSM", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "Wendell & Vinnie",
      network: "Nickelodeon",
      year: "2013",
      titleLink: "#",
      platforms: "Nickelodeon (Nick at Nite)",
      description:
        "Loveable slacker Vinnie (Jerry Trainor) becomes guardian to his precocious 12-year-old nephew, leading to chaotic life lessons.",
      evidence: [
        {
          text: "Debuted to 2.4 million viewers, according to industry site TV Series Finale; held 2.38 million in week 2, reflecting strong word-of-mouth (",
        },
        {
          link: { text: "TV by the Numbers", url: "#" },
        },
        {
          text: "); praised by Common Sense Media for “positive family messages” (",
        },
        {
          link: { text: "Common Sense Media", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "GCB",
      network: "ABC",
      year: "2012",
      titleLink: "#",
      platforms: "ABC",
      description:
        "Dallas dramedy about a widow confronting her high-school “mean girls.”",
      evidence: [
        {
          text: "Kristin Chenoweth was called a “scene-stealer” in reviews (",
        },
        {
          link: { text: "Vulture", url: "#" },
        },
        {
          text: "). The premiere drew 7.5 million viewers—a solid mid-season debut (",
        },
        {
          link: { text: "Hollywood Reporter", url: "#" },
        },
        {
          text: "). ABC ordered a full 10-episode season based on social buzz and early momentum (",
        },
        {
          link: { text: "TVLine", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "Inbetweeners",
      network: "MTV",
      year: "2012",
      titleLink: "#",
      platforms: "MTV",
      description:
        "American spin on the UK hit, following four awkward teens navigating high school chaos.",
      evidence: [
        {
          text: "Critics praised its faithful adaptation and fresh cultural tweaks (",
        },
        {
          link: { text: "Hollywood Reporter", url: "#" },
        },
        {
          text: "). Its pilot attracted ~2 million viewers—strong for MTV (",
        },
        {
          link: { text: "Wikipedia", url: "#" },
        },
        {
          text: "). Despite its single season, it gained a cult following in teen-comedy retrospectives (",
        },
        {
          link: { text: "Vulture", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
    {
      title: "Terra Nova",
      network: "Fox",
      year: "2011",
      titleLink: "#",
      platforms: "Fox, Hulu",
      description:
        "Ambitious sci-fi adventure in which colonists from a dying 2149 Earth travel 85 million years into the past to rebuild civilization among dinosaurs.",
      evidence: [
        {
          text: "Two-hour series premiere drew 9.0 million viewers and a 3.0 demo, winning its slot for Fox (",
        },
        {
          link: { text: "Deadline", url: "#" },
        },
        {
          text: "); nominated for the 2012 Saturn Award for Best Network Television Series (",
        },
        {
          link: { text: "Wikipedia", url: "#" },
        },
        {
          text: "); Visual Effects Society honored its pilot with a nomination for Outstanding VFX in a Broadcast Program (",
        },
        {
          link: { text: "Wikipedia", url: "#" },
        },
        {
          text: ").",
        },
      ],
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:max-w-5xl lg:mx-auto my-8">
      <div className="bg-transparent">
        {showsData.map((show, index) => (
          <ShowCard key={index} show={show} />
        ))}
      </div>
    </section>
  );
}
