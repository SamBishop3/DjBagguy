// This function runs when the page finishes loading
window.onload = function () {
    console.log("JavaScript is running");

    // Array of video file paths for the background videos
    const videos = [
        '../assets/videos/bagguyclip1.mp4',
        '../assets/videos/bagguyclip3.mp4',
        '../assets/videos/bagguycolors.mp4',
    ];

    let currentVideoIndex = -1;

    // Get the video element by its ID ('background-video')
    const videoElement = document.getElementById('background-video');

    if (videoElement) {
        // Ensure autoplay works on all devices
        videoElement.autoplay = true;
        videoElement.muted = true;
        videoElement.playsInline = true; // Required for mobile autoplay

        // Function to change the video source randomly when the current video ends
        const playNextVideo = () => {
            let nextVideoIndex;

            // Pick a random video, ensuring it's different from the last one
            do {
                nextVideoIndex = Math.floor(Math.random() * videos.length);
            } while (nextVideoIndex === currentVideoIndex);

            currentVideoIndex = nextVideoIndex; // Update current video index
            videoElement.src = videos[currentVideoIndex]; // Change video source

            videoElement.play().catch(error => {
                console.log("Autoplay failed:", error); // Handle any autoplay errors
            });
        };

        // Load and play the first video immediately
        currentVideoIndex = Math.floor(Math.random() * videos.length); // Pick a random starting video
        videoElement.src = videos[currentVideoIndex];
        videoElement.play().catch(error => console.log("Initial autoplay failed:", error));

        // When the current video ends, load a new one at random
        videoElement.addEventListener('ended', playNextVideo);
    } else {
        console.error("Video element not found!"); // Log an error if video element isn't found
    }

    // Handle the unmute button toggle functionality
    const unmuteButton = document.getElementById('unmute-button');
    if (unmuteButton) {
        unmuteButton.addEventListener('click', function () {
            if (videoElement.muted) {
                videoElement.muted = false; // Unmute the video
                unmuteButton.textContent = 'Mute'; // Update button text to 'Mute'
            } else {
                videoElement.muted = true; // Mute the video
                unmuteButton.textContent = 'Unmute'; // Update button text to 'Unmute'
            }
        });
    } else {
        console.error("Unmute button not found!"); // Log an error if unmute button isn't found
    }
};

