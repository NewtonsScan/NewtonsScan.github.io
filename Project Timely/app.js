// create constants form the form
const newEventFormEl = document.getElementsByTagName("form")[0];
const startDateInputEl = document.getElementById("start-date");
const eventNameInputEl =document.getElementById("event-name");

// Listen to form submissions
newEventFormEl.addEventListener("submit", (event) => {
    //Prevent the form from submitting to the server to keep things clientside
    console.log("submit registered");
    event.preventDefault();

    //Get start date from the form
    const startDate = startDateInputEl.value;
    console.log(`startDate = ${startDate}`);
    const eventName = eventNameInputEl.value;
    console.log(`eventName = ${eventName}`);

    //Storing the new Event in clientside storage
    storeNewEvent(eventName, startDate)

    //refreshUI
    renderEvents();

    //Reset form
    newEventFormEl.reset();
})

//Add the sorage Key as an app-wide constant

const STORAGE_KEY = "timely";

function storeNewEvent(eventName, startDate) {
    
    //Get data from Storage
    const events = getAllStoredEvents();

    //Add new event to the end of event objects
    events.push({eventName, startDate});

    //Sort the array by dates from new to old
    events.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    //send the updated array back to storage
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function getAllStoredEvents() {
    //Get the string of event data from local Storage
    const data = window.localStorage.getItem(STORAGE_KEY);

    //If nothing stored default to empty, else return parded JSON
    const events = data ? JSON.parse(data): [];

    return events;
}

const pastEventsContainer = document.getElementById("past-events");

function renderEvents(){
    //get local storage
    const events = getAllStoredEvents();

    //if empty exit
    if (events.length === 0) {return;}

    //Clear section
    pastEventsContainer.textContent = "";

    const pastEventsHeader = document.createElement("h2");
    pastEventsHeader.textContent = "Stored Events";

    const listEvents = document.createElement('ul');

    //Loop over all Events and render
    events.forEach((event) => {
        const eventEl = document.createElement("li");
        eventEl.textContent = `${event.eventName} - ${formatDate(event.startDate)}`;
        listEvents.appendChild(eventEl);
    });

    pastEventsContainer.appendChild(pastEventsHeader);
    pastEventsContainer.appendChild(listEvents);
}

function formatDate(dataString) {
    //Convert string to date object
    const date = new Date(dateString);

    return date.toLocaleDateString();
}

renderEvents();