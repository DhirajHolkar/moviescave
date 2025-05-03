'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { client } from '../../../sanity';
import '../../styles/anime-page.css';

const AnimePage = () => {
  const [animeList, setAnimeList] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const animePerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == "animesDetails"]{
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
        setAnimeList(data);
      } catch (error) {
        console.error('Error fetching anime:', error);
      }
    };

    fetchData();
  }, []);

  const genres = ['All', 'Adventure', 'Romance', 'Action', 'Fantasy'];
  const countries = ['All', 'Japan', 'USA', 'South Korea'];
  const years = ['All', 2020, 2021, 2022, 2023];

  const filteredAnime = animeList.filter((anime) => {
    const genreMatch = selectedGenre === '' || selectedGenre === 'All' || (anime.genre && anime.genre.includes(selectedGenre));
    const countryMatch = selectedCountry === '' || selectedCountry === 'All' || anime.country === selectedCountry;
    const yearMatch = selectedYear === '' || selectedYear === 'All' || anime.year?.toString() === selectedYear.toString();
    return genreMatch && countryMatch && yearMatch;
  });

  const indexOfLastAnime = currentPage * animePerPage;
  const indexOfFirstAnime = indexOfLastAnime - animePerPage;
  const currentAnime = filteredAnime.slice(indexOfFirstAnime, indexOfLastAnime);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="anime-container">

      {/* Filters */}
      <div className="anime-filters">

        <div>
        <div className='anime-filters-type'>Genre</div>
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          {genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        </div>

        <div>
        <div className='anime-filters-type'>Country</div>
        <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        </div>

        <div>
        <div className='anime-filters-type'>Year</div>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        </div>
        </div>

      {/* Grid */}
      <div className="anime-grid">
        {currentAnime.map((anime) => (
          <div key={anime._id} className="anime-card">

            

            <Link href={`/anime-details?slug=${anime.slug.current}`}>
            <img src={anime.image?.asset?.url} alt={anime.title} />
            <div>{anime.title}</div>
            </Link>

          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="anime-pagination">
        {Array.from({ length: Math.ceil(filteredAnime.length / animePerPage) }, (_, index) => (
          <button key={index + 1} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnimePage;
