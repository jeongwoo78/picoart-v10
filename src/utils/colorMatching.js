// ============================================
// PicoArt v10 - Improved Color Matching Algorithm
// Color(60%) + Brightness(20%) + Orientation(20%) + Heuristic Bonus
// ============================================

// ============================================
// 1. RGB to HSV conversion
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
// 2. Hex to RGB conversion
// ============================================
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// ============================================
// 3. HSV distance calculation
// ============================================
function calculateHSVDistance(hsv1, hsv2) {
    // Hue is circular, calculate minimum angle difference
    const hueDiff = Math.min(
        Math.abs(hsv1.h - hsv2.h),
        360 - Math.abs(hsv1.h - hsv2.h)
    );
    
    const satDiff = Math.abs(hsv1.s - hsv2.s);
    const valDiff = Math.abs(hsv1.v - hsv2.v);
    
    // Weights
    const hueWeight = 0.5;
    const satWeight = 0.3;
    const valWeight = 0.2;
    
    return (hueDiff * hueWeight) + (satDiff * satWeight) + (valDiff * valWeight);
}

// ============================================
// 4. Photo analysis
// ============================================
function analyzePhoto(imageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // 1. Calculate overall brightness
    let totalBrightness = 0;
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        totalBrightness += (r + g + b) / 3;
    }
    const avgBrightness = totalBrightness / (pixels.length / 4) / 255 * 100;
    
    // 2. Aspect ratio
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
// 5. Extract dominant color
// ============================================
function extractDominantColor(imageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Resize for performance
    const targetSize = 100;
    const scale = Math.min(targetSize / imageElement.width, targetSize / imageElement.height);
    canvas.width = imageElement.width * scale;
    canvas.height = imageElement.height * scale;
    
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Calculate RGB average
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
// 6. Calculate artwork brightness from hex colors
// ============================================
function calculateArtworkBrightness(dominantColors) {
    if (!dominantColors || dominantColors.length === 0) {
        return 50; // default medium brightness
    }
    
    let totalBrightness = 0;
    dominantColors.forEach(hexColor => {
        const rgb = hexToRgb(hexColor);
        if (rgb) {
            totalBrightness += (rgb.r + rgb.g + rgb.b) / 3;
        }
    });
    
    return (totalBrightness / dominantColors.length) / 255 * 100;
}

// ============================================
// 7. Get artwork HSV from dominant colors
// ============================================
function getArtworkHSV(dominantColors) {
    if (!dominantColors || dominantColors.length === 0) {
        return { h: 0, s: 0, v: 50 }; // default
    }
    
    // Use first dominant color
    const rgb = hexToRgb(dominantColors[0]);
    if (!rgb) {
        return { h: 0, s: 0, v: 50 };
    }
    
    return rgbToHsv(rgb.r, rgb.g, rgb.b);
}

// ============================================
// 8. Improved matching function
// ============================================
function findBestArtwork(photoHSV, photoAnalysis, artworksData, selectedCategory) {
    const categoryData = artworksData.categories[selectedCategory];
    
    if (!categoryData || !categoryData.artworks) {
        console.error('Invalid category:', selectedCategory);
        return null;
    }
    
    let bestMatch = null;
    let bestScore = -Infinity;
    
    categoryData.artworks.forEach(artwork => {
        // Get artwork color and brightness from dominantColors
        const artworkHSV = getArtworkHSV(artwork.dominantColors);
        const artworkBrightness = calculateArtworkBrightness(artwork.dominantColors);
        
        // 1. Color similarity (60% weight)
        const colorDistance = calculateHSVDistance(photoHSV, artworkHSV);
        let colorScore = (100 - colorDistance) * 0.6;
        
        // 2. Brightness similarity (20% weight)
        const brightnessDiff = Math.abs(photoAnalysis.brightness - artworkBrightness);
        let brightnessScore = (100 - brightnessDiff) * 0.2;
        
        // 3. Orientation matching bonus (20% weight)
        let orientationBonus = 0;
        if (photoAnalysis.orientation === artwork.orientation) {
            orientationBonus = 20;
        }
        
        // 4. Additional heuristic bonus
        let heuristicBonus = 0;
        
        // Dark photo + Dark artwork = bonus
        if (photoAnalysis.brightness < 40 && artworkBrightness < 40) {
            heuristicBonus += 8;
        }
        
        // Bright photo + Bright artwork = bonus
        if (photoAnalysis.brightness > 70 && artworkBrightness > 70) {
            heuristicBonus += 8;
        }
        
        // Calculate final score
        const finalScore = colorScore + brightnessScore + orientationBonus + heuristicBonus;
        
        if (finalScore > bestScore) {
            bestScore = finalScore;
            bestMatch = artwork;
        }
    });
    
    return bestMatch;
}

// ============================================
// 9. Main function
// ============================================
function selectArtworkForPhoto(imageElement, artworksData, selectedCategory) {
    // 1. Extract color
    const photoHSV = extractDominantColor(imageElement);
    
    // 2. Analyze photo
    const photoAnalysis = analyzePhoto(imageElement);
    
    // 3. Find best match
    const bestArtwork = findBestArtwork(photoHSV, photoAnalysis, artworksData, selectedCategory);
    
    if (bestArtwork) {
        console.log('=== Photo Analysis ===');
        console.log('HSV:', photoHSV);
        console.log('Brightness:', Math.round(photoAnalysis.brightness));
        console.log('Orientation:', photoAnalysis.orientation);
        console.log('=== Selected Artwork ===');
        console.log('ID:', bestArtwork.id);
        console.log('Title:', bestArtwork.title);
        console.log('Style:', bestArtwork.style);
        console.log('======================');
    }
    
    return bestArtwork;
}

// ============================================
// 10. Export (ES6 modules)
// ============================================
export {
    rgbToHsv,
    hexToRgb,
    calculateHSVDistance,
    extractDominantColor,
    analyzePhoto,
    calculateArtworkBrightness,
    getArtworkHSV,
    findBestArtwork,
    selectArtworkForPhoto
};
