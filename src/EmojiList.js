import React from 'react';
import { useState, useEffect, useCallback } from 'react';

const EmojiList = () => {
  const [emojis, setEmojis] = useState([]);
  const [filteredEmojis, setFilteredEmojis] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [emojisPerPage] = useState(10);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const response = await fetch('https://emojihub.yurace.pro/api/all');
        const data = await response.json();
        setEmojis(data);
        setFilteredEmojis(data);
        const uniqueCategories = [...new Set(data.map(emoji => emoji.category))];
        setCategories(['all', ...uniqueCategories]);
      } catch (error) {
        console.error('Error fetching emojis:', error);
      }
    };

    fetchEmojis();
  }, []);

  useEffect(() => {
    const filterEmojis = () => {
      if (selectedCategory === 'all') {
        setFilteredEmojis(emojis);
      } else {
        const filtered = emojis.filter(emoji => emoji.category === selectedCategory);
        setFilteredEmojis(filtered);
      }
      setCurrentPage(1);
    };

    filterEmojis();
  }, [emojis, selectedCategory]);

  const handleCategoryChange = useCallback(event => {
    setSelectedCategory(event.target.value);
  }, []);

  const handlePageChange = useCallback(pageNumber => {
    setCurrentPage(pageNumber);
  }, []);

  const indexOfLastEmoji = currentPage * emojisPerPage;
  const indexOfFirstEmoji = indexOfLastEmoji - emojisPerPage;
  const currentEmojis = filteredEmojis.slice(indexOfFirstEmoji, indexOfLastEmoji);

  return (
    <div>
      <h1>Emoji Browser</h1>
      <div className="filter-container">
        <label htmlFor="category-select">Filter by Category:</label>
        <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="emoji-container">
        {currentEmojis.map(emoji => (
          <div key={emoji.name} className="emoji-card">
            <div className="emoji">{emoji.html}</div>
            <div className="emoji-info">
              <p>Name: {emoji.name}</p>
              <p>Category: {emoji.category}</p>
              <p>Group: {emoji.group}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array(Math.ceil(filteredEmojis.length / emojisPerPage))
          .fill()
          .map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
      </div>
    </div>
  );
};

export default EmojiList;
