document.addEventListener('DOMContentLoaded', () => {
  const filmTitle = document.getElementById('film-title');
  const filmPoster = document.getElementById('film-poster');
  const filmRuntime = document.getElementById('film-runtime');
  const filmShowtime = document.getElementById('film-showtime');
  const filmTickets = document.getElementById('film-tickets');
  const filmDescription = document.getElementById('film-description');
  const filmsList = document.getElementById('films');
  const buyTicketButton = document.getElementById('buy-ticket');
  let currentFilmId = 1;
  
  // Function to update movie details
  function updateMovieDetails(data) {
    filmTitle.textContent = data.title;
    filmPoster.src = data.poster;
    filmRuntime.textContent = `Runtime: ${data.runtime} minutes`;
    filmShowtime.textContent = `Showtime: ${data.showtime}`;
    const availableTickets = data.capacity - data.tickets_sold;
    filmTickets.textContent = `Tickets available: ${availableTickets}`;
    filmDescription.textContent = data.description;
    buyTicketButton.disabled = availableTickets === 0;
  }

  // Fetch the first movie details
  fetch('http://localhost:3000/films/1')
    .then(response => response.json())
    .then(data => {
      updateMovieDetails(data);
    })
    .catch(error => console.error('Error:', error));

  // Fetch all movies 
  fetch('http://localhost:3000/films')
    .then(response => response.json())
    .then(data => {
      data.forEach(film => {
        const li = document.createElement('li');
        li.textContent = film.title;
        li.classList.add('film-item');
        li.addEventListener('click', () => {
          currentFilmId = film.id;
          fetchFilmDetails(currentFilmId);
        });
        filmsList.appendChild(li);
      });
    })
    .catch(error => console.error('Error:', error));

  // Function to fetch and display movie details
  function fetchFilmDetails(filmId) {
    fetch(`http://localhost:3000/films/${filmId}`)
      .then(response => response.json())
      .then(data => {
        updateMovieDetails(data);
      })
      .catch(error => console.error('Error:', error));
  }

  // Buy ticket button click event handler
  buyTicketButton.addEventListener('click', () => {
    fetch(`http://localhost:3000/films/${currentFilmId}`)
      .then(response => response.json())
      .then(data => {
        const availableTickets = data.capacity - data.tickets_sold;
        if (availableTickets > 0) {
          return fetch(`http://localhost:3000/films/${currentFilmId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              tickets_sold: data.tickets_sold + 1
            })
          });
        } else {
          throw new Error('No tickets available');
        }
      })
      .then(response => response.json())
      .then(data => {
        updateMovieDetails(data);
      })
      .catch(error => console.error('Error:', error));
  });
});
