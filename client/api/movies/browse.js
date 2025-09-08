import axios from 'axios';
import isoCountries from '../../data/countries.json';

//TMDB config
const config = {
  headers: {
    Authorization: `Bearer ${process.env.TMDB_AUTH}`
  }
};

const url = process.env.TMDB_URL;

//create region object
let countries = {};

isoCountries.forEach((item) => {
  let country = { [item["iso_3166_1"]]: item["english_name"] };
  countries = { ...countries, ...country };
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let region = req.body.region;

  try {
    const nextWatch = await axios.get(
      `${url}/trending/all/day?language=en-US`,
      config
    );
    const newPopular = await axios.get(
      `${url}/movie/upcoming?language=en-US&page=1`,
      config
    );
    const regionTopTV = await axios.get(
      `${url}/discover/tv?first_air_date.gte=2023-01-01&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&watch_region=${region}&with_origin_country=${region}`,
      config
    );
    const TVComedies = await axios.get(
      `${url}/discover/tv?first_air_date.gte=2023-01-01&include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&watch_region=${region}&with_genres=35%2C10751`,
      config
    );
    const TVShowsToday = await axios.get(
      `${url}/tv/airing_today?language=en-US&page=1`,
      config
    );

    const myList = [];

    const data = {
      nextWatch: nextWatch.data.results,
      newPopular: newPopular.data.results,
      regionTopTV: regionTopTV.data.results,
      TVComedies: TVComedies.data.results,
      TVShowsToday: TVShowsToday.data.results,
      myList,
      countries
    };

    res.status(200).json({
      status: "success",
      data
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    });
  }
}