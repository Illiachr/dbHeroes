const dbUrl = './db/dbHeroes.json';
export let arrOfObj = [];

export const getData = () => {
    fetch(dbUrl)
        .then(res => {
            if (res.status !== 200) { throw new Error(`Network status isn't 200`); }
            return res.json();
        })
        .then(data => arrOfObj = data)
        .catch(err => console.log(err));
};

getData();

