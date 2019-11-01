const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
const $sidebar = document.querySelector("#sidebar");

const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const autoscroll = () => {
  const $newMessage = $messages.lastElementChild;

  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = $messages.offsetHeight;
  const containerHeight = $messages.scrollHeight;
  const scrollOffet = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffet) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

socket.on("message", ({ username, text, createdAt }) => {
  const html = Mustache.render(messageTemplate, {
    username,
    message: text,
    createdAt: moment(createdAt).format("h:mm A")
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", ({ username, url, createdAt }) => {
  const html = Mustache.render(locationTemplate, {
    username,
    url,
    createdAt: moment(createdAt).format("h:mm A")
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  $sidebar.innerHTML = html;
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
