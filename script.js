document.addEventListener('DOMContentLoaded', () => {
	'use strict';

	const select = document.getElementById('cars'),
		output = document.getElementById('output');

	select.value = 'no';

	const getData = () => new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.open('GET', './cars.json');
			request.setRequestHeader('Content-type', 'application/json');
			request.send();
			request.addEventListener('readystatechange', () => {
				if (request.readyState !== 4) { return; }
				if (request.status === 200) {
					const response = JSON.parse(request.responseText);
					resolve(response);
				} else {
					reject(); // output.innerHTML = 'Произошла ошибка';
				}
			});
		}),

		dataOutput = data => {
			data.cars.forEach(item => {
				if (item.brand === select.value) {
					const { brand, model, price } = item;
					output.innerHTML = `Тачка ${brand} ${model} <br>
                        Цена: ${price}$`;
				}
			});
		},

		handler = () => {
			getData()
				.then(dataOutput)
				.catch(() => output.innerHTML = 'Произошла ошибка');
		};

	select.addEventListener('change', handler);

});
