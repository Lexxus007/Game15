function startStopwatch(){
	if (!stopwatchHandler){
		stopwatchHandler = setInterval(() => {
			stopwatchCounter++;
			timeCountField.innerHTML = makeMinutesSecondsTimeFormat(stopwatchCounter);
		}, 1000);
	}
}

function stopStopwatch(){
	clearInterval(stopwatchHandler);
	stopwatchHandler = null;
}

function resetStopwatch(){
	clearInterval(stopwatchHandler);
	stopwatchHandler = null;
	timeCountField.innerHTML = "00:00";
	stopwatchCounter = 0;
}

function makeMinutesSecondsTimeFormat(nemberOfSeconds){
	let seconds = nemberOfSeconds % 10;
	let dozensSeconds = (nemberOfSeconds % 60 - seconds) / 10;
	let minutes = (nemberOfSeconds % 600 - dozensSeconds * 10 - seconds) / 60;
	let dozensMinutes = (nemberOfSeconds - minutes * 60 - dozensSeconds * 10 - seconds) / 600;
	return `${dozensMinutes}${minutes}:${dozensSeconds}${seconds}`;
}