var add_button = document.getElementById('new').getElementsByTagName('button')[0];
add_button.addEventListener('click', clickCreate);
start_cards = document.getElementsByClassName('card');
while (start_cards.length > 1) start_cards[0].remove();

createTimer(new Date("2023-5-29 10:00"), "ЕГЭ по русскому");
createTimer(new Date("2023-6-16"), "День рождения");

function createTimer(end_date, description) {
    var card = document.createElement("div");
    card.className = "card";

    var des = document.createElement("div");
    des.id = "name";
    des.innerHTML = description;

    var timer = document.createElement("div");
    timer.id = "timer"
    timer.innerHTML = "<p>0<span id=name-date>h</span> 0<span id=name-date>m</span> 0<span id=name-date>s</span></p>";

    var date = document.createElement("div");
    date.id = "date"
    date.innerHTML = "<p>" + end_date.toLocaleDateString('ru') +
        " <span id=times>" + ((end_date.toLocaleTimeString('ru') == '00:00:00') ? '' : ("(" + end_date.toLocaleTimeString('ru').slice(0, 5) + ")")) + "</span></p>";
    setTimeout(function () {
        var countdown = setInterval(function () {
            var now = new Date();
            var remain = (end_date - now) / 1000;
            if (remain < 0) {
                if (timer.innerHTML == "--:--") timer.innerHTML = "00:00";
                else timer.innerHTML = "--:--";
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
    inner.appendChild(des);
    inner.appendChild(timer);
    inner.appendChild(date);
    card.appendChild(inner);
    var button = document.createElement("button");
    button.textContent = "Delete";
    button.onclick = function () {
        card.remove();
    }
    card.appendChild(button);
    document.body.insertBefore(card, document.getElementById('new'));
}

var isAdd = false;
function clickCreate() {
    if (isAdd) {
        var label = document.getElementById('new').getElementsByTagName('input')[0];
        var select_time = document.getElementById('new').getElementsByTagName('input')[1];
        var select_date = document.getElementById('new').getElementsByTagName('input')[2];
        createTimer(new Date(select_date.value + 'T' + select_time.value), label.value);
        add_button.innerText = '+';
        isAdd = false;
        label.remove();
        select_time.remove();
        select_date.remove();
        return;
    }
    isAdd = true;
    var label = document.createElement("input");
    label.type = "text";
    var realDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000 + 1000 * 60 * 60 * 24);
    var select_time = document.createElement("input");
    select_time.type = "time";
    // select_time.value = realDate.toISOString().split('T')[1].slice(0, 5);
    select_time.value = '00:00';
    var select_date = document.createElement("input");
    select_date.type = "date";
    select_date.value = realDate.toISOString().split('T')[0];
    document.getElementById('new').children[0].insertBefore(label, add_button);
    label.focus();
    document.getElementById('new').appendChild(select_time);
    document.getElementById('new').appendChild(select_date);
    add_button.innerText = 'Add';
}