export type Movie = {
  slug: string;
  title: string;
  originalTitle: string;
  synopsis: string;
  poster: string;
  genre: string;
  year: number;
  duration: string;
  rating: string;
  creator: string;
  source: string;
  sourceUrl: string;
  playback: "embed" | "link";
  embedUrl?: string;
  accent: string;
  glow: string;
  featured?: boolean;
  tagline?: string;
  kicker?: string;
};

export const movies: Movie[] = [
  {
    slug: "urutonde-rwibyo-nshaka",
    title: "Urutonde rw'Ibyo Nshaka",
    originalTitle: "The Bucket List",
    synopsis:
      "Abagabo babiri bafite uburwayi butandukanye bahura mu bitaro, bakajya mu rugendo rwo kuzuza ibyo batigeze bakora. Inkuru y'ubuzima, ubucuti n'icyizero.",
    poster: "/posters/urutonde-rwibyo-nshaka.svg",
    genre: "Drama",
    year: 2007,
    duration: "1h 37m",
    rating: "7.8",
    creator: "Agasobanuye na Mugabo",
    source: "Oshakur Films",
    sourceUrl: "https://www.oshakurfilms.com/watch/the-bucket-list",
    playback: "embed",
    embedUrl: "https://vsembed.com/qpqrw",
    accent: "#f7b733",
    glow: "#ff6b3d",
    featured: true,
    tagline: "Ibyo ushaka kuba mbere y'uko isi iguhindura.",
    kicker: "Filime y'umunsi",
  },
  {
    slug: "abanyabwenge-batatu",
    title: "Abanyabwenge Batatu",
    originalTitle: "3 Idiots",
    synopsis:
      "Abanyeshuri batatu bo muri kaminuza yo mu Buhinde babona uburezi mu buryo butandukanye. Umwe muri bo atanga ikiganiro cy'ubuzima gihindura bose.",
    poster: "/posters/abanyabwenge-batatu.svg",
    genre: "Comedy",
    year: 2009,
    duration: "2h 50m",
    rating: "8.4",
    creator: "Agasobanuye na Nshuti",
    source: "Oshakur Films",
    sourceUrl: "https://www.oshakurfilms.com/",
    playback: "link",
    accent: "#8b5cf6",
    glow: "#22d3ee",
    featured: true,
    tagline: "Ubwenge nyakuri ntabwo bubarirwa mu manota.",
    kicker: "Iyakunzwe cyane",
  },
  {
    slug: "imizi-yinzozi",
    title: "Imizi y'Inzozi",
    originalTitle: "Inception",
    synopsis:
      "Itsinda ry'abahanga ingeni z'inzozi ryinjira mu bitekerezo by'umucuruzi kugira limuhindure. Ariko buri gice cy'inzozi cyongera ibibazo.",
    poster: "/posters/imizi-yinzozi.svg",
    genre: "Action",
    year: 2010,
    duration: "2h 28m",
    rating: "8.3",
    creator: "Agasobanuye na Karekezi",
    source: "Oshakur Films",
    sourceUrl: "https://www.oshakurfilms.com/",
    playback: "embed",
    embedUrl: "https://vsembed.com/qpqrw",
    accent: "#0ea5e9",
    glow: "#6366f1",
    featured: true,
    tagline: "Inzozi nazo zifite imizi.",
    kicker: "Iy'igikorwa",
  },
  {
    slug: "titanic",
    title: "Titanic",
    originalTitle: "Titanic",
    synopsis:
      "Ubwato bunini bwa mbere bwari bugana muri Amerika. Mu kuvuka kwa Rose na Jack, urukundo ruhura n'amahirwe mabi y'ijoro rimwe.",
    poster: "/posters/titanic.svg",
    genre: "Romance",
    year: 1997,
    duration: "3h 14m",
    rating: "8.2",
    creator: "Agasobanuye na Uwimana",
    source: "Agasobanuye Hub",
    sourceUrl: "https://www.oshakurfilms.com/",
    playback: "link",
    accent: "#1d4ed8",
    glow: "#38bdf8",
    featured: true,
    tagline: "Umutima umwe, inyanja yose.",
    kicker: "Urukundo rw'amateka",
  },
  {
    slug: "kuzwa-muri-gereza",
    title: "Kuvoka muri Gereza",
    originalTitle: "The Shawshank Redemption",
    synopsis:
      "Umuntu w'icyubahiro uboherezwa muri gereza ashingwa icyaha atakoze. Ubucuti bwe n'umwe muri bo buhindura ubuzima bwa bose.",
    poster: "/posters/kuzwa-muri-gereza.svg",
    genre: "Drama",
    year: 1994,
    duration: "2h 22m",
    rating: "8.7",
    creator: "Agasobanuye na Mugabo",
    source: "Oshakur Films",
    sourceUrl: "https://www.oshakurfilms.com/",
    playback: "link",
    accent: "#334155",
    glow: "#f59e0b",
  },
  {
    slug: "inzira-yibyishimo",
    title: "Inzira y'Ibyishimo",
    originalTitle: "The Pursuit of Happyness",
    synopsis:
      "Se umwe arwanya ubukene, akazi gasaba cyane n'ubuzima bwa mwana we. Intsinzi ye ntiva ku mahirwe, ibva ku kwihangana.",
    poster: "/posters/inzira-yibyishimo.svg",
    genre: "Drama",
    year: 2006,
    duration: "1h 57m",
    rating: "8.0",
    creator: "Agasobanuye na Tuyishime",
    source: "Oshakur Films",
    sourceUrl: "https://www.oshakurfilms.com/",
    playback: "link",
    accent: "#0f766e",
    glow: "#fbbf24",
  },
  {
    slug: "umukene-wa-miliyoni",
    title: "Umukene wa Miliyoni",
    originalTitle: "Slumdog Millionaire",
    synopsis:
      "Umufaransa wo mu gace gakene yo mu Buhinde aba ku kibazo cya miliyoni. Buri kibazo kimuzana mu mateka ye.",
    poster: "/posters/umukene-wa-miliyoni.svg",
    genre: "Drama",
    year: 2008,
    duration: "2h 00m",
    rating: "8.0",
    creator: "Agasobanuye na Nshuti",
    source: "Agasobanuye Hub",
    sourceUrl: "https://www.oshakurfilms.com/",
    playback: "link",
    accent: "#b45309",
    glow: "#f43f5e",
  },
  {
    slug: "icyerekezo-cikirere",
    title: "Icyerekezo cy'Ikirere",
    originalTitle: "Interstellar",
    synopsis:
      "Isi iri hafi gupfa, itsinda ry'abashakashatsi riva mu kirere gushaka aho abantu bashobora kubaho. Urugendo rw'igihe n'urukundo.",
    poster: "/posters/icyerekezo-cikirere.svg",
    genre: "Action",
    year: 2014,
    duration: "2h 49m",
    rating: "8.6",
    creator: "Agasobanuye na Karekezi",
    source: "Oshakur Films",
    sourceUrl: "https://www.oshakurfilms.com/",
    playback: "link",
    accent: "#111827",
    glow: "#60a5fa",
  },
  {
    slug: "ingoma-yintare",
    title: "Ingoma y'Intare",
    originalTitle: "The Lion King",
    synopsis:
      "Umwana w'intare ahingwa n'umuryango we, akagaruka kugira yemeze umwanya we. Inkuru y'ubutegetsi, ubwoba n'ubucuti.",
    poster: "/posters/ingoma-yintare.svg",
    genre: "Family",
    year: 1994,
    duration: "1h 28m",
    rating: "8.4",
    creator: "Agasobanuye na Uwimana",
    source: "Agasobanuye Hub",
    sourceUrl: "https://www.oshakurfilms.com/",
    playback: "link",
    accent: "#b45309",
    glow: "#facc15",
  },
  {
    slug: "urukundo-rwa-dilwale",
    title: "Urukundo rwa Dilwale",
    originalTitle: "Dilwale Dulhania Le Jayenge",
    synopsis:
      "Abakunzi babiri bo mu Buhinde bagomba kwemera imiryango yabo mbere yo kubana. Urukundo rw'igihe kirekire, rwuzuyemo urwenya.",
    poster: "/posters/urukundo-rwa-dilwale.svg",
    genre: "Romance",
    year: 1995,
    duration: "3h 10m",
    rating: "8.0",
    creator: "Agasobanuye na Mugabo",
    source: "Oshakur Films",
    sourceUrl: "https://www.oshakurfilms.com/",
    playback: "link",
    accent: "#be123c",
    glow: "#fcd34d",
  },
  {
    slug: "igitabo-cyicyatsi",
    title: "Igitabo cy'Icyatsi",
    originalTitle: "Green Book",
    synopsis:
      "Umucuruzi w'umuziki n'umushoferi we bagenda muri Amerika mu mwaka wa 1962. Igitabo cyabafashaga kumenya aho bashobora kuruhuka.",
    poster: "/posters/igitabo-cyicyatsi.svg",
    genre: "Drama",
    year: 2018,
    duration: "2h 10m",
    rating: "7.8",
    creator: "Agasobanuye na Tuyishime",
    source: "Oshakur Films",
    sourceUrl: "https://www.oshakurfilms.com/",
    playback: "link",
    accent: "#166534",
    glow: "#a3e635",
  },
  {
    slug: "joker",
    title: "Joker",
    originalTitle: "Joker",
    synopsis:
      "Umuntu ukora urwenya mu muhanda, ufite ubuzima bugoye, agenda ahinduka ikimenyetso cy'umujinya w'abantu. Filime y'ubwoba n'umutima.",
    poster: "/posters/joker.svg",
    genre: "Thriller",
    year: 2019,
    duration: "2h 02m",
    rating: "8.3",
    creator: "Agasobanuye na Karekezi",
    source: "Agasobanuye Hub",
    sourceUrl: "https://www.oshakurfilms.com/",
    playback: "link",
    accent: "#4c1d95",
    glow: "#22c55e",
  },
];

export const genres = [
  "Zose",
  "Drama",
  "Comedy",
  "Action",
  "Romance",
  "Thriller",
  "Family",
];

export const featuredMovies = movies.filter((movie) => movie.featured);

export const newMovies = [...movies].sort((a, b) => b.year - a.year).slice(0, 8);

export const popularMovies = [...movies]
  .sort((a, b) => Number(b.rating) - Number(a.rating))
  .slice(0, 6);

export function getMovie(slug: string) {
  return movies.find((movie) => movie.slug === slug);
}

export function filterMovies(query: string, genre: string) {
  const q = query.trim().toLowerCase();
  return movies.filter((movie) => {
    const matchesGenre = genre === "Zose" || movie.genre === genre;
    const matchesQuery =
      !q ||
      movie.title.toLowerCase().includes(q) ||
      movie.originalTitle.toLowerCase().includes(q) ||
      movie.creator.toLowerCase().includes(q) ||
      movie.genre.toLowerCase().includes(q);
    return matchesGenre && matchesQuery;
  });
}
