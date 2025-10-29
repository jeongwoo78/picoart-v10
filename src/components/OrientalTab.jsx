import React, { useState } from 'react';
import './OrientalTab.css';

const OrientalTab = ({ artworkDatabase, onArtworkSelect }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState('korean');
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const oriental = artworkDatabase.oriental;
  const currentSubcategory = oriental.subcategories.find(
    sub => sub.id === selectedSubcategory
  );

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    setSelectedArtwork(null);
  };

  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork);
    if (onArtworkSelect) {
      onArtworkSelect(artwork);
    }
  };

  return (
    <div className="oriental-tab">
      {/* 서브카테고리 선택 버튼 */}
      <div className="subcategory-selector">
        <button
          className={`subcategory-btn ${selectedSubcategory === 'korean' ? 'active' : ''}`}
          onClick={() => handleSubcategoryChange('korean')}
        >
          <span className="flag">🇰🇷</span>
          <span className="label">한국 전통화</span>
          <span className="count">15</span>
        </button>

        <button
          className={`subcategory-btn ${selectedSubcategory === 'chinese' ? 'active' : ''}`}
          onClick={() => handleSubcategoryChange('chinese')}
        >
          <span className="flag">🇨🇳</span>
          <span className="label">중국 수묵화</span>
          <span className="count">15</span>
        </button>

        <button
          className={`subcategory-btn ${selectedSubcategory === 'japanese' ? 'active' : ''}`}
          onClick={() => handleSubcategoryChange('japanese')}
        >
          <span className="flag">🇯🇵</span>
          <span className="label">일본 우키요에</span>
          <span className="count">15</span>
        </button>
      </div>

      {/* 카테고리 설명 */}
      <div className="category-description">
        <h3>{currentSubcategory.name}</h3>
        <p className="description">{currentSubcategory.description}</p>
        <p className="years">{currentSubcategory.years}</p>
      </div>

      {/* 작품 그리드 */}
      <div className="artworks-grid">
        {currentSubcategory.artworks.map((artwork) => (
          <div
            key={artwork.id}
            className={`artwork-card ${selectedArtwork?.id === artwork.id ? 'selected' : ''}`}
            onClick={() => handleArtworkClick(artwork)}
          >
            <div className="artwork-image">
              <img
                src={`/artworks/${artwork.file}`}
                alt={artwork.name}
                loading="lazy"
              />
              <div className="artwork-overlay">
                <div className="artwork-info">
                  <p className="artwork-name">{artwork.name}</p>
                  <p className="artwork-artist">{artwork.artist}</p>
                </div>
              </div>
            </div>
            
            {/* 작품 메타 정보 */}
            <div className="artwork-meta">
              <span className="type-badge">{getTypeBadge(artwork.type)}</span>
              <span className="orientation-badge">{getOrientationIcon(artwork.orientation)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 선택된 작품 상세 정보 */}
      {selectedArtwork && (
        <div className="selected-artwork-detail">
          <div className="detail-content">
            <img
              src={`/artworks/${selectedArtwork.file}`}
              alt={selectedArtwork.name}
              className="detail-image"
            />
            <div className="detail-info">
              <h4>{selectedArtwork.name}</h4>
              <p className="artist">{selectedArtwork.artist} · {selectedArtwork.year}</p>
              <p className="style">{selectedArtwork.style}</p>
              <div className="tags">
                {selectedArtwork.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
              <div className="technical-info">
                <span>밝기: {selectedArtwork.brightness}</span>
                <span>방향: {selectedArtwork.orientation}</span>
                <span>유형: {selectedArtwork.type}</span>
              </div>
            </div>
          </div>
          <button 
            className="close-detail-btn"
            onClick={() => setSelectedArtwork(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

// 유틸리티 함수들
function getTypeBadge(type) {
  const typeMap = {
    'portrait': '👤 인물',
    'landscape': '🏔️ 풍경',
    'animal': '🐯 동물',
    'still-life': '🌸 정물',
    'abstract': '🎨 추상'
  };
  return typeMap[type] || type;
}

function getOrientationIcon(orientation) {
  const iconMap = {
    'portrait': '⬆️',
    'landscape': '↔️',
    'square': '⬜'
  };
  return iconMap[orientation] || '';
}

export default OrientalTab;
