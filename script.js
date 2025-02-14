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
        // Set the first video source immediately (for Safari autoplay)
        videoElement.src = videos[0];
        videoElement.load(); // Load the video
        videoElement.muted = true; // Ensure muted for autoplay

        // Attempt to play the video and catch any errors
        videoElement.play().then(() => {
            console.log("Video playing");
        }).catch(error => {
            console.log("Autoplay blocked:", error); // Log any autoplay errors
        });

        // Function to change the video source when the current video ends
        const playNextVideo = () => {
            let nextVideoIndex;

            // Shuffle and ensure it's a different video each time
            do {
                nextVideoIndex = Math.floor(Math.random() * videos.length); // Pick random video
            } while (nextVideoIndex === currentVideoIndex); // Ensure it's not the same as the previous video

            currentVideoIndex = nextVideoIndex; // Update current video index
            videoElement.src = videos[currentVideoIndex]; // Change the video source
            videoElement.load(); // Load the new video
            videoElement.muted = true; // Mute video for autoplay

            // Attempt to play the video and catch any errors
            videoElement.play().catch(error => {
                console.log("Autoplay failed:", error); // Log any autoplay errors
            });
        };

        // Event listener for when the current video ends
        videoElement.addEventListener('ended', playNextVideo);

        // Start by playing the first video
        playNextVideo();
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

// Form Submission with Fetch API (to avoid page reload)
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission (page reload)

        const formData = new FormData(form); // Create FormData from the form

        // Show a loading message while submitting
        alert("Submitting your booking request...");

        // Send the form data via Fetch API
        fetch('http://djbagguy.com:5001/submit_booking', {  // Updated URL to match the Flask route
            method: 'POST', 
            body: formData, // Send form data as the request body
        })
        .then(response => {
            if (response.ok) {
                alert("Thank you! Your booking request has been sent.");
                form.reset(); // Clear the form fields after successful submission
            } else {
                alert("There was an error. Please try again.");
            }
        })
        .catch(error => {
            console.error("Submission failed:", error); // Log any errors
            alert("Failed to send the request. Please check your network connection.");
        });
    });
} else {
    console.error("Form element not found!"); // Log an error if form element isn't found
}
