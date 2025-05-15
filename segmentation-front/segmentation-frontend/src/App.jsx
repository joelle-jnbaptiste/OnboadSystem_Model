import React, { useState } from 'react'
import './App.css'

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [resultImage, setResultImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0])
    setResultImage(null)
  }

  const handleSubmit = async () => {
    if (!selectedImage) return

    const formData = new FormData()
    formData.append('file', selectedImage)

    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      })

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setResultImage(imageUrl)
    } catch (error) {
      console.error('Erreur lors de la requête :', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Segmentation d'image</h1>

      <input type="file" onChange={handleImageChange} accept="image/*" />
      <button onClick={handleSubmit} disabled={loading || !selectedImage}>
        {loading ? 'Traitement...' : 'Envoyer'}
      </button>

      {selectedImage && (
        <div>
          <h3>Image sélectionnée :</h3>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Image sélectionnée"
            width="300"
          />
        </div>
      )}

      {resultImage && (
        <div>
          <h3>Résultat :</h3>
          <img src={resultImage} alt="Image segmentée" width="300" />
          <a href={resultImage} download="result.png">
            Télécharger l’image
          </a>
        </div>
      )}
    </div>
  )
}

export default App
