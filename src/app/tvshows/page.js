'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { client } from '../../../sanity';
import '../../styles/tvshows-page.css';

const TvshowsPage = () => {
  const [tvshowList, setTvshowList] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const tvshowPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == "tvshows"]{
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
        setTvshowList(data);
      } catch (error) {
        console.error('Error fetching tvshow:', error);
      }
    };

    fetchData();
  }, []);

  const genres = ['All', 'Adventure', 'Romance', 'Action', 'Fantasy'];
  const countries = ['All', 'Japan', 'USA', 'South Korea'];
  const years = ['All', 2020, 2021, 2022, 2023];

  const filteredTvshow = tvshowList.filter((tvshow) => {
    const genreMatch = selectedGenre === '' || selectedGenre === 'All' || (tvshow.genre && tvshow.genre.includes(selectedGenre));
    const countryMatch = selectedCountry === '' || selectedCountry === 'All' || tvshow.country === selectedCountry;
    const yearMatch = selectedYear === '' || selectedYear === 'All' || tvshow.year?.toString() === selectedYear.toString();
    return genreMatch && countryMatch && yearMatch;
  });

  const indexOfLastTvshow = currentPage * tvshowPerPage;
  const indexOfFirstTvshow = indexOfLastTvshow - tvshowPerPage;
  const currentTvshow = filteredTvshow.slice(indexOfFirstTvshow, indexOfLastTvshow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="tvshows-container">

      {/* Filters */}
      <div className="tvshows-filters">


      <div>
      <div className='tvshows-filters-type'>Genre</div>
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          {genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
      </select>
          </div>

          <div>
          <div className='tvshows-filters-type'>Country</div>
        <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
          </div>


          <div>
          <div className='tvshows-filters-type'>Year</div>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        </div>
          </div>


      {/* Grid */}
      <div className="tvshows-grid">
        {currentTvshow.map((tvshow) => (
          <div key={tvshow._id} className="tvshows-card">

            

            <Link href={`/tvshows-details?slug=${tvshow.slug.current}`}>
            <img src={tvshow.image?.asset?.url} alt={tvshow.title} />
            <div>{tvshow.title}</div>
            </Link>

           
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="tvshows-pagination">
        {Array.from({ length: Math.ceil(filteredTvshow.length / tvshowPerPage) }, (_, index) => (
          <button key={index + 1} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TvshowsPage;
