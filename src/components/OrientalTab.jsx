import React, { useState } from 'react';
import './OrientalTab.css';

const OrientalTab = ({ artworkDatabase, onArtworkSelect, onCategoryChange, selectedArtwork }) => {
  const [selectedCategory, setSelectedCategory] = useState('korean');
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  const handleArtworkClick = (artwork) => {
    if (onArtworkSelect) {
      onArtworkSelect(artwork);
    }
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
  };

  const currentCategory = artworkDatabase.categories[selectedCategory];

  return (
    <div className="oriental-tab">
      {/* Subcategory selection buttons */}
      <div className="subcategory-selector">
        <button
          className={`subcategory-btn ${selectedCategory === 'korean' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('korean')}
        >
          <span className="flag">🇰🇷</span>
          <span className="label">한국 전통화</span>
          <span className="count">15</span>
        </button>

        <button
          className={`subcategory-btn ${selectedCategory === 'chinese' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('chinese')}
        >
          <span className="flag">🇨🇳</span>
          <span className="label">중국 수묵화</span>
          <span className="count">15</span>
        </button>

        <button
          className={`subcategory-btn ${selectedCategory === 'japanese' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('japanese')}
        >
          <span className="flag">🇯🇵</span>
          <span className="label">일본 우키요에</span>
          <span className="count">15</span>
        </button>
      </div>

      {/* Category description */}
      <div className="category-description">
        <h3>{currentCategory.name}</h3>
        <p className="description">{currentCategory.description || currentCategory.name_en}</p>
      </div>

      {/* Artworks grid */}
      <div className="artworks-grid">
        {currentCategory.artworks.map((artwork) => (
          <div
            key={artwork.id}
            className={`artwork-card ${selectedArtwork?.id === artwork.id ? 'selected' : ''}`}
            onClick={() => handleArtworkClick(artwork)}
          >
            <div className="artwork-image">
              <img
                src={`/artworks/11_Oriental/${artwork.filename}`}
                alt={artwork.title}
                loading="lazy"
              />
              <div className="artwork-overlay">
                <div className="artwork-info">
                  <p className="artwork-name">{artwork.title}</p>
                  <p className="artwork-artist">{artwork.artist}</p>
                </div>
              </div>
            </div>
            
            {/* Artwork metadata */}
            <div className="artwork-meta">
              <span className="type-badge">{artwork.style}</span>
              <span className="orientation-badge">{getOrientationIcon(artwork.orientation)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected artwork detail modal */}
      {selectedArtwork && showDetailModal && (
        <div className="selected-artwork-detail">
          <div className="detail-content">
            <img
              src={`/artworks/11_Oriental/${selectedArtwork.filename}`}
              alt={selectedArtwork.title}
              className="detail-image"
            />
            <div className="detail-info">
              <h4>{selectedArtwork.title}</h4>
              <p className="artist">{selectedArtwork.artist} · {selectedArtwork.year}</p>
              <p className="style">{selectedArtwork.style}</p>
              {selectedArtwork.description && (
                <p className="description">{selectedArtwork.description}</p>
              )}
              <div className="technical-info">
                <span>방향: {selectedArtwork.orientation}</span>
                <span>스타일: {selectedArtwork.style}</span>
              </div>
            </div>
          </div>
          <button 
            className="close-detail-btn"
            onClick={handleCloseModal}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

// Utility function
function getOrientationIcon(orientation) {
  const iconMap = {
    'portrait': '⬆️',
    'landscape': '↔️',
    'square': '⬜'
  };
  return iconMap[orientation] || '';
}

export default OrientalTab;
