import { useState, useEffect } from 'react';
import './App.css';

const useImageURL = () => {
  const [imageURLs, setImageURLs] = useState([null, null]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Realizar ambas solicitudes simultáneamente utilizando Promise.all
        const responses = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/photos/1", { mode: "cors" }),
          fetch("https://jsonplaceholder.typicode.com/photos/2", { mode: "cors" })
        ]);

        // Esto permite lanzar un mensaje de error en dado caso no carguen las imagenes
        const jsonResponses = await Promise.all(responses.map(response => {
          if (!response.ok) {
            throw new Error("Server error!!");
          }
          return response.json();
        }));

        // Obtenemos las imagenes y extraemos las url de las respuestas
        setImageURLs(jsonResponses.map(response => response.url));

        // Finalizar el estado de carga
        setLoading(false);
      } catch (error) {
        // Control de errores
        setError(error);
        setLoading(false);
      }
    };

    // Llamar a la función ya que todo esta definido
    fetchImages();
  }, []);

  return { imageURLs, error, loading };
};

function App() {
  const { imageURLs, error, loading } = useImageURL();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>A network error was encountered!</p>;

  return (
    <>
      <h1>Images</h1>
      <div className="images-container">
        {imageURLs.map((url, index) => (
          <div key={index} className="image-wrapper">
            <img src={url} alt={`Image ${index}`} />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;

