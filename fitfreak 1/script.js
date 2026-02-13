document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', function(event) {
      event.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      document.getElementById(targetId).scrollIntoView({
          behavior: 'smooth'
      });
  });
});
function openLoginPopup() {
    document.getElementById("loginPopup").style.display = "flex";
}

function closeLoginPopup() {
    document.getElementById("loginPopup").style.display = "none";
}

function toggleChat() {
    let chatbot = document.getElementById("chatbot");
    chatbot.style.display = (chatbot.style.display === "flex") ? "none" : "flex";
}

function sendMessage(event) {
    if (event.key === "Enter") {
        let input = document.getElementById("user-input").value.toLowerCase();
        let chatbox = document.getElementById("chatbox");
        
        chatbox.innerHTML += "<p><strong>You:</strong> " + input + "</p>";
        
        let response = getResponse(input);
        chatbox.innerHTML += "<p><strong>Bot:</strong> " + response + "</p>";

        document.getElementById("user-input").value = "";
        chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll chatbox
    }
}

function getResponse(input) {
    if (input.includes("hello") || input.includes("hi")) return "Hello! How can I help you with your fitness journey? 😊";
    if (input.includes("yoga")) return "Yoga is great for flexibility and stress relief! What type of yoga are you interested in? 🧘";
    if (input.includes("weight loss")) return "For weight loss, I recommend Surya Namaskar, plank, and HIIT workouts. Want a detailed plan? 💪";
    if (input.includes("diet")) return "A balanced diet includes proteins, healthy fats, and good carbs. Are you looking for a specific diet plan? 🍏";
    if (input.includes("workout")) return "Daily workouts improve strength & endurance! What's your fitness goal? 🔥";
    if (input.includes("stress")) return "Try meditation and deep breathing exercises like Anulom Vilom. They help reduce stress naturally. 🧘‍♂️";
    if (input.includes("muscle gain")) return "Focus on strength training and protein intake! Squats, deadlifts, and push-ups are great. 💪";
    if (input.includes("back pain")) return "Try Cat-Cow, Cobra Pose, and Child’s Pose for back pain relief. Would you like a full routine? 🏋️";
    
    return "I'm still learning! Ask me about fitness, yoga, diet, or workouts. 😊";
}

const reviews = document.querySelectorAll(".review__content");
const prevBtn = document.getElementById("prev-review");
const nextBtn = document.getElementById("next-review");
let currentIndex = 0;

function showReview(index) {
  reviews.forEach((review, i) => {
    if (i === index) {
      review.classList.add("active");
    } else {
      review.classList.remove("active");
    }
  });
}
showReview(currentIndex);

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % reviews.length;
  showReview(currentIndex);
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
  showReview(currentIndex);
});

