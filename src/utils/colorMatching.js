// ============================================
// PicoArt v10 - 개선된 색상 매칭 알고리즘
// 색상(60%) + 밝기(20%) + 방향(20%) + 휴리스틱 보너스
// ============================================

// ============================================
// 1. HSV 변환 함수
// ============================================
function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = max === 0 ? 0 : delta / max;
    let v = max;

    if (delta !== 0) {
        if (max === r) {
            h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        } else if (max === g) {
            h = ((b - r) / delta + 2) / 6;
        } else {
            h = ((r - g) / delta + 4) / 6;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}

// ============================================
// 2. HSV 거리 계산 (색상 유사도)
// ============================================
function calculateHSVDistance(hsv1, hsv2) {
    // Hue는 원형이므로 최소 각도 차이 계산
    const hueDiff = Math.min(
        Math.abs(hsv1.h - hsv2.h),
        360 - Math.abs(hsv1.h - hsv2.h)
    );
    
    const satDiff = Math.abs(hsv1.s - hsv2.s);
    const valDiff = Math.abs(hsv1.v - hsv2.v);
    
    // 가중치
    const hueWeight = 0.5;
    const satWeight = 0.3;
    const valWeight = 0.2;
    
    return (hueDiff * hueWeight) + (satDiff * satWeight) + (valDiff * valWeight);
}

// ============================================
// 3. 사진 분석 함수 (NEW!)
// ============================================
function analyzePhoto(imageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // 1. 전체 밝기 계산
    let totalBrightness = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        totalBrightness += (r + g + b) / 3;
    }
    const avgBrightness = totalBrightness / (pixels.length / 4) / 255 * 100;
    
    // 2. 가로/세로 비율
    const aspectRatio = canvas.width / canvas.height;
    let orientation = 'square';
    if (aspectRatio < 0.8) orientation = 'portrait';
    else if (aspectRatio > 1.2) orientation = 'landscape';
    
    return {
        brightness: avgBrightness,
        orientation: orientation,
        aspectRatio: aspectRatio
    };
}

// ============================================
// 4. 지배적 색상 추출 (기존 방식)
// ============================================
function extractDominantColor(imageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 성능을 위해 작은 크기로 리사이즈
    const targetSize = 100;
    const scale = Math.min(targetSize / imageElement.width, targetSize / imageElement.height);
    canvas.width = imageElement.width * scale;
    canvas.height = imageElement.height * scale;
    
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // RGB 평균 계산
    let r = 0, g = 0, b = 0;
    const pixelCount = pixels.length / 4;
    
    for (let i = 0; i < pixels.length; i += 4) {
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
    }
    
    r = Math.round(r / pixelCount);
    g = Math.round(g / pixelCount);
    b = Math.round(b / pixelCount);
    
    return rgbToHsv(r, g, b);
}

// ============================================
// 5. 개선된 매칭 함수 (핵심!)
// ============================================
function findBestArtwork(photoHSV, photoAnalysis, artworksData, selectedCategory) {
    const categoryArtworks = artworksData.categories[selectedCategory];
    
    let bestMatch = null;
    let bestScore = -Infinity;
    
    categoryArtworks.artworks.forEach(artwork => {
        // 1. 기본 색상 유사도 (60% 가중치)
        const colorDistance = calculateHSVDistance(photoHSV, artwork.hsv);
        let colorScore = (100 - colorDistance) * 0.6;
        
        // 2. 밝기 유사도 (20% 가중치)
        const brightnessDiff = Math.abs(photoAnalysis.brightness - artwork.brightness);
        let brightnessScore = (100 - brightnessDiff) * 0.2;
        
        // 3. 방향 매칭 보너스 (20% 가중치)
        let orientationBonus = 0;
        if (photoAnalysis.orientation === artwork.orientation) {
            orientationBonus = 20;
        }
        
        // 4. 추가 휴리스틱 보너스
        let heuristicBonus = 0;
        
        // 세로 사진 + 인물화 = 보너스
        if (photoAnalysis.orientation === 'portrait' && artwork.type === 'portrait') {
            heuristicBonus += 10;
        }
        
        // 가로 사진 + 풍경화 = 보너스
        if (photoAnalysis.orientation === 'landscape' && artwork.type === 'landscape') {
            heuristicBonus += 10;
        }
        
        // 어두운 사진 + 어두운 작품 = 보너스
        if (photoAnalysis.brightness < 40 && artwork.brightness < 40) {
            heuristicBonus += 8;
        }
        
        // 밝은 사진 + 밝은 작품 = 보너스
        if (photoAnalysis.brightness > 70 && artwork.brightness > 70) {
            heuristicBonus += 8;
        }
        
        // 최종 점수 계산
        const finalScore = colorScore + brightnessScore + orientationBonus + heuristicBonus;
        
        if (finalScore > bestScore) {
            bestScore = finalScore;
            bestMatch = artwork;
        }
    });
    
    return bestMatch;
}

// ============================================
// 6. 메인 함수 (통합)
// ============================================
async function selectArtworkForPhoto(imageElement, artworksData, selectedCategory) {
    // 1. 색상 추출 (기존 방식)
    const photoHSV = extractDominantColor(imageElement);
    
    // 2. 사진 분석 (새로 추가)
    const photoAnalysis = analyzePhoto(imageElement);
    
    // 3. 개선된 매칭
    const bestArtwork = findBestArtwork(photoHSV, photoAnalysis, artworksData, selectedCategory);
    
    console.log('=== Photo Analysis ===');
    console.log('HSV:', photoHSV);
    console.log('Brightness:', Math.round(photoAnalysis.brightness));
    console.log('Orientation:', photoAnalysis.orientation);
    console.log('=== Selected Artwork ===');
    console.log('ID:', bestArtwork.id);
    console.log('Name:', bestArtwork.name);
    console.log('Type:', bestArtwork.type);
    console.log('======================');
    
    return bestArtwork;
}

// ============================================
// 7. Export (ES6 모듈)
// ============================================
export {
    rgbToHsv,
    calculateHSVDistance,
    extractDominantColor,
    analyzePhoto,
    findBestArtwork,
    selectArtworkForPhoto
};
