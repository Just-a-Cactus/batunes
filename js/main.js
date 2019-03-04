;
(function () {
	"use strict";

	const xhr = new XMLHttpRequest();
	const loader = document.querySelector('.preloader-wrapper');

	const tunesList = document.querySelector('.ba-tunes-list'),
		tunesTmpl = document.querySelector('#tune-tmpl').innerHTML;
	let tunesListHTML;
	const form = document.querySelector('.ba-search-form');
	let query, url;

	form.addEventListener('submit', function (e) {
		e.preventDefault();

		//clear previouse search result
		tunesList.innerHTML = '';
		loader.classList.add('active');

		query = form['search-query'].value;
		url = `http://itunes.apple.com/search?term=${query}&limit=12`;

		xhr.open('GET', url);
		xhr.send();
	});

	tunesList.addEventListener('click', function (e) {

		e.preventDefault();
		let action = e.target.dataset.action;

		if (action !== 'play') return;

		let audioId = e.target.dataset.id;
		let audio = document.getElementById(audioId);

		e.target.classList.toggle('pulse');

		audio.paused ? audio.play() : audio.pause();

		const allAudio = document.querySelectorAll('audio');
		allAudio.forEach(e => {
			if (e !== audio)
				e.pause();

		});

		const allPlayButtons = document.querySelectorAll('[data-action="play"]');
		allPlayButtons.forEach(ee => {
			if (ee != e.target)
				ee.classList.remove('pulse');
		});

	})

	xhr.onload = function () {
		const data = JSON.parse(this.response);
		const tunes = data.results;

		tunesListHTML = "";

		tunes.forEach(element => {
			tunesListHTML += tunesTmpl
				.replace(/{{artistName}}/ig, element.artistName)
				.replace(/{{trackName}}/ig, element.trackName)
				.replace(/{{collectionName}}/ig, element.collectionName)
				.replace(/{{primaryGenreName}}/ig, element.primaryGenreName)
				.replace(/{{collectionViewUrl}}/ig, element.collectionViewUrl)
				.replace(/{{collectionPrice}}/ig, element.collectionPrice)
				.replace(/{{duration}}/ig, msToTime(element.trackTimeMillis))
				.replace(/{{artworkUrl100}}/ig, element.artworkUrl100.replace('100x100', '600x600'))
				.replace(/{{previewUrl}}/ig, element.previewUrl)
				.replace(/{{trackId}}/ig, element.trackId);
		});
		setTimeout(() => {
			loader.classList.remove('active');
			tunesList.innerHTML = tunesListHTML;
		}, 1000);
	}

	function msToTime(duration) {
		var milliseconds = parseInt((duration % 1000) / 100),
			seconds = parseInt((duration / 1000) % 60),
			minutes = parseInt((duration / (1000 * 60)) % 60),
			hours = parseInt((duration / (1000 * 60 * 60)) % 24);

		hours = (hours < 10) ? "0" + hours : hours;
		minutes = (minutes < 10) ? "0" + minutes : minutes;
		seconds = (seconds < 10) ? "0" + seconds : seconds;

		return minutes + ":" + seconds;
	}

})();