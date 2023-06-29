function playSound(linkSoundFile, timeToDelete){
	let sound = document.createElement("audio");
	sound.setAttribute("src", linkSoundFile);
	document.querySelector("body").append(sound);
	sound.play();
	
	setTimeout(() => sound.remove(), timeToDelete);
}