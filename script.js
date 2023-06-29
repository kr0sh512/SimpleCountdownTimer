function setCookie(cname, cvalue, date = 365) {
    const d = new Date();
    d.setTime(d.getTime() + (date * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    return;
}

function updateCookies() {
    let cookie = decodeURIComponent(document.cookie).split(';');
    for (let i = 0; i < cookie.length; i++) {
        line = cookie[i].split("=");
        if (line[0].indexOf("Timer") >= 0) {
            setCookie(line[0].slice(1, line[0].length), line[1], -1);
        }
    }

    let list_cards = Array.from(document.getElementsByClassName("card")).slice(0, -1);
    for (let i = 0; i < list_cards.length; i++) {
        let elements_card = list_cards[i].getElementsByTagName("div")[0];
        let name_timer = elements_card.getElementsByTagName("div")[0].textContent;
        let date_timer = elements_card.getElementsByTagName("div")[2].getElementsByTagName("span")[0].textContent;
        setCookie("Timer" + i, date_timer + "&" + name_timer);
    }
    return;
}

function loadTimersFromCookies() {
    let cookie = decodeURIComponent(document.cookie).split(';');
    for (let i = 0; i < cookie.length; i++) {
        let line = cookie[i].split("=");
        if (line[0].indexOf("Timer") >= 0) {
            createTimer(new Date(line[1].split('&')[0]), line[1].split('&')[1]);
        }
    }
    return;
}

function createTimer(end_date, description) {
    var card = document.createElement("div");
    card.className = "card";

    var name_field = document.createElement("div");
    name_field.id = "name";
    name_field.innerHTML = description;

    var timer = document.createElement("div");
    timer.id = "timer"
    timer.innerHTML = "<p>0<span id=name-date>h</span> 0<span id=name-date>m</span> 0<span id=name-date>s</span></p>";

    var date = document.createElement("div");
    date.id = "date"
    date.innerHTML = "<span hidden>" + end_date.toUTCString() + "</span>" +
        "<p>" + end_date.toLocaleDateString('ru') +
        " <span id=times>" + ((end_date.toLocaleTimeString('ru') == '00:00:00') ? '' : ("(" + end_date.toLocaleTimeString('ru').slice(0, 5) + ")")) + "</span></p>";
    setTimeout(function () {
        var countdown = setInterval(function () {
            var now = new Date();
            var remain = (end_date - now) / 1000;
            if (remain < 0) {
                timer.innerHTML = (timer.innerHTML == "--:--") ? "00:00" : "--:--";
                return;
            }
            var days = Math.floor(remain / (60 * 60 * 24));
            var hours = Math.floor((remain % (60 * 60 * 24)) / (60 * 60));
            var mins = Math.floor((remain % (60 * 60)) / (60));
            var secs = Math.floor(remain % (60));
            hours = hours < 10 ? "0" + hours : hours;
            mins = mins < 10 ? "0" + mins : mins;
            secs = secs < 10 ? "0" + secs : secs;
            timer.innerHTML = "<p>" + (days == 0 ? '' : days + "<span id=name-date>days</span> ") +
                hours + "<span id=name-date>h</span> " +
                mins + "<span id=name-date>m</span> " +
                secs + "<span id=name-date>s</span></p>";
        }, 1000);
    }, (1000 - new Date() % 1000) % 1000);
    var inner = document.createElement("div");
    inner.className = "inner";
    inner.appendChild(name_field);
    inner.appendChild(timer);
    inner.appendChild(date);
    card.appendChild(inner);
    var button = document.createElement("button");
    button.textContent = "Delete";
    button.onclick = function () {
        card.remove();
        updateCookies();
    }
    card.appendChild(button);
    document.body.insertBefore(card, document.getElementById('new'));
    console.log("new one");
    updateCookies();
    return;
}

var isAdd = false;
function clickCreate() {
    if (isAdd) {
        var label = document.getElementById('new').getElementsByTagName('input')[0];
        var select_time = document.getElementById('new').getElementsByTagName('input')[1];
        var select_date = document.getElementById('new').getElementsByTagName('input')[2];
        createTimer(new Date(select_date.value + 'T' + select_time.value), label.value);
        removeAddFields();
        isAdd = false;
        return;
    }
    isAdd = true;

    var label = document.createElement("input");
    label.type = "text";
    document.getElementById('new').children[0].insertBefore(label, add_button);
    label.focus();

    var select_time = document.createElement("input");
    select_time.type = "time";
    // select_time.value = realDate.toISOString().split('T')[1].slice(0, 5);
    select_time.value = '00:00';
    document.getElementById('new').appendChild(select_time);

    var select_date = document.createElement("input");
    select_date.type = "date";
    var realDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000 + 1000 * 60 * 60 * 24);
    select_date.value = realDate.toISOString().split('T')[0];
    document.getElementById('new').appendChild(select_date);

    var minus_button = document.createElement("button");
    minus_button.textContent = "—";
    minus_button.addEventListener("click", () => {
        removeAddFields();
        isAdd = false;
    });
    document.getElementById("new").appendChild(minus_button);

    add_button.innerText = 'Add';
    return;
}

function removeAddFields() {
    var label = document.getElementById('new').getElementsByTagName('input')[0];
    var select_time = document.getElementById('new').getElementsByTagName('input')[1];
    var select_date = document.getElementById('new').getElementsByTagName('input')[2];
    var minus_button = document.getElementById('new').getElementsByTagName('button')[1];
    add_button.innerText = '+';
    label.remove();
    select_time.remove();
    select_date.remove();
    minus_button.remove();
    return;
}

start_cards = document.getElementsByClassName('card');
while (start_cards.length > 1) start_cards[0].remove();

var add_button = document.getElementById('new').getElementsByTagName('button')[0];
add_button.addEventListener('click', clickCreate);

if (document.cookie == "") {
    createTimer(new Date(new Date().getFullYear() + 1, 0, 1), "New Year");
} else {
    loadTimersFromCookies();
    updateCookies();
}
