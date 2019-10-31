const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

socket.on("message", ({ text, createdAt }) => {
  const html = Mustache.render(messageTemplate, {
    message: text,
    createdAt: moment(createdAt).format("h:mm:ss A")
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", ({ url, createdAt }) => {
  const html = Mustache.render(locationTemplate, {
    url,
    createdAt: moment(createdAt).format("h:mm:ss A")
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", e => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", true);
  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, error => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) {
      console.log(error);
    }
  });
});

$sendLocationButton.addEventListener("click", e => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  $sendLocationButton.setAttribute("disabled", true);

  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;

    socket.emit("sendLocation", { latitude, longitude }, () => {
      $sendLocationButton.removeAttribute("disabled");
      console.log("Location shared!");
    });
  });
});
