import { useState, useRef } from 'react'
import './App.css'
import OrientalTab from './components/OrientalTab'
import { selectArtworkForPhoto } from './utils/colorMatching'
import artworksDatabase from './data/oriental-artworks-database.json'

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [resultImage, setResultImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('western') // 'western' or 'oriental'
  const [selectedCategory, setSelectedCategory] = useState(null)
  const fileInputRef = useRef(null)

  // File selection handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
        setResultImage(null)
        setSelectedArtwork(null)
      }
      reader.readAsDataURL(file)
    }
  }

  // Artwork selection handler
  const handleArtworkSelect = (artwork) => {
    setSelectedArtwork(artwork)
  }

  // AI Auto Matching (Oriental art only)
  const handleAutoMatch = async () => {
    if (!selectedImage || !selectedCategory) {
      alert('사진과 카테고리를 먼저 선택해주세요!')
      return
    }

    // Load image
    const img = new Image()
    img.src = selectedImage
    
    img.onload = () => {
      const bestArtwork = selectArtworkForPhoto(img, artworksDatabase, selectedCategory)
      setSelectedArtwork(bestArtwork)
      alert(`AI가 추천한 작품: ${bestArtwork.title}`)
    }
  }

  // Execute style transfer
  const handleStyleTransfer = async () => {
    if (!selectedImage || !selectedArtwork) {
      alert('사진과 작품을 모두 선택해주세요!')
      return
    }

    setIsProcessing(true)
    
    try {
      // Call Hugging Face API
      const response = await fetch('/api/style-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          styleImage: `/artworks/${selectedArtwork.folder || '11_Oriental'}/${selectedArtwork.filename}`,
          strength: 0.85,
          guidance_scale: 15
        })
      })

      if (!response.ok) {
        throw new Error('스타일 변환 실패')
      }

      const data = await response.json()
      setResultImage(data.output)
      
    } catch (error) {
      console.error('Error:', error)
      alert('스타일 변환 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Download result
  const handleDownload = () => {
    if (!resultImage) return
    
    const link = document.createElement('a')
    link.href = resultImage
    link.download = `picoart_${Date.now()}.jpg`
    link.click()
  }

  // Reset
  const handleReset = () => {
    setSelectedImage(null)
    setSelectedArtwork(null)
    setResultImage(null)
    setSelectedCategory(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>🎨 PicoArt</h1>
        <p>AI 기반 명화 스타일 변환 서비스</p>
      </header>

      {/* Main Content */}
      <div className="app-container">
        
        {/* Step 1: Upload Photo */}
        <section className="section upload-section">
          <h2>1️⃣ 사진 업로드</h2>
          <div className="upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input" className="upload-button">
              📸 사진 선택하기
            </label>
            {selectedImage && (
              <div className="preview-container">
                <img src={selectedImage} alt="Preview" className="preview-image" />
              </div>
            )}
          </div>
        </section>

        {/* Step 2: Select Category & Artwork */}
        <section className="section artwork-section">
          <h2>2️⃣ 작품 스타일 선택</h2>
          
          {/* Tab Selection */}
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'western' ? 'active' : ''}`}
              onClick={() => setActiveTab('western')}
            >
              🏛️ 서양화 (98개)
            </button>
            <button 
              className={`tab-button ${activeTab === 'oriental' ? 'active' : ''}`}
              onClick={() => setActiveTab('oriental')}
            >
              🎎 동양화 (45개)
            </button>
          </div>

          {/* Western Art Tab */}
          {activeTab === 'western' && (
            <div className="western-tab">
              <div className="category-grid">
                <div className="category-card">
                  <h3>🏛️ 그리스·로마</h3>
                  <p>7개 작품</p>
                </div>
                <div className="category-card">
                  <h3>✨ 비잔틴·이슬람</h3>
                  <p>7개 작품</p>
                </div>
                <div className="category-card">
                  <h3>🎨 르네상스</h3>
                  <p>7개 작품</p>
                </div>
                <div className="category-card">
                  <h3>🌟 바로크</h3>
                  <p>7개 작품</p>
                </div>
                <div className="category-card">
                  <h3>💫 로코코</h3>
                  <p>7개 작품</p>
                </div>
                <div className="category-card">
                  <h3>🌹 낭만주의</h3>
                  <p>7개 작품</p>
                </div>
                <div className="category-card">
                  <h3>🌈 인상주의</h3>
                  <p>7개 작품</p>
                </div>
                <div className="category-card">
                  <h3>🔥 야수파</h3>
                  <p>7개 작품</p>
                </div>
                <div className="category-card">
                  <h3>💥 표현주의</h3>
                  <p>7개 작품</p>
                </div>
                <div className="category-card">
                  <h3>⭐ 거장 컬렉션</h3>
                  <p>35개 작품</p>
                </div>
              </div>
              <p className="coming-soon">서양화 갤러리는 곧 업데이트 예정입니다!</p>
            </div>
          )}

          {/* Oriental Art Tab */}
          {activeTab === 'oriental' && (
            <OrientalTab 
              artworkDatabase={artworksDatabase}
              onArtworkSelect={handleArtworkSelect}
              onCategoryChange={setSelectedCategory}
              selectedArtwork={selectedArtwork}
            />
          )}

          {/* AI Auto Match Button (Oriental only) */}
          {activeTab === 'oriental' && selectedImage && selectedCategory && (
            <button className="auto-match-button" onClick={handleAutoMatch}>
              🤖 AI 자동 추천
            </button>
          )}
        </section>

        {/* Step 3: Style Transfer */}
        <section className="section transform-section">
          <h2>3️⃣ 스타일 변환</h2>
          <div className="transform-controls">
            <button 
              className="transform-button"
              onClick={handleStyleTransfer}
              disabled={!selectedImage || !selectedArtwork || isProcessing}
            >
              {isProcessing ? '⏳ 변환 중...' : '✨ 변환하기'}
            </button>
            <button 
              className="reset-button"
              onClick={handleReset}
            >
              🔄 초기화
            </button>
          </div>

          {/* Result Display */}
          {resultImage && (
            <div className="result-container">
              <h3>✅ 변환 완료!</h3>
              <img src={resultImage} alt="Result" className="result-image" />
              <button className="download-button" onClick={handleDownload}>
                💾 다운로드
              </button>
            </div>
          )}

          {/* Processing Display */}
          {isProcessing && (
            <div className="processing-overlay">
              <div className="spinner"></div>
              <p>명화로 변환하는 중...</p>
            </div>
          )}
        </section>

        {/* Selected Info Display */}
        {(selectedImage || selectedArtwork) && (
          <section className="section info-section">
            <h3>📋 선택 정보</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>사진:</strong> {selectedImage ? '✅ 업로드됨' : '❌ 없음'}
              </div>
              <div className="info-item">
                <strong>작품:</strong> {selectedArtwork ? `✅ ${selectedArtwork.title}` : '❌ 선택 안 됨'}
              </div>
              {selectedArtwork && (
                <>
                  <div className="info-item">
                    <strong>작가:</strong> {selectedArtwork.artist}
                  </div>
                  <div className="info-item">
                    <strong>시대:</strong> {selectedArtwork.year}
                  </div>
                </>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>PicoArt v10 | 특허: 10-2018-0016297, 10-2018-0122600</p>
        <p>서양화 98개 + 동양화 45개 = 이 143개 명화</p>
      </footer>
    </div>
  )
}

export default App
