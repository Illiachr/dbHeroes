// import { arrOfObj } from './modules/getData.js';

const heroLayout = document.getElementById('hero-layout'),
    filterBar = document.getElementById('filter-bar'),
    dbUrl = './db/dbHeroes.json';
//let arrOfObj = [];

const gridLayOut = arrOfObj => {
    arrOfObj.forEach(hero => {
        heroLayout.insertAdjacentHTML('beforeend', `
        <div class="hero-cell" data-name=${hero.name.replace(/\s/g, '_')}>
            <div class="hero-logo">
                <img src="./db/${hero.photo}" alt=${hero.name} class="hero-logo">
                <span></span>
            </div>
            <div class="hero-dscr">
                <h2 class="hero-title">
                    ${hero.name}
                </h2>
                <ul>
                    <li>real name : ${hero.realName ? hero.realName : 'no data'}</li>
                    <li>gender: ${hero.gender}</li>
                    <li>citizenship: ${hero.citizenship ? hero.citizenship : 'no data'}</li>
                    <li>species: ${hero.species ? hero.species : 'no data'}</li>                    
                    <li>deathDay: ${hero.deathDay ? hero.deathDay : 'no data'}</li>
                    <li>status: ${hero.status}</li>
                    <li>actors: ${hero.actors}</li>
                </ul>
                <div class="movies">
                    <h3 class="movies-title">
                        movies
                    </h3>
                    <ul class="hero-movies">                        
                    </ul>
                </div>
            </div>
            <!-- /.hero-dscr -->
        </div>
        <!-- /.hero-cell -->
        `);
    });
};

const addMovies = arrOfObj => {
    document.querySelectorAll('.hero-cell').forEach(cell => {
        const heroName = cell.dataset.name.indexOf('_') > 0 ? cell.dataset.name.replace(/_/g, ' ') : cell.dataset.name;
        const movieList = cell.querySelector('.movies');
        const heroData = arrOfObj.find(obj => obj.name === heroName);
        heroData.movies ? heroData.movies.forEach(movie => {
            movieList.insertAdjacentHTML('beforeend', `<li>${movie}</li>`);
        }) : 'no movies';
    });
};

const pojectionReduce = meta => {
    const keys = Object.keys(meta);
    return obj => keys.reduce((newObj, key) => {
        newObj[key] = meta[key].reduce((val, fn, i) => (i ? fn(val) : obj[fn]), null);
        return newObj;
    }, {});
};

const addOptions = arrOfObj => {
    const manifest = {
        movies: ['movies', movies => (movies ? movies : 'no movies')]
    };
    const objProj = pojectionReduce(manifest);
    const arr = arrOfObj.map(objProj);
    const optionsMovie = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].movies !== 'no movies') {
            for (const key in arr[i]) {
                arr[i][key].forEach(item => {
                    if (!optionsMovie.includes(item)) { optionsMovie.push(item); }
                });
            }
        }
    }
    console.log(optionsMovie);
    filterBar.movie.appendChild(new Option('--', 'no'));
    optionsMovie.forEach(movie => {
        //const option = new Option(movie, movie);
        filterBar.movie.appendChild(new Option(movie, movie));
    });
};

fetch(dbUrl)
    .then(res => {
        if (res.status !== 200) { throw new Error(`Network status isn't 200`); }
        return res.json();
    })
    .then(data => {
        gridLayOut(data);
        addMovies(data);
        addOptions(data);
    })
    .catch(err => console.log(err));

filterBar.addEventListener('change', e => {
    const selectedMovie = e.target.value;
    console.log(selectedMovie);
    fetch(dbUrl)
        .then(res => {
            if (res.status !== 200) { throw new Error(`Network status isn't 200`); }
            return res.json();
        })
        .then(data => {
            const filteredData = data.filter(obj => {
                if (obj.movies) { return obj.movies.includes(selectedMovie); }
            });
            heroLayout.textContent = '';
            console.log(filteredData);
            gridLayOut(filteredData);
            addMovies(filteredData);
            e.target.textContent = '';
            addOptions(filteredData);
        })
        .catch(err => console.log(err));
});
