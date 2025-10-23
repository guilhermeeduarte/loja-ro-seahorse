import React, { useState } from 'react'

const ImagePreview = () => {
  const [images, setImages] = useState([])

  const handleChange = (e) => {
    const files = Array.from(e.target.files)
    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(readers).then((results) => setImages(results))
  }

  return (
    <div className="campos-formulario">
      <input
        type="file"
        name="imagem"
        id="imagem"
        className="form-control"
        accept="image/*"
        multiple
        onChange={handleChange}
      />
      <div className="preview-container">
        {images.map((src, index) => (
          <img key={index} src={src} alt={`preview-${index}`} />
        ))}
      </div>
    </div>
  )
}

export default ImagePreview
