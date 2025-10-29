// Vercel Serverless Function for Style Transfer
export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { image, styleImage, strength = 0.85, guidance_scale = 15 } = req.body

    if (!image || !styleImage) {
      return res.status(400).json({ error: 'Image and style image are required' })
    }

    // Hugging Face API Token (환경변수에서 가져오기)
    const HF_TOKEN = process.env.HUGGING_FACE_TOKEN

    if (!HF_TOKEN) {
      return res.status(500).json({ error: 'Hugging Face token not configured' })
    }

    // 이미지를 base64에서 buffer로 변환
    const imageBuffer = Buffer.from(image.split(',')[1], 'base64')
    
    // 스타일 이미지 로드 (서버의 public 폴더에서)
    const styleImagePath = `${process.cwd()}/public${styleImage}`
    const fs = require('fs')
    let styleBuffer
    
    try {
      styleBuffer = fs.readFileSync(styleImagePath)
    } catch (error) {
      console.error('Style image not found:', styleImagePath)
      return res.status(404).json({ error: 'Style image not found' })
    }

    // Hugging Face API 호출
    const API_URL = 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5'
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          image: imageBuffer.toString('base64'),
          style_image: styleBuffer.toString('base64')
        },
        parameters: {
          strength: strength,
          guidance_scale: guidance_scale,
          negative_prompt: 'photo, realistic, photograph, camera, low quality, blurry'
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Hugging Face API error:', errorText)
      
      // 모델 로딩 중인 경우
      if (response.status === 503) {
        return res.status(503).json({ 
          error: 'Model is loading, please try again in a few seconds',
          retry_after: 20 
        })
      }
      
      throw new Error(`API error: ${response.status}`)
    }

    // 결과 이미지를 base64로 변환
    const resultBuffer = await response.arrayBuffer()
    const base64Result = Buffer.from(resultBuffer).toString('base64')
    const resultImage = `data:image/jpeg;base64,${base64Result}`

    return res.status(200).json({ 
      success: true,
      output: resultImage 
    })

  } catch (error) {
    console.error('Style transfer error:', error)
    return res.status(500).json({ 
      error: 'Style transfer failed',
      details: error.message 
    })
  }
}
