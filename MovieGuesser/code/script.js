const apiKey = 'ApiKey';
const url = 'https://www.omdbapi.com/';

let score = 0;

async function fetchMovie() {
    let movie;
    while (!movie) {
        const randomYear = Math.floor(Math.random() * (2024 - 1900 + 1)) + 1900;
        const response = await fetch(`${url}?s=award&y=${randomYear}&apikey=${apiKey}`);
        const data = await response.json();
        if (data.Search && data.Search.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.Search.length);
            movie = data.Search[randomIndex];
            const movieDetails = await fetch(`${url}?i=${movie.imdbID}&apikey=${apiKey}`);
            const details = await movieDetails.json();
            if (details.Awards && details.Awards !== "N/A") {
                movie = details;
            } else {
                movie = null;
            }
        }
    }
    return movie;
}

function calculateAwards(awardsStr) {
    const regex = /(\d+)\s(nomination|win)/gi;
    let totalAwards = 0;
    let match;
    while ((match = regex.exec(awardsStr)) !== null) {
        totalAwards += parseInt(match[1], 10);
    }
    return totalAwards;
}

async function initGame() {
    document.getElementById('result').style.display = 'none';
    const movie1 = await fetchMovie();
    const movie2 = await fetchMovie();
    displayMovie(movie1, '1');
    displayMovie(movie2, '2');
    document.getElementById('awards-movie-2').style.display = 'none';
}

function displayMovie(movie, id) {
    const totalAwards = calculateAwards(movie.Awards);
    document.getElementById(`movie-title-${id}`).textContent = movie.Title;
    document.getElementById(`awards-movie-${id}`).textContent = `Awards: ${totalAwards}`;
    document.querySelector(`.movie-${id} .movie-cover-${id}`).style.backgroundImage = `url(${movie.Poster})`;
}

async function guess(isMore) {
    const awards1 = parseInt(document.getElementById('awards-movie-1').textContent.split(': ')[1]);
    const awards2 = parseInt(document.getElementById('awards-movie-2').textContent.split(': ')[1]);
    const correctGuess = (isMore && awards2 > awards1) || (!isMore && awards2 < awards1);
    
    if (correctGuess) {
        score++;
        document.getElementById('score').textContent = score;
        await moveToMovie1();
    } else {
        document.getElementById('result').style.display = 'block';
    }
}

async function moveToMovie1() {
    document.getElementById('awards-movie-2').style.display = 'none';
    const movie1Title = document.getElementById('movie-title-1').textContent;
    const movie2 = await fetchMovie();
    displayMovie(movie2, '2');
    document.getElementById('awards-movie-2').style.display = 'none';
    document.getElementById('movie-title-1').textContent = movie1Title;
}

function tryAgain() {
    score = 0;
    document.getElementById('score').textContent = score;
    initGame();
}

initGame();
