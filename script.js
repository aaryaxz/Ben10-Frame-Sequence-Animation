const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

// Frame configuration
const frames = {
    currentIndex: 0,
    maxIndex: 1612
}

let imageLoaded = 1
let images = []

// Preloader: Get the preloader element
const preloader = document.getElementById('preloader');
const squareContainer = document.getElementById('square-container');

// Preloader: Function to disable scrolling
function disableScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
}

// Preloader: Function to enable scrolling
function enableScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
}

// Load all images
function preLoadImage() {
    for (var i = 1; i <= frames.maxIndex; i++) {
        const imgUrl = `./Assets/frames/frame_${i.toString().padStart(4, "0")}.jpg`;
        const img = new Image();
        img.src = imgUrl;
        img.onload = () => {
            imageLoaded++;
            console.debug(imageLoaded)
            
            // Preloader: Update the loading progress
            const progress = (imageLoaded / frames.maxIndex) * 100;
            squareContainer.style.transform = `translateY(${100 - progress}%)`;
            
            if (imageLoaded === frames.maxIndex) {
                console.debug("All images loaded")
                loadImage(frames.currentIndex)
                startAnimation();
                
                // Preloader: Hide the preloader when all images are loaded
                setTimeout(() => {
                    preloader.style.display = 'none';
                    enableScroll(); // Re-enable scrolling
                }, 1000); // Delay to allow the animation to complete
            }
        }
        images.push(img)
    }
}

// Display image on canvas
function loadImage(index) {
    if (index >= 0 && index <= frames.maxIndex) {
        const img = images[index]

        // Set canvas size
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        // Calculate scale
        scaleX = canvas.width / img.width
        scaleY = canvas.height / img.height
        scale = Math.max(scaleX, scaleY)

        // Calculate new dimensions
        const newWidth = img.width * scale
        const newHeight = img.height * scale

        // Center image
        const offsetX = (canvas.width - newWidth) / 2
        const offsetY = (canvas.height - newHeight) / 2
        
        // Clear and draw image
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.imageSmoothingEnabled = true
        context.imageSmoothingQuality = "high"
        context.drawImage(img, offsetX, offsetY, newWidth, newHeight)
    }
}

// Set up GSAP animation
function startAnimation() {
    var tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#main #parent",
            start: "top top",
            scrub: 0.7,
            end: "bottom bottom"
        }
    })

    tl.to(frames, {
        currentIndex: frames.maxIndex-1,
        onUpdate: function () {
            console.log(`Current Index ${Math.floor(frames.currentIndex)}`)
            loadImage(Math.floor(frames.currentIndex))
        }
    })
}

// Handle window resize
window.addEventListener("resize", function(){
    loadImage(frames.currentIndex)
})

// Preloader: Show the preloader and disable scrolling before starting to load images
preloader.style.display = 'flex';
disableScroll();

// Start loading images
preLoadImage()