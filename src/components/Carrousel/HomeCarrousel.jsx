import React from 'react';
import imagen from '../../assets/img/Logo_web.png';

const images = [
    { src: imagen, alt: "Usuarios", caption: "Gestione sus usuarios fácilmente." },
    { src: imagen, alt: "Ventas", caption: "Aumente sus ventas con nuestro sistema." },
    { src: imagen, alt: "Compras", caption: "Controle sus compras de manera eficiente." },
    { src: imagen, alt: "Rentabilidad", caption: "Analice su rentabilidad en tiempo real." },
    { src: imagen, alt: "Informes", caption: "Genere informes detallados." }
];

const HomeCarrousel = () => {
    return (
        <div className="carousel-wrapper">
            {/* Carrusel */}
            <div id="carouselExampleIndicators" className="carousel slide carousel-container" data-bs-ride="carousel">
                {/* Indicadores */}
                <div className="carousel-indicators">
                    {images.map((_, index) => (
                        <button key={index} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index} className={index === 0 ? "active" : ""} aria-label={`Slide ${index + 1}`}></button>
                    ))}
                </div>

                {/* Contenido del Carrusel */}
                <div className="carousel-inner">
                    {images.map((image, index) => (
                        <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                            <img src={image.src} className="d-block w-100" alt={image.alt} />
                            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-2 rounded">
                                <h5>{image.alt}</h5>
                                <p>{image.caption}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controles de Navegación */}
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Anterior</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Siguiente</span>
                </button>
            </div>

            {/* Frase debajo del carrusel */}
            <div className="carousel-text text-center">
                <h4>"Road es el website número uno para el manejo de finanzas de emprendedores."</h4>
            </div>
        </div>
    );
}

export default HomeCarrousel;