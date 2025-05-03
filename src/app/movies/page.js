'use client';

import React, { useEffect, useState} from 'react';
import Link from 'next/link';
import { client } from '../../../sanity';
import '../../styles/movies-page.css';

const MoviePage = () => {
  const [movieList, setMovieList] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);



  const moviePerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == "movies"]{
          _id,
          title,
          slug,
          country,
          year,
          revenue,
          director,
          studio,
          genre,
          image {
            asset -> {
              url
            }
          },
          description
        }`;
        const data = await client.fetch(query);
        setMovieList(data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      }
    };

    fetchData();
  }, []);


  const genres = ['All', 'Adventure', 'Romance', 'Action', 'Fantasy'];
  const countries = ['All', 'Japan', 'USA', 'South Korea'];
  const years = ['All', 2020, 2021, 2022, 2023];

  const filteredMovie = movieList.filter((movie) => {
    const genreMatch = selectedGenre === '' || selectedGenre === 'All' || (movie.genre && movie.genre.includes(selectedGenre));
    const countryMatch = selectedCountry === '' || selectedCountry === 'All' || movie.country === selectedCountry;
    const yearMatch = selectedYear === '' || selectedYear === 'All' || movie.year?.toString() === selectedYear.toString();
    return genreMatch && countryMatch && yearMatch;
  });

  const indexOfLastMovie = currentPage * moviePerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviePerPage;
  const currentMovie = filteredMovie.slice(indexOfFirstMovie, indexOfLastMovie);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="movies-container">




      {/* Filterss */}
      <div className="movies-filters">

        <div>
        <div className='movies-filters-type'>Genre</div>
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          {genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        </div>

        <div>
          <div className='movies-filters-type'>Country</div>
        <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        </div>

        <div>
        <div className='movies-filters-type'>Year</div>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        </div>

      </div>







      {/* Grid */}
      <div className="movies-grid">
        {currentMovie.map((movie) => (
          <div key={movie._id} className="movies-card">

            

            <Link href={`/movies-details?slug=${movie.slug.current}`}>
            <img src={movie.image?.asset?.url} alt={movie.title} />
            <div>{movie.title}</div>
            </Link>

            
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="movies-pagination">
        {Array.from({ length: Math.ceil(filteredMovie.length / moviePerPage) }, (_, index) => (
          <button key={index + 1} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
            {index + 1}
          </button>
        ))}
      </div>

    </div>
  );
};

export default MoviePage;









