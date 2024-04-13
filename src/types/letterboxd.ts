export interface LetterboxdFilm {
  type: string;
  date: {
    published: number;
    watched: number;
  };
  film: {
    title: string;
    year: string;
    image: {
      tiny: string;
      small: string;
      medium: string;
      large: string;
    };
  };
  rating: {
    text: string;
    score: number;
  };
  review: string;
  spoilers: boolean;
  isRewatch: boolean;
  uri: string;
}

export interface Film {
  id: string;
  watched: string;
  title: string;
  year: string;
  poster: string;
  rating: string;
  review: string;
  url: string;
  isRewatch: boolean;
}
