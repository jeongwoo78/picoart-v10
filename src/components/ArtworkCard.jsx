import React from 'react';
import './ArtworkCard.css';

const ArtworkCard = ({ artwork, isSelected, onClick }) => {
  const getTypeIcon = (type) => {
    const icons = {
      'portrait': '👤',
      'landscape': '🏔️',
      'animal': '🐯',
      'still-life': '🌸',
      'abstract': '🎨'
    };
    return icons[type] || '🎨';
  };

  const getOrientationIcon = (orientation) => {
    const icons = {
      'portrait': '⬆️',
      'landscape': '↔️',
      'square': '⬜'
    };
    return icons[orientation] || '';
  };

  const getBrightnessLabel = (brightness) => {
    if (brightness < 40) return { label: '어두움', color: '#4a5568' };
    if (brightness < 70) return { label: '중간', color: '#718096' };
    return { label: '밝음', color: '#a0aec0' };
  };

  const brightnessInfo = getBrightnessLabel(artwork.brightness);

  return (
    <div
      className={`artwork-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
    >
      {/* 이미지 영역 */}
      <div className="card-image-wrapper">
        <img
          src={`/artworks/${artwork.file}`}
          alt={`${artwork.name} by ${artwork.artist}`}
          loading="lazy"
          className="card-image"
        />
        
        {/* 호버 시 보이는 오버레이 */}
        <div className="card-overlay">
          <div className="overlay-content">
            <h4 className="artwork-title">{artwork.name}</h4>
            <p className="artwork-artist">{artwork.artist}</p>
            <p className="artwork-year">{artwork.year}</p>
          </div>
        </div>

        {/* 선택 표시 */}
        {isSelected && (
          <div className="selected-indicator">
            <span className="checkmark">✓</span>
          </div>
        )}
      </div>

      {/* 메타 정보 */}
      <div className="card-footer">
        <div className="meta-badges">
          <span className="badge type-badge" title={`유형: ${artwork.type}`}>
            {getTypeIcon(artwork.type)}
          </span>
          <span className="badge orientation-badge" title={`방향: ${artwork.orientation}`}>
            {getOrientationIcon(artwork.orientation)}
          </span>
          <span 
            className="badge brightness-badge" 
            style={{ color: brightnessInfo.color }}
            title={`밝기: ${artwork.brightness}`}
          >
            {brightnessInfo.label}
          </span>
        </div>

        {/* 작품명 (간략) */}
        <div className="card-title-short">
          <p className="name-short">{artwork.name}</p>
          <p className="artist-short">{artwork.artist}</p>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
