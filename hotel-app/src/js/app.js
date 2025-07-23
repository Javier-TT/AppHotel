const API_URL = 'https://d8aeba5b-65e8-48d5-8a78-a74f53ec2e9c.mock.pstmn.io/hotels';

const contenedor = document.getElementById('contenedor-hoteles');
const selectCategoria = document.getElementById('categoria');
const contador = document.getElementById('contador');

let hoteles = [];
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

console.log(localStorage.getItem(favoritos))

// Función para limitar la longitud del texto
function limitarDescripcion(texto, maxLength = 200) {
  if (!texto) return 'Sin descripción';
  if (texto.length <= maxLength) return texto;
  return texto.substring(0, maxLength) + '...';
}

//carga de la vista(obtiene info)
document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch(API_URL);
  hoteles = await response.json();
  renderizarHoteles(hoteles);
});

//filtro
selectCategoria.addEventListener('change', () => {
  const seleccion = selectCategoria.value;
  let filtrados = seleccion === 'all'
    ? hoteles
    : hoteles.filter(h => h.category.number == seleccion);
  renderizarHoteles(filtrados);
});


function renderizarHoteles(lista) {
  contenedor.innerHTML = '';
  lista.forEach(hotel => {
    const esFavorito = favoritos.includes(hotel.id);
    const tarjeta = document.createElement('div');
    tarjeta.className = 'card';

    const imagen = hotel.gallery?.[0]?.uri || './assets/images/NUllimagen.png';

    // Limitar la descripción
    const descripcionCorta = limitarDescripcion(hotel.description, 200);
    
    tarjeta.innerHTML = `
      ${esFavorito ? '<div class="favorito">Favorito</div>' : ''}
      <img src="${imagen}" alt="${hotel.name}" />
      <h3>${hotel.name}</h3>
      <p><strong>${hotel.address.city}</strong></p>
      <p>${'★'.repeat(hotel.category.number)}</p>
      <p class="descripcion">${descripcionCorta}</p>
      <button onclick="toggleFavorito(${hotel.id})">
        ${esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      </button>
    `;

    contenedor.appendChild(tarjeta);  
  });

  const total = hoteles.length;
  const mostrados = lista.length;
  contador.textContent = `Hoteles mostrados: ${mostrados} / Total: ${total}`;
}


function toggleFavorito(id) {
  const index = favoritos.indexOf(id);
  if (index === -1) {
    favoritos.push(id);
  } else {
    favoritos.splice(index, 1);
  }
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  renderizarHoteles(
    selectCategoria.value === 'all'
      ? hoteles
      : hoteles.filter(h => h.category == selectCategoria.value)
  );
}
