'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../styles/Navbar.css';

export default function Navbar() {

  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Added sidebar state
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault(); 
    if (searchQuery.trim() !== '') {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (

    <>



    <nav className="navbar">

        <div className="navbar__logo navbar-item">
          <Link href="/">
            <img src="movies cave logo n.png" alt="" className="navbar-large-logo" />
            <img src="movies cave.png" alt="" className="navbar-small-logo" />
          </Link>
        </div>

        <div className="navbar__links navbar-item">
          <Link href="/anime">Anime</Link>
          <Link href="/game">Game</Link>
        </div>

        <div className="navbar__search navbar-item">
          <form onSubmit={handleSearch} style={{ display: 'flex' }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <img src="search.svg" alt="" />
            </button>
          </form>
        </div>

        {/* Hamburger icon for mobile */}
        <div className="navbar__menu-icon" onClick={toggleSidebar}>
          <img src="menu-icon.svg" alt="menu" />
        </div>

    </nav>







      {/* Sidebar for mobile */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>

        <div className="sidebar__close-icon" onClick={toggleSidebar}>
          <img src="close-icon.svg" alt="close" />
        </div>

        <Link href="/movies" onClick={toggleSidebar}>Movies</Link>
        <Link href="/tvshows" onClick={toggleSidebar}>TV Shows</Link>
        <Link href="/anime" onClick={toggleSidebar}>Anime</Link>

      </div>

      {/* Overlay when sidebar is open */}
      {sidebarOpen && <div className="sidebar__overlay" onClick={toggleSidebar}></div>}



    </>



  );
}
