
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

let disableBtn = (btn, boo) => {
    btn.disabled = boo;
}

let masterErrorHandler = (err, option) => {
    if (option == "reload") {
        window.alert("An error has occured in the action(quiz/poll/feedback), the page will be refreshed once you press OK, once it refreshes please delete the action and make a new one!");
        return;

    }
    if (option == "new action") {
        window.alert("There was an error in adding the questions, please delete this action(quiz/poll/feedback) and make a new one!");
        return;
    }

    window.alert("An error has occured in handling your request, the page will be refreshed once you press OK");
    location.reload();
}

const notify = document.querySelector(".notify");
let popup = (text, error) => {
    if (error) {
        notify.classList.add("button-hover");
        notify.innerHTML = `<i class = "material-icons">close</i>  <p>  ${text}</p>`;
    }
    else {
        notify.classList.remove("button-hover")
        notify.innerHTML = `<i class = "material-icons">check</i>  <p>  ${text}</p>`;
    }
    notify.classList.add("enter-grid");
    notify.classList.add("enter");
    setTimeout(() => {
        notify.classList.remove("enter");
    }, 4000);
    setTimeout(() => {
        notify.classList.remove("enter-grid")
    }, 5000);
}
let addLoader = (button) => {

    button.style.width = button.offsetWidth + "px";
    /* button.style.height = button.offsetHeight + "px"; */
    button.style.overflow = "hidden";
    button.innerHTML = '<img src="../img/loading.gif" alt="" class = "loading-gif">'
}
let removeLoader = (button, text) => {
    button.innerHTML = text;
    button.removeAttribute("style");
}
let checkEventExistance = (event_id) => {
    /* //console.log("Sent Event id = ", event_id, "session Event Id", sessionStorage.getItem("event_id")); */
    if (!sessionStorage.getItem("event_id")) {
        return false;
    }
    if (event_id == sessionStorage.getItem("event_id")) {
        return false;
    }
    else {
        return true;
    }
}

let resetActionIds = (type) => {
    if (type) {
        sessionStorage.removeItem(`${type}_action_id`);
        sessionStorage.setItem(`${type}_active`, "false");
    }
    else {
        let types = ["quiz", "poll", "feedback"];
        types.forEach(ele => {
            sessionStorage.removeItem(`${ele}_action_id`);
            sessionStorage.setItem(`${ele}_active`, "false")
        })
    }
}




/* Handling Movement between tabs */

const tabItems = document.querySelectorAll(".tab-item");
const tabContents = document.querySelectorAll(".tab-content");
const mainContainer = document.querySelector(".main-container");
const invertBtn = document.querySelectorAll(".invert-btn");
let quizActive = false;
function selectItem(e) {
    removeBorder();
    removeShow();
    mainContainer.classList.remove("login-background")
    this.classList.add('tab-border');
    const tabCont = document.querySelector(`.${this.id}`);
    tabCont.classList.add('show');
}


let removeBorder = () => {
    tabItems.forEach(item => {
        item.classList.remove('tab-border');
    });
}

let removeShow = () => {
    tabContents.forEach(item => {
        item.classList.remove('show');
    });
    invertBtn.forEach(ele => {
        ele.classList.remove("show")
    })
}

tabItems.forEach(item => {
    item.addEventListener('click', selectItem);
});

/* Handling the Movement between tabs: End */








/* GoTo function */


const homeSelector = document.querySelectorAll(".home-section");
const quizSelector = document.querySelectorAll(".quiz-section");
const pollSelector = document.querySelectorAll(".poll-section");
const feedbackSelector = document.querySelectorAll(".feedback-section");
const navText = document.querySelector(".nav-text");

let goTo = (ele) => {
    removeBorder();
    removeShow();
    if (window.innerWidth < 600) {
        ele[0].classList.add('tab-border');
        mainContainer.classList.remove("login-background")
        navText.innerHTML = ele[0].innerHTML;
        const tabCont = document.querySelector(`.${ele[0].id}`);
        tabCont.classList.add('show');
    }
    else {
        ele[1].classList.add('tab-border');
        mainContainer.classList.remove("login-background")
        navText.innerHTML = ele[1].innerHTML;
        const tabCont = document.querySelector(`.${ele[1].id}`);
        tabCont.classList.add('show');
    }
}


/* GoTo function: End */

/* Activate Tabs */

function ActivateAction(ty) {
    let type = ty.toLowerCase();
    if (type == "quiz") {
        quizSelector.forEach(ele => { ele.style.color = "black"; ele.addEventListener("click", selectItem); })
    }
    if (type == "poll") {
        pollSelector.forEach(ele => { ele.style.color = "black"; ele.addEventListener("click", selectItem); })
    }
    if (type == "feedback") {
        feedbackSelector.forEach(ele => { ele.style.color = "black"; ele.addEventListener("click", selectItem); })
    }
}




/* Activate Tabs: End */


/* Handling History */


let event_ids = [];
let event_deets = [];
const historyGrid = document.querySelector(".history-grid");
const iconsDiv = document.querySelector(".icons")



const prevEventsDeetsDiv = document.querySelector(".prev-event-deets");


let renderQuiz = {};
let renderQuestions = [];
let renderOptions = [];
let renderCorrect = [];
let renderQuestionNumber = 0;
let temp1 = {};
let actionGraph = document.querySelector('.action-graph').getContext('2d');
let actionGraphDiv = document.querySelector(".action-graph");
let displayChart = new Chart(actionGraph, temp1);
let event_type;
displayChart.canvas.parentNode.style.width = (0.87 * window.innerWidth) + "px";
displayChart.canvas.parentNode.style.height = (0.60 * window.innerHeight) + "px";
const feedbackDiv = document.querySelector(".feedback-history")
let renderChart = () => {
    displayChart.destroy();
    displayChart = new Chart(actionGraph, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: "No. of ppl chose",
                data: [],
                backgroundColor: [
                    'rgba(254, 87, 81, 1)',
                    'rgba(82, 156, 251, 1)',
                    'rgba(50, 179, 115, 1)',
                    'rgba(254, 200, 52, 1)'
                ]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: ""
            },
            maintainAspectRatio: false
        }

    })

}


let updateChartData = () => {
    if (renderQuestions[renderQuestionNumber].length > 80) {
        displayChart.options.title.text = `${renderQuestions[renderQuestionNumber].substr(0, 80)}...`;
    }
    else {
        displayChart.options.title.text = `${renderQuestions[renderQuestionNumber]}`;

    }
    displayChart.data.labels = [];
    displayChart.data.datasets[0].data = []
    // //console.log(displayChart.data.labels)
    renderOptions[renderQuestionNumber].forEach((ele, index) => {
        if (ele["option"].length > 30) {
            displayChart.data.labels[index] = ele["option"].substr(0, 30) + "...";
        }
        else {
            displayChart.data.labels[index] = ele["option"]
        }
        displayChart.data.datasets[0].data[index] = ele["stat"];
    })
    displayChart.update();
}



const renderNext = document.querySelector("#next_ques");
const renderPrev = document.querySelector('#prev_ques');

renderNext.addEventListener("click", () => {

    if (renderQuestionNumber > (renderQuestions.length - 2)) {
        //console.log("cant go more")
        /* popup("End of Action Questions") */

    }
    else {
        renderPrev.classList.remove("disable-btn")
        renderQuestionNumber++;
        if (renderQuestionNumber == (renderQuestions.length - 1)) {
            renderNext.classList.add("disable-btn")
        }
        if (event_type == "Feedback") {
            renderFeedback();
        }
        else {
            updateChartData();
        }
    }
})
if (renderQuestionNumber == 0) {
    renderPrev.classList.add("disable-btn")
}
renderPrev.addEventListener("click", () => {

    if (renderQuestionNumber < 1) {
        //console.log("cant go more back")
        /* popup("This is the first question") */

    }
    else {
        renderNext.classList.remove("disable-btn")
        renderQuestionNumber--;
        if (renderQuestionNumber == 0) {
            renderPrev.classList.add("disable-btn");
        }
        if (event_type == "Feedback") {
            renderFeedback();
        }
        else {
            updateChartData();
        }
    }
})


let renderFeedback = () => {
    feedbackDiv.innerHTML = "";
    let masterDiv = document.createElement("div");
    masterDiv.classList.add("feedback-details");
    let AnswerDiv = document.createElement("div");
    AnswerDiv.classList.add("feedback-answer");
    let question_name = document.createElement("h1");
    question_name.classList.add("feedback-question");
    question_name.innerHTML = renderQuestions[renderQuestionNumber];
    renderOptions[renderQuestionNumber].forEach(answer => {
        let div = document.createElement("div");
        if (window.innerWidth > 600) {
            div.style.maxWidth = (0.5 * window.innerWidth) + "px";
        }
        else {

            div.style.maxWidth = (0.8 * window.innerWidth) + "px";
        }
        div.innerHTML = answer["option"];
        div.classList.add("answer")
        AnswerDiv.appendChild(div)
    })
    masterDiv.appendChild(question_name);
    masterDiv.appendChild(AnswerDiv);
    feedbackDiv.appendChild(masterDiv);
}






let handleEventDeets = (event_id, action_id) => {
    prevEventsDeetsDiv.classList.add("show-action")
    historyGrid.classList.remove("show-action");
    iconsDiv.classList.remove("show-action")
    //console.log(event_id, action_id)
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("https://mighty-sea-62531.herokuapp.com/api/actions/getActiondetail/" + action_id, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(result => {
            //console.log(result);
            event_type = result["action_type"];
            feedbackDiv.classList.remove("show");
            feedbackDiv.innerHTML = '';
            if (result["Questions"].length == 0) {
                document.querySelector(".action-buttons").style.display = "none";
                displayChart.destroy();
                feedbackDiv.classList.add("show")
                feedbackDiv.innerHTML = '<h1 style = "text-align: center; margin-top: 20vh;">There are no questions in this action</h1>'
            }
            else {
                document.querySelector(".action-buttons").removeAttribute("style");
                document.querySelector(".feedback-history").innerHTML = "";
                result["Questions"].forEach((ele) => {
                    renderQuestions.push(ele["name"])
                    renderOptions.push(ele["options"]);
                    renderCorrect.push(ele["correct"]);
                })
                if (renderQuestions.length == 1) {
                    renderNext.classList.add("disable-btn")
                }
                if (result["action_type"] == "Feedback") {
                    actionGraphDiv.classList.remove("show")
                    displayChart.destroy();
                    feedbackDiv.classList.add("show")
                    renderFeedback();

                }
                else {
                    feedbackDiv.classList.remove("show")
                    actionGraphDiv.classList.add("show")
                    renderChart();
                    updateChartData();
                }
            }
        })
        .catch(error => {
            console.log('error', error);
            masterErrorHandler(error);
        });
}















document.querySelector(".cancel-event-deets").addEventListener("click", () => {
    prevEventsDeetsDiv.classList.remove("show-action");
    actionGraphDiv.classList.remove("show")
    feedbackDiv.classList.remove("show")
    historyGrid.classList.add("show-action");
    iconsDiv.classList.add("show-action");
    renderQuiz = {};
    renderQuestions = [];
    renderOptions = [];
    renderCorrect = [];
    renderQuestionNumber = 0;
    event_type = undefined;
    displayChart.destroy();
    renderPrev.classList.remove("disable-btn");
    renderNext.classList.remove("disable-btn")
    renderPrev.classList.add("disable-btn");
    /* displayChart = new Chart(actionGraph, temp1); */
})








let deleteEvent = (id) => {

    //console.log(id)
    var myHeaders = new Headers();
    myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://mighty-sea-62531.herokuapp.com/api/events/deleteEvent/" + id, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json()

        })
        .then(result => {
            //console.log(result);
            sessionStorage.removeItem("event_id");
            sessionStorage.removeItem("the_current_event");
            popup("Event Deleted")
        })
        .catch(error => {
            console.log('error', error)
            masterErrorHandler(error);
        });


}

let resetCreateEvent = () => {
    document.querySelector("#event_name").value = "";
    document.querySelector("#event_code").classList.remove("show");
    document.querySelector(".add-action").classList.remove("show");

}



let deleteAction = (id, type, eventid) => {
    if (sessionStorage.getItem(`${type}_action_id`) == id) {
        if (window.confirm(`This is ${type} is currently active. Do you want to procede?`)) {
            let ele = document.getElementsByClassName(`${id}`)[0];
            let parent = ele.parentElement;
            ele.remove();
            if (parent.childElementCount == 0) {
                let pEmpty = document.createElement("p");
                if (type == "quiz") {
                    pEmpty.innerHTML = "There are no quizzes in this Event";
                }
                else {
                    pEmpty.innerHTML = `There are no ${type}s in this Event`;
                }
                pEmpty.style.color = "red";
                parent.appendChild(pEmpty)
            }


            if (sessionStorage.getItem(`${type}_active`) == "true") {
                //console.log("here")
                closeAction(type, "normal", "nohome").then(() => {
                    var myHeaders = new Headers();
                    myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));

                    var requestOptions = {
                        method: 'DELETE',
                        headers: myHeaders,
                        redirect: 'follow'
                    };

                    fetch("https://mighty-sea-62531.herokuapp.com/api/actions/deleteAction/" + eventid + "/" + id, requestOptions)
                        .then(response => response.text())
                        .then(result => {
                            //console.log(result);
                            popup("Action Deleted")
                        })
                        .catch(error => {
                            // console.log('error', error)
                        });
                })

            }
            else {
                //console.log("here too")
                closeAction(type, "clean action", "nohome").then(() => {
                    var myHeaders = new Headers();
                    myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));

                    var requestOptions = {
                        method: 'DELETE',
                        headers: myHeaders,
                        redirect: 'follow'
                    };

                    fetch("https://mighty-sea-62531.herokuapp.com/api/actions/deleteAction/" + eventid + "/" + id, requestOptions)
                        .then(response => response.text())
                        .then(result => {
                            //console.log(result)
                            popup("Action Deleted")
                        })
                        .catch(error => {
                            // console.log('error', error)
                        });
                })

            }

        }
        else {
            return;
        }
    }
    else {
        let ele = document.getElementsByClassName(`${id}`)[0];
        let parent = ele.parentElement;
        ele.remove();
        if (parent.childElementCount == 0) {
            let pEmpty = document.createElement("p");
            if (type == "quiz") {
                pEmpty.innerHTML = "There are no quizzes in this Event";
            }
            else {
                pEmpty.innerHTML = `There are no ${type}s in this Event`;
            }
            pEmpty.style.color = "red";
            parent.appendChild(pEmpty)
        }
        var myHeaders = new Headers();
        myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://mighty-sea-62531.herokuapp.com/api/actions/deleteAction/" + eventid + "/" + id, requestOptions)
            .then(response => response.text())
            .then(result => {
                //console.log(result)
                popup("Action Deleted")
            })
            .catch(error => {
                // console.log('error', error)
            });

    }
}




let renderEventHistory = (event, actions, just) => {
    //console.log(event, actions);

    let quizno = 0;
    let pollno = 0;
    let feedbackno = 0;
    let EventDiv = document.createElement("li");
    EventDiv.id = event["_id"];
    let EventHeader = document.createElement("div");
    EventDiv.classList.add("event-div");
    EventHeader.classList.add("collapsible-header")
    EventHeader.classList.add("event");
    EventHeader.innerHTML = `<p>${event["Name"]}</i></p>
        <p>${event["Code"]}</p>
        <p>${event["Participants"]}</p>
        <p><i class="material-icons drop">arrow_drop_down</i></p>`;

    EventDiv.appendChild(EventHeader)

    let EventBody = document.createElement("div");
    EventBody.classList.add("collapsible-body")
    EventBody.classList.add("action-deets");
    let ActionsDiv = document.createElement("ul");
    ActionsDiv.classList.add("collapsible");
    ActionsDiv.classList.add("expandable")
    let li1 = document.createElement("li");
    let li2 = document.createElement("li");
    let li3 = document.createElement("li");
    let li1Header = document.createElement("div");
    let li2Header = document.createElement("div");
    let li3Header = document.createElement("div");
    li1Header.classList.add("collapsible-header")
    li1Header.classList.add("action-type")
    li2Header.classList.add("collapsible-header")
    li2Header.classList.add("action-type")
    li3Header.classList.add("collapsible-header")
    li3Header.classList.add("action-type")

    li1Header.innerHTML = '<strong>Quizzes</strong><i class = "material-icons">arrow_drop_down</i>'
    li2Header.innerHTML = '<strong>Polls</strong><i class = "material-icons">arrow_drop_down</i>';
    li3Header.innerHTML = '<strong>Feedbacks</strong><i class = "material-icons">arrow_drop_down</i>';
    li1.appendChild(li1Header)
    li2.appendChild(li2Header)
    li3.appendChild(li3Header)
    let quizzesDiv = document.createElement("div");
    let pollsDiv = document.createElement("div");
    let feedbacksDiv = document.createElement("div");
    quizzesDiv.classList.add("collapsible-body")
    quizzesDiv.classList.add("actions")
    pollsDiv.classList.add("collapsible-body")
    pollsDiv.classList.add("actions")
    feedbacksDiv.classList.add("collapsible-body")
    feedbacksDiv.classList.add("actions")

    actions.forEach((ele, i) => {
        if (ele == null) {
            return;
        }
        let outerdiv = document.createElement("div");
        outerdiv.classList = `outerDiv ${ele["_id"]}`
        let p = document.createElement("p");
        p.id = `${ele["_id"]}`
        p.value = `${event["_id"]}`
        p.addEventListener("click", () => {
            feedbackDiv.classList.add("show");
            feedbackDiv.innerHTML = '<img src="../img/event-loader.gif" class="event-loader" alt="">';
            handleEventDeets(p.value, p.id);
        })
        if (ele["action_type"] == "Quiz") {
            quizno++;
            p.innerHTML = `${ele["title"]}`
            let icon = document.createElement("i");
            icon.classList = "material-icons delete-action";
            icon.innerHTML = "delete";
            icon.addEventListener("click", () => {
                deleteAction(ele["_id"], "quiz", event["_id"])
            })
            outerdiv.appendChild(p)
            outerdiv.appendChild(icon)
            quizzesDiv.appendChild(outerdiv)
        }
        if (ele["action_type"] == "Poll") {
            pollno++;
            p.innerHTML = `${ele["title"]}`;
            let icon = document.createElement("i");
            icon.classList = "material-icons delete-action";
            icon.innerHTML = "delete";
            icon.addEventListener("click", () => {
                deleteAction(ele["_id"], "poll", event["_id"]);
            })
            outerdiv.appendChild(p)
            outerdiv.appendChild(icon);
            pollsDiv.appendChild(outerdiv)
        }
        if (ele["action_type"] == "Feedback") {
            feedbackno++;
            p.innerHTML = `${ele["title"]}`;
            let icon = document.createElement("i");
            icon.classList = "material-icons delete-action";
            icon.id = ele["_id"]
            icon.innerHTML = "delete"
            icon.addEventListener("click", () => {
                deleteAction(ele["_id"], "feedback", event["_id"]);
            })
            outerdiv.appendChild(p)
            outerdiv.appendChild(icon);
            feedbacksDiv.appendChild(outerdiv)
        }
    })
    if (quizno == 0) {
        let pEmpty = document.createElement("p");
        pEmpty.innerHTML = "There are no quizzes in this Event";
        pEmpty.style.color = "red";
        quizzesDiv.appendChild(pEmpty)
    }
    if (pollno == 0) {
        let pEmpty = document.createElement("p");
        pEmpty.innerHTML = "There are no polls in this Event";
        pEmpty.style.color = "red";
        pollsDiv.appendChild(pEmpty)
    }
    if (feedbackno == 0) {
        let pEmpty = document.createElement("p");
        pEmpty.innerHTML = "There are no feedbacks in this Event";
        pEmpty.style.color = "red";
        feedbacksDiv.appendChild(pEmpty)
    }

    li1.appendChild(quizzesDiv);
    li2.appendChild(pollsDiv)
    li3.appendChild(feedbacksDiv)
    ActionsDiv.appendChild(li1)
    ActionsDiv.appendChild(li2)
    ActionsDiv.appendChild(li3)
    let PossibleActions = document.createElement("div")
    PossibleActions.classList.add("possible-actions")
    let but1 = document.createElement("button");
    let but2 = document.createElement("button");
    let but3 = document.createElement("button");
    let but4 = document.createElement("button");
    but1.innerHTML = "+ Add Quiz";
    but2.innerHTML = "+ Add Poll";
    but3.innerHTML = "+ Add Feedback";
    but4.innerHTML = "Delete Event"
    but1.classList.add("main-button");
    but2.classList.add("main-button");
    but3.classList.add("main-button");
    but4.classList.add("main-button")
    but1.addEventListener("click", async () => {
        await multipleActions().then((res) => {
            if (res == true) {
                if (checkEventExistance(event["_id"])) {
                    if (window.confirm("If you wish to work on another event, click OK")) {
                        sessionStorage.setItem("event_id", event["_id"]);
                        resetActionIds();
                        performCheck();
                        ActivateAction("quiz");
                        goTo(quizSelector);
                        sessionStorage.setItem("the_current_event", JSON.stringify(event));
                        renderCurrentEventDeets();
                    }
                    else {
                        return;
                    }
                }
                else {
                    sessionStorage.setItem("event_id", event["_id"]);
                    resetActionIds("quiz");
                    performCheck();
                    sessionStorage.setItem("the_current_event", JSON.stringify(event));
                    renderCurrentEventDeets();
                    ActivateAction("quiz");
                    goTo(quizSelector);
                }

            }
            else {
                return;
            }
        })

    })
    but2.addEventListener("click", async () => {
        await multipleActions().then((res) => {
            if (res == true) {
                if (checkEventExistance(event["_id"])) {
                    /* dialog("An Event already exists, you will lose that data?"); */
                    if (window.confirm("If you wish to work on another event, click OK")) {
                        sessionStorage.setItem("event_id", event["_id"]);
                        resetActionIds();
                        performCheck();
                        ActivateAction("poll");
                        goTo(pollSelector);
                        sessionStorage.setItem("the_current_event", JSON.stringify(event));
                        renderCurrentEventDeets();
                    }
                    else {
                        return;
                    }
                }
                else {
                    sessionStorage.setItem("event_id", event["_id"]);
                    resetActionIds("poll");
                    performCheck();
                    sessionStorage.setItem("the_current_event", JSON.stringify(event));
                    renderCurrentEventDeets();
                    ActivateAction("poll");
                    goTo(pollSelector);
                }
            }
            else {
                return;
            }
        })

    })
    but3.addEventListener("click", async () => {
        await multipleActions().then((res) => {
            if (res == true) {
                if (checkEventExistance(event["_id"])) {
                    /* dialog("An Event already exists, you will lose that data?"); */
                    if (window.confirm("If you wish to work on another event, click OK")) {
                        sessionStorage.setItem("event_id", event["_id"]);
                        resetActionIds();
                        performCheck();
                        resetFeedbackVariables("okay");
                        sessionStorage.setItem("the_current_event", JSON.stringify(event));
                        renderCurrentEventDeets();
                        ActivateAction("feedback");
                        goTo(feedbackSelector);
                    }
                    else {
                        return;
                    }
                }
                else {
                    sessionStorage.setItem("event_id", event["_id"]);
                    resetActionIds("feedback");
                    performCheck();
                    resetFeedbackVariables("okay")
                    sessionStorage.setItem("the_current_event", JSON.stringify(event));
                    renderCurrentEventDeets();
                    ActivateAction("feedback");
                    goTo(feedbackSelector);
                }
            }
            else {
                return;
            }
        })
    })
    but4.addEventListener("click", async () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            if (sessionStorage.getItem("event_id") == event["_id"]) {
                await multipleActions("publish").then((res) => {
                    if (res == true) {
                        deleteEvent(event["_id"]);
                        resetActionIds();
                        resetActionVariables();
                        resetFeedbackVariables("okay")
                        performCheck();
                        document.getElementById(`${event["_id"]}`).remove();
                        resetCreateEvent();
                    }
                    else {
                        return;
                    }
                })
            }
            else {
                deleteEvent(event["_id"])
                document.getElementById(`${event["_id"]}`).remove();
            }
        }
        else {
            return;
        }
    })
    PossibleActions.appendChild(but1);
    PossibleActions.appendChild(but2);
    PossibleActions.appendChild(but3);
    PossibleActions.appendChild(but4);
    EventBody.appendChild(ActionsDiv)
    EventBody.appendChild(PossibleActions)
    EventDiv.appendChild(EventBody);
    if (just == "just") {
        historyGrid.insertBefore(EventDiv, historyGrid.childNodes[1])
    }
    else {
        historyGrid.appendChild(EventDiv);
    }
    var elem = document.querySelectorAll('.collapsible.expandable');
    elem.forEach(ele => {
        var instance = M.Collapsible.init(ele, {
            accordion: false
        });
    })
}



let getActions = async (event) => {
    let actionDeets = [];
    const GatherActions = new Promise((resolve, reject) => {
        let i = 0;
        if (event["Actions"].length == 0) {
            resolve();
        }
        event["Actions"].forEach(action => {

            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch("https://mighty-sea-62531.herokuapp.com/api/actions/getActiondetail/" + action, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response.json()

                })
                .then(result => {
                    actionDeets.push(result);
                    i++;
                    if (i == event["Actions"].length) {
                        resolve();
                    }
                })
                .catch(error => {
                    console.log('error', error);
                    masterErrorHandler(error);
                });
        })
    })
    GatherActions.then(() => {
        renderEventHistory(event, actionDeets);
        var elem = document.querySelector('.collapsible.expandable');
        var instance = M.Collapsible.init(elem, {
            accordion: false
        });
    })
}







let getEventDetails = () => {
    event_ids.forEach(event_id => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://mighty-sea-62531.herokuapp.com/api/events/getEventdetail/" + event_id, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json()
            })
            .then(result => {
                if (result != null) {
                    getActions(result);
                }

            })
            .catch(error => {
                console.log('error', error)
                masterErrorHandler(error);
            });
    })
}



let handleHistory = () => {
    historyGrid.innerHTML = '<li class="event"><p><strong>Events</strong></p> <p><strong>Event Code</strong></p> <p><strong>No. of participants</strong></p> <p><strong></strong></p> </li>';
    var myHeaders = new Headers();
    myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://mighty-sea-62531.herokuapp.com/api/user/getEvents", requestOptions)
        .then(response => {
            console.log(response)
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();

        })
        .then(result => {
            if (result.lenght != 0) {
                event_ids = result;
                getEventDetails();
            }

        })
        .catch(error => {
            console.log('error', error)
            masterErrorHandler(error);
        });
}



/* Handling History: End */





let goToLogin = () => {
    removeBorder();
    removeShow();
    mainContainer.classList.add("login-background")
    userLoginDiv.classList.add("show");
}





/* Handling the login */


const loginButton = document.querySelector("#login_button")
const login = document.querySelector("#user_login");
const userLoginDiv = document.querySelector(".user-login")
const notLoggedIn = document.querySelectorAll(".not-logged-in");
const content = document.querySelectorAll(".content");
let loggedIn = () => {
    if (!sessionStorage.getItem("auth_key")) {
        //console.log("Not logged in")
        goToLogin();
        homeSelector.forEach(ele => {
            ele.style.color = "rgb(189,189,189)";
        })
        quizSelector.forEach(ele => {
            ele.style.color = "rgb(189,189,189)"
        })
        pollSelector.forEach(ele => {
            ele.style.color = "rgb(189,189,189)"
        })
        feedbackSelector.forEach(ele => {
            ele.style.color = "rgb(189,189,189)"
        })
        tabItems.forEach(ele => {
            ele.removeEventListener("click", selectItem);
        })
        document.querySelector(".nav-control").classList.remove("mobile-grid")
        if (window.innerWidth < 600) {
            document.querySelector(".main-container").classList.add("main-container-padding");
        }
    }
    else {
        //console.log("Logged In");
        userLoginDiv.classList.remove("show");
        notLoggedIn.forEach(ele => {
            ele.classList.remove("show");
        })
        content.forEach(ele => {
            ele.classList.add("show");
        })
        if (!sessionStorage.getItem("quiz_action_id")) {
            quizSelector.forEach(ele => {
                ele.style.color = "rgb(189,189,189)";
                ele.removeEventListener("click", selectItem);
            })
        }
        else {
            quizSelector.forEach(ele => {
                ele.style.color = "black";
                ele.addEventListener("click", selectItem);
            })
        }
        if (!sessionStorage.getItem("poll_action_id")) {
            pollSelector.forEach(ele => {
                ele.style.color = "rgb(189,189,189)";
                ele.removeEventListener("click", selectItem);
            })
        }
        else {
            pollSelector.forEach(ele => {
                ele.style.color = "black";
                ele.addEventListener("click", selectItem);
            })
        }
        if (!sessionStorage.getItem("feedback_action_id")) {
            feedbackSelector.forEach(ele => {
                ele.style.color = "rgb(189,189,189)"
                ele.removeEventListener("click", selectItem);
            })
        }
        else {
            feedbackSelector.forEach(ele => {
                ele.style.color = "black"
                ele.addEventListener("click", selectItem);
            })
        }
        homeSelector.forEach(ele => {
            ele.style.color = "black";
            ele.addEventListener("click", selectItem);
        })
        document.querySelector(".nav-control").classList.add("mobile-grid")
        document.querySelector(".main-container").classList.remove("main-container-padding");
        login.innerHTML = "Logout";
        goTo(homeSelector);
        handleHistory();
    }
}
loggedIn();
let handleLogin = (e) => {
    e.preventDefault();




    let flag = 0;
    const userEmail = document.querySelector("#user_email");
    const userPass = document.querySelector("#user_pass");
    const loginForm = document.querySelector("#login_form");
    userEmail.classList.remove("Opt-match")
    userEmail.placeholder = "Email"


    userPass.classList.remove("Opt-match")
    userPass.placeholder = "Password";
    if (userEmail.value == "") {
        userEmail.classList.add("Opt-match")
        userEmail.placeholder = "Email is Required"
        flag++;
    }
    if (userPass.value == "") {
        userPass.classList.add("Opt-match")
        userPass.placeholder = "Password is Required";
        flag++;
    }
    if (flag != 0) {
        return;
    }

    addLoader(loginButton);
    disableBtn(loginButton, true);
    var myHeaders_login = new Headers();
    myHeaders_login.append("Content-Type", "application/json");
    var raw_login = JSON.stringify({ "email": userEmail.value, "password": userPass.value });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders_login,
        body: raw_login,
        redirect: 'follow'
    };

    fetch("https://mighty-sea-62531.herokuapp.com/api/user/login", requestOptions)
        .then(res => {
            console.log(res)
            loginForm.reset();
            // console.log(res)
            disableBtn(loginButton, false);
            if (!res.ok) {
                throw Error(res.statusText)
            }

            return res.json()
        })
        .then(result => {
            sessionStorage.setItem("auth_key", result["Auth Token"])
            loggedIn();
            popup("Logged In")
            removeLoader(loginButton, "Login")
        })
        .catch(error => {
            //console.log('error', error)
            removeLoader(loginButton, "Login")
            popup("Invalid Credentials", "Error")
        });

}

let logout = () => {
    if (login.innerHTML == "Logout") {
        sessionStorage.clear();
        location.reload();
    }
}




login.addEventListener("click", goToLogin);
login.addEventListener("click", logout);

loginButton.addEventListener("click", handleLogin);





/* Handling the login: End */



/* Handling inverting between create and results page */



function handleInvert(e) {
    e.preventDefault();
    //console.log(this.classList)
    if (this.classList[1] == "quiz") {
        if (questionsData.length == 0) return;
    }
    if (this.classList[1] == "poll") {
        if (pollQuestionsData.length == 0) return;
    }
    if (this.classList[1] == "feedback") {
        if (feedbackQuestions.length == 0) return;
    }

    const thiscreate = document.querySelector(`.${this.classList[1]}-create`)
    const thisresult = document.querySelector(`.${this.classList[1]}-result`)
    thiscreate.classList.toggle("show-select");
    thisresult.classList.toggle("show-select");
}

invertBtn.forEach(ele => {
    ele.addEventListener("click", handleInvert);
})

/* Handling inverting between create and results page: End*/



/* Adding Events */

const createEventBtn = document.querySelector("#create_event_btn");
const AddActionDiv = document.querySelector(".add-action");
const EventCodeDiv = document.querySelector("#event_code");
const EventName = document.querySelector("#event_name");
let eventCreated = {};

function createEvent(e) {
    e.preventDefault();

    EventName.classList.remove("Opt-match")
    EventName.placeholder = "Enter Event Name";


    if (EventName.value.replace(/\s/g, "") == "") {
        EventName.classList.add("Opt-match");
        EventName.placeholder = "A valid entry is Required";
        EventName.value = "";
        return;
    }


    multipleActions("publish").then(res => {
        if (res == true) {
            if (sessionStorage.getItem("event_id")) {
                if (window.confirm("If you wish to work on another event, click OK")) {
                    sessionStorage.removeItem("event_id")
                    resetFeedbackVariables("okay")
                    resetActionIds();
                    performCheck();
                    resetActionVariables();
                }
                else {
                    return;
                }
            }
            addLoader(createEventBtn)
            disableBtn(createEventBtn, true);
            const data = {
                Name: EventName.value,
            }
            var raw = JSON.stringify(data);

            var requestOptions = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": "" + sessionStorage.getItem("auth_key")
                },
                body: raw,
                redirect: 'follow'
            };

            fetch("https://mighty-sea-62531.herokuapp.com/api/events/addEvent", requestOptions)
                .then(response => {
                    disableBtn(createEventBtn, false);
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    return response.json();
                })
                .then(result => {
                    //console.log("Event Added", result);
                    removeLoader(createEventBtn, "Generate Event Code")
                    sessionStorage.setItem("event_id", result._id);
                    sessionStorage.setItem("the_current_event", JSON.stringify(result))
                    AddActionDiv.classList.add("show");
                    eventCreated = result;
                    EventCodeDiv.innerHTML = `Event Code: ${result["Code"]}`;
                    EventCodeDiv.classList.add("show");
                    renderCurrentEventDeets();
                    renderEventHistory(result, [], "just");
                    popup("Event Generated");
                })
                .catch(error => {
                    console.log('Event Error', error);
                    removeLoader(createEventBtn, "Generate Event Code")
                    popup("Event Generation Error", "Error")
                });

        }
        else {
            return;
        }
    })
}


async function ActionRedirect(e) {
    await multipleActions().then((res) => {
        if (res == true) {
            if (this.innerHTML == "Quiz") {
                if (checkEventExistance(eventCreated["_id"])) {
                    if (window.confirm("If you wish to work on another event, click OK")) {
                        sessionStorage.setItem("event_id", eventCreated["_id"]);
                        sessionStorage.setItem("the_current_event", JSON.stringify(eventCreated));
                        renderCurrentEventDeets();
                        //console.log("here")
                    }
                    else {
                        return;
                    }
                }
                sessionStorage.removeItem("quiz_action_id");
                performCheck()
                ActivateAction("quiz")
                goTo(quizSelector);
            }
            if (this.innerHTML == "Poll") {
                if (checkEventExistance(eventCreated["_id"])) {
                    if (window.confirm("If you wish to work on another event, click OK")) {
                        sessionStorage.setItem("event_id", eventCreated["_id"]);
                        sessionStorage.setItem("the_current_event", eventCreated);
                        renderCurrentEventDeets();
                    }
                    else {
                        return;
                    }
                }
                sessionStorage.removeItem("poll_action_id");
                performCheck();
                ActivateAction("poll")
                goTo(pollSelector)
            }
            if (this.innerHTML == "Feedback") {
                if (checkEventExistance(eventCreated["_id"])) {
                    if (window.confirm("If you wish to work on another event, click OK")) {
                        sessionStorage.setItem("event_id", eventCreated["_id"]);
                        sessionStorage.setItem("the_current_event", eventCreated);
                        renderCurrentEventDeets();
                    }
                    else {
                        return;
                    }
                }
                sessionStorage.removeItem("feedback_action_id");
                performCheck();
                ActivateAction("feedback")
                goTo(feedbackSelector)
            }
        }
        else {
            return;
        }
    })
}



const actionRedirectBtn = document.querySelectorAll(".action-redirect");
actionRedirectBtn.forEach(ele => {
    ele.addEventListener("click", ActionRedirect)
})

createEventBtn.addEventListener("click", createEvent)


/* Adding Events: End */






/* Adding Actions */



function AddAction(e) {
    e.preventDefault();
    const name = document.querySelector(`#${this.classList[2]}_name`);


    name.classList.remove("Opt-match");
    name.placeholder = `Enter ${this.classList[2]} Name`;

    if (name.value.replace(/\s/g, "") == "") {
        name.classList.add("Opt-match")
        name.placeholder = "A valid value is Required";
        name.value = "";
        return;
    }


    addLoader(this);
    disableBtn(this, true);
    const action_data = {
        action_type: this.classList[2],
        title: name.value
    }
    //console.log(JSON.stringify(action_data))
    var requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "auth-token": "" + sessionStorage.getItem("auth_key")
        },
        body: JSON.stringify(action_data),
        redirect: 'follow'
    };
    fetch("https://mighty-sea-62531.herokuapp.com/api/actions/addAction/" + sessionStorage.getItem("event_id"), requestOptions)
        .then(response => {
            disableBtn(this, false);
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(result => {
            //console.log("Action Added", result);
            document.querySelector(`.${this.classList[2]}-name`).classList.remove("show-action")
            document.querySelector(`.${this.classList[2]}-internal`).classList.add("show-action");

            name.value = "";

            if (this.classList[2] == "Quiz") {
                popup("Quiz Added")
                sessionStorage.setItem("quiz_action_id", result._id);
                //console.log(sessionStorage.getItem("quiz_action_id"))
                sessionStorage.setItem("quiz-Title", result["title"]);
                removeLoader(this, "Make Quiz")
            }
            if (this.classList[2] == "Poll") {
                popup("Poll Added")
                sessionStorage.setItem("poll_action_id", result._id)
                sessionStorage.setItem("poll-Title", result["title"])
                removeLoader(this, "Make Poll")
            }
            if (this.classList[2] == "Feedback") {
                popup("Feedback Added")
                sessionStorage.setItem("feedback_action_id", result._id)
                sessionStorage.setItem("feedback-Title", result["title"]);
                removeLoader(this, "Make Feedback")
            }
            handleHistory();
        })
        .catch(error => {
            console.log('Action Error', error);
            removeLoader(this, `Make ${this.classList[2]}`)

            popup("Error Adding Action", "Error")
        });

}

const AddActionBtn = document.querySelectorAll(".action-btn")
AddActionBtn.forEach(ele => {
    ele.addEventListener("click", AddAction)
})


/* Adding Actions: End */
let collOpts = {};
if (window.innerWidth < 600) {
    collOpts.inDuration = 700
}
var elems = document.querySelector('.quiz-collapsible');
var quizCollapsible = M.Collapsible.init(elems, collOpts);


/* Adding Question and answers */




let validate = (question, options, corrOpt) => {
    let quesVal = true;
    let optVal = true;
    let corrVal = true;
    let match = false;
    if (question.value == "") {
        question.classList.add("Opt-match");
        question.placeholder = "Question is Required"
        quesVal = false;
    }
    options.forEach(opt => {
        if (opt.value == "") {
            opt.classList.add("Opt-match");
            opt.placeholder = "Option is Required"
            optVal = false;
        }
    })
    if (corrOpt) {
        if (corrOpt.value == "") {
            corrOpt.classList.add("Opt-match");
            corrOpt.placeholder = "Correct Option is Required"
            corrVal = false;
        }
        else {
            if (checkOptions(options, corrOpt)) {
                match = true;
            }
        }
    }
    else {
        match = true;
    }
    if (quesVal && optVal && corrVal && match) {
        return true;
    }
    else {
        return false;
    }
}






let pollelems = document.querySelector(".poll-collapsible");
let pollCollapsible = M.Collapsible.init(pollelems, collOpts);
let pollQuestionDivsNo = 1;
let insertPollQuestion = () => {
    pollQuestionDivsNo++;
    let masterUl = document.querySelector(".poll-collapsible");
    let masterLi = document.createElement("li");
    masterLi.id = `poll-question-${pollQuestionDivsNo}`;
    masterLi.innerHTML = `
    <div class="question-header collapsible-header">
        <p>Question ${pollQuestionDivsNo}</p>
        <p class="question-title">Question Title</p>
        <i class="material-icons" id="drop">arrow_drop_down</i>
    </div>
    <div class="collapsible-body">
        <div class="poll-question-create">
            <label for="poll_name">Question</label>
            <input type="text" id="poll_name" class="question_name main-input" placeholder="Enter Question">
            <label for="poll_options">Options</label>
            <div id="poll_options_div_${pollQuestionDivsNo}" class="poll_options_div"><input type="text" class="main-input poll-option" placeholder="Enter Option"></div>
            <div class="add-remove-options">
                <button class="add-option-btn poll_options_div_${pollQuestionDivsNo} main-button" onclick="addOption(this)">+ Add</button>
                <button class="delete-option-btn poll_options_div_${pollQuestionDivsNo} main-button" onclick="deleteOption(this)">- Remove</button>
            </div>
            <div class="poll-actions">
                <button id="add_poll_btn" onclick="addPollQuestion(this)" class="main-button ${pollQuestionDivsNo}">+ Add Poll Question</button>
                <button class="main-button poll ${pollQuestionDivsNo} del-btn" onclick = "delQuestion(this)" id="del_question_btn">Delete Question</button>
            </div>
        </div>
    </div>`
    masterUl.appendChild(masterLi)
    pollCollapsible.open(pollQuestionDivsNo - 1);
    document.querySelector(`#poll-question-${pollQuestionDivsNo - 1}`).scrollIntoView({ behavior: 'smooth' });

}








let pollQuestionsData = [];

function addPollQuestion(btn) {
    let value = btn.classList[1];
    //console.log(value)
    let questionOptions = document.querySelectorAll(`#poll-question-${value} .poll-option`);
    let questionName = document.querySelector(`#poll-question-${value} #poll_name`);
    let questionTitle = document.querySelector(`#poll-question-${value} .question-title`);
    questionOptions.forEach(ele => {
        ele.classList.remove("Opt-match");
        ele.placeholder = "Enter Option"
    })
    questionName.classList.remove("Opt-match")
    questionName.placeholder = "Enter Question"
    if (validate(questionName, questionOptions)) {
        let question = {};
        question.name = questionName.value;
        question.options = [];
        questionOptions.forEach(ele => {
            let opti = {
                option: ele.value
            }
            question.options.push(opti);
        })
        pollQuestionsData[value - 1] = question;
        questionTitle.innerHTML = questionName.value;
        if (btn.value) {
            popup("Question Edited")
        }
        else {
            btn.innerHTML = "Insert Edited Question";
            btn.value = true;
            document.querySelector(`#poll-question-${value} #del_question_btn`).classList.add("show")
            popup("Poll Question Added")
            insertPollQuestion();
        }
        //console.log(pollQuestionsData)
    }
}


let checkOptions = (options, correct) => {
    let flag = 0;
    options.forEach(opt => {
        if (opt.value == correct.value) {
            flag++;
        }
    })
    if (flag == 0) {
        correct.value = "";
        correct.classList.add("Opt-match");
        correct.placeholder = "There are no options that match this"
        return false;
    }
    if (flag == 1) {
        correct.classList.remove("Opt-match");
        correct.placeholder = "Correct Option(must match an option)"
        return true;
    }
    if (flag > 1) {
        correct.value = "";
        correct.classList.add("Opt-match");
        correct.placeholder = "There are multiple options that match this"
        return false;
    }

}








/* const AddQuestionBtn = document.querySelector("#add_question_btn");
const AddPollBtn = document.querySelector("#add_poll_btn"); */








let delQuestion = (ele) => {
    //console.log(ele);
    let i = parseInt(ele.classList[2])
    if (ele.classList[1] == "quiz") {
        //console.log(i - 1);
        questionsData.splice((i - 1), 1);
        //console.log(questionsData)
        let questionDivs = document.querySelectorAll(".quiz-collapsible > li").length;
        for (let index = 0; index < questionDivs; index++) {
            if (index > (i - 1)) {
                //console.log("here", index)
                document.querySelector(`#quiz-question-${index + 1} > .question-header > p`).innerHTML = `Question ${index}`;
                document.querySelector(`#quiz-question-${index + 1} > .collapsible-body > div > .quiz_options_div`).id = `quiz_options_div_${index}`;
                document.querySelector(`#quiz-question-${index + 1} > .collapsible-body > div > .add-remove-options > .add-option-btn`).classList = `add-option-btn quiz_options_div_${index} main-button`;
                document.querySelector(`#quiz-question-${index + 1} > .collapsible-body > div > .add-remove-options > .delete-option-btn`).classList = `delete-option-btn quiz_options_div_${index} main-button`;
                document.querySelector(`#quiz-question-${index + 1} > .collapsible-body > div > .quiz-actions > #add_question_btn`).classList = `main-button ${index}`;
                if (document.querySelector(`#quiz-question-${index + 1} > .collapsible-body > div > .quiz-actions > #del_question_btn`).classList[4] == "show") {
                    document.querySelector(`#quiz-question-${index + 1} > .collapsible-body > div > .quiz-actions > #del_question_btn`).classList = `main-button quiz ${index} del-btn show`;
                }
                else {
                    document.querySelector(`#quiz-question-${index + 1} > .collapsible-body > div > .quiz-actions > #del_question_btn`).classList = `main-button quiz ${index} del-btn`;
                }
                document.querySelector(`#quiz-question-${index + 1}`).id = `quiz-question-${index}`
            }
        }
        document.querySelector(`#quiz-question-${i}`).remove();
        QuestionDivsNo--;
    }
    if (ele.classList[1] == "poll") {
        pollQuestionsData.splice((i - 1), 1);
        //console.log(pollQuestionsData)
        let questionDivs = document.querySelectorAll(".poll-collapsible > li").length;
        for (let index = 0; index < questionDivs; index++) {
            if (index > (i - 1)) {
                document.querySelector(`#poll-question-${index + 1} .question-header > p`).innerHTML = `Question ${index}`;
                document.querySelector(`#poll-question-${index + 1} .poll_options_div`).id = `poll_options_div_${index}`;
                document.querySelector(`#poll-question-${index + 1} .add-option-btn`).classList = `add-option-btn poll_options_div_${index} main-button`;
                document.querySelector(`#poll-question-${index + 1} .delete-option-btn`).classList = `delete-option-btn poll_options_div_${index} main-button`;
                document.querySelector(`#poll-question-${index + 1} #add_poll_btn`).classList = `main-button ${index}`;
                if (document.querySelector(`#poll-question-${index + 1} #del_question_btn`).classList[4] == "show") {
                    document.querySelector(`#poll-question-${index + 1} #del_question_btn`).classList = `main-button poll ${index} del-btn show`;
                }
                else {
                    document.querySelector(`#poll-question-${index + 1} #del_question_btn`).classList = `main-button poll ${index} del-btn`;
                }
                document.querySelector(`#poll-question-${index + 1}`).id = `poll-question-${index}`
            }
        }
        document.querySelector(`#poll-question-${i}`).remove();
        pollQuestionDivsNo--;
    }
    if (ele.classList[1] == "feedback") {
        feedbackQuestions.splice((i - 1), 1);
        //console.log(feedbackQuestions);
        let questionDivs = document.querySelectorAll(".feedback-collapsible > li").length;
        for (let index = 0; index < questionDivs; index++) {
            if (index > (i - 1)) {
                document.querySelector(`#feedback-question-${index + 1} .question-header > p`).innerHTML = `Question ${index}`;
                document.querySelector(`#feedback-question-${index + 1} > .collapsible-body > div > .feedback-actions > #add_feedback_btn`).classList = `main-button ${index}`;
                if (document.querySelector(`#feedback-question-${index + 1} > .collapsible-body > div > .feedback-actions > #del_question_btn`).classList[4] == "show") {
                    document.querySelector(`#feedback-question-${index + 1} > .collapsible-body > div > .feedback-actions > #del_question_btn`).classList = `main-button feedback ${index} del-btn show`;
                }
                else {
                    document.querySelector(`#feedback-question-${index + 1} > .collapsible-body > div > .feedback-actions > #del_question_btn`).classList = `main-button feedback ${index} del-btn`;
                }
                document.querySelector(`#feedback-question-${index + 1}`).id = `feedback-question-${index}`
            }
        }
        document.querySelector(`#feedback-question-${i}`).remove();
        feedbackQuestionDivsNo--;
    }
}






/* Adding Question to the DB */



let questionsData = [];
let question_no = 0;
let addQuizQuestion = (btn) => {
    let questionOptions = document.querySelectorAll(`#quiz-question-${btn.classList[1]} > .collapsible-body > div > .quiz_options_div > .quiz-option`);
    let questionName = document.querySelector(`#quiz-question-${btn.classList[1]} > .collapsible-body > div > .question_name`);
    let correctOption = document.querySelector(`#quiz-question-${btn.classList[1]} > .collapsible-body > div > .correct_option`);
    let questionTItle = document.querySelector(`#quiz-question-${btn.classList[1]} > .collapsible-header > .question-title`);
    questionName.classList.remove("Opt-match")
    questionName.placeholder = "Enter Question"
    correctOption.placeholder = "Enter Correct Option(must match the options)"
    correctOption.classList.remove("Opt-match")
    questionOptions.forEach(ele => {
        ele.classList.remove("Opt-match");
        ele.placeholder = "Enter Option"
    })
    if (validate(questionName, questionOptions, correctOption)) {

        let question = {};
        question.name = questionName.value;
        question.correct = correctOption.value;
        question.options = [];
        questionOptions.forEach(ele => {
            let opti = {
                option: ele.value
            }
            question.options.push(opti);
        })
        questionsData[btn.classList[1] - 1] = question;
        questionTItle.innerHTML = questionName.value;
        if (btn.value) {
            popup("Question Edited")
        }
        else {
            btn.innerHTML = "Insert Edited Question";

            popup("Quiz Question Added")
            btn.value = true;
            document.querySelector(`#quiz-question-${btn.classList[1]} #del_question_btn`).classList.add("show");
            insertQuizQuestion();
        }
        //console.log(questionsData)
    }
}



/* Adding Question to the DB: End */






/* Adding Question Div to DOM */


let QuestionDivsNo = 1;
let insertQuizQuestion = () => {
    QuestionDivsNo++;
    let masterUl = document.querySelector(".quiz-collapsible");
    let masterLi = document.createElement("li");
    masterLi.id = `quiz-question-${QuestionDivsNo}`;
    masterLi.innerHTML = `
    <div class="collapsible-header question-header">
        <p>Question ${QuestionDivsNo}</p>
        <p class = "question-title">Question Title</p>
        <i class="material-icons" id = "drop">arrow_drop_down</i>
    </div>
    <div class="collapsible-body">
        <div class="quiz-question-create">
            <label for="question_name">Question</label>
            <input type="text" class="question_name main-input" placeholder="Enter Question">
            <label for="correct_option">Correct Option</label>
            <input type="text" class="correct_option main-input" placeholder="Correct Option(must match an option)">
            <label for="quiz_options">Options</label>
            <div id="quiz_options_div_${QuestionDivsNo}" class="quiz_options_div"><input type="text" class="main-input quiz-option" placeholder="Enter Option"></div>
            <div class="add-remove-options">
                <button class="add-option-btn quiz_options_div_${QuestionDivsNo} main-button" onclick = "addOption(this)">+ Add</button>
                <button class="delete-option-btn quiz_options_div_${QuestionDivsNo} main-button" onclick = "deleteOption(this)">- Remove</button>
            </div>
            <div class="quiz-actions">
                <button id="add_question_btn" onclick = "addQuizQuestion(this)" class="main-button ${QuestionDivsNo}">+ Add Question</button>
                <button class="main-button quiz ${QuestionDivsNo} del-btn" id = "del_question_btn" onclick = "delQuestion(this)">Delete Question</button>
            </div>
        </div>
    </div>`
    masterUl.appendChild(masterLi)
    quizCollapsible.open(QuestionDivsNo - 1);
    if (window.innerWidth > 600) {
        document.querySelector(`#quiz-question-${QuestionDivsNo - 1}`).scrollIntoView({ behavior: 'smooth' });
    }
    else {
        document.querySelector(`#quiz-question-${QuestionDivsNo - 1} > .collapsible-header`).scrollIntoView({ behavior: 'smooth' });
    }
}


/* Adding Question Div to DOM: End */




/* Adding Question and answers: End */










/* Handling Adding and Removing Options */


let quizOptlength = 1;
let pollOptlength = 1;

function addOption(ele) {
    //console.log(ele)
    const OptionsDiv = document.querySelector(`#${ele.classList[1]}`)
    if (OptionsDiv.childElementCount == 4) {
        return;
    }
    let inputField = document.createElement("input");
    inputField.placeholder = "Enter Option";
    if (OptionsDiv.classList[0] == "quiz_options_div") {
        inputField.classList.add(`quiz-option`);
    }
    if (OptionsDiv.classList[0] == "poll_options_div") {
        inputField.classList.add("poll-option");
    }
    inputField.classList.add("main-input");
    OptionsDiv.appendChild(inputField)

}
function deleteOption(ele) {
    const OptionsDiv = document.querySelector(`#${ele.classList[1]}`);
    if (OptionsDiv.childElementCount == 1) {
        return;
    }
    else {
        OptionsDiv.removeChild(OptionsDiv.lastChild)
    }
}



/* Handling Adding and Removing Options: End */






/* SelectTheme */


sessionStorage.setItem("quizTheme", "bar");
sessionStorage.setItem("pollTheme", "bar");
sessionStorage.setItem("feedbackTheme", "cont");


const themeBtn = document.querySelectorAll(".theme-btn");
const icons = document.querySelectorAll(".icon");

let putwhite = () => {
    themeBtn.forEach(ele => {
        ele.classList.remove("blue-select");
    })
    icons.forEach(ele => {
        ele.classList.remove("white-select")
    })
}

function themeSelector(e) {
    e.preventDefault();
    putwhite();
    this.classList.add("blue-select");
    let icon = document.querySelector(`.${this.classList[4]}-white`);
    icon.classList.add("white-select")

    if (this.classList[2] === "quiz") {
        sessionStorage.setItem("quizTheme", this.classList[3]);
    }
    if (this.classList[2] === "poll") {
        sessionStorage.setItem("pollTheme", this.classList[3]);
    }
    if (this.classList[2] === "feedback") {
        sessionStorage.setItem("feedbackTheme", this.classList[3]);
    }
}
function changeWhite(e) {
    let icon = document.querySelector(`.${this.classList[4]}-white`);
    icon.classList.toggle("white")
}
themeBtn.forEach(ele => {
    ele.addEventListener("click", themeSelector);
})
themeBtn.forEach(ele => {
    ele.addEventListener("mouseover", changeWhite);
    ele.addEventListener("mouseout", changeWhite)
})


/* SelectTheme: End */




var feedbackElems = document.querySelector('.feedback-collapsible');
var feedbackCollapsible = M.Collapsible.init(feedbackElems, collOpts);



let feedbackQuestionDivsNo = 1;
let insertFeedbackQuestion = () => {
    feedbackQuestionDivsNo++;
    let masterUl = document.querySelector(".feedback-collapsible");
    let masterLi = document.createElement("li");
    masterLi.id = `feedback-question-${feedbackQuestionDivsNo}`;
    masterLi.innerHTML = `
    <div class="question-header collapsible-header">
        <p>Question ${feedbackQuestionDivsNo}</p>
        <p class="question-title">Question Title</p>
        <i class="material-icons" id="drop">arrow_drop_down</i>
    </div>
    <div class="collapsible-body">
        <div class="feedback-question-create">
            <label for="feedback_name">Question</label>
            <textarea rows="3" type="text" id="feedback_name" class="main-input"
                placeholder="Enter Feedback Question"></textarea>
            <div class="feedback-actions">
                <button id="add_feedback_btn" class="main-button ${feedbackQuestionDivsNo}" onclick="addFeedbackQuestion(this)">+ Add
                    Question</button>
                <button class="main-button feedback ${feedbackQuestionDivsNo} del-btn" id="del_question_btn"
                    onclick="delQuestion(this)">Delete Question</button>
            </div>
        </div>
    </div>
    `
    masterUl.appendChild(masterLi)
    feedbackCollapsible.open(feedbackQuestionDivsNo - 1);
    document.querySelector(`#feedback-question-${feedbackQuestionDivsNo - 1}`).scrollIntoView({ behavior: 'smooth' });
}








let feedbackQuestions = [];
function addFeedbackQuestion(btn) {
    let value = btn.classList[1];
    //console.log(value)
    let feedbackQuestion = document.querySelector(`#feedback-question-${value} #feedback_name`);
    let questiontitle = document.querySelector(`#feedback-question-${value} .question-title`);
    let question = {};
    feedbackQuestion.classList.remove("Opt-match")
    feedbackQuestion.placeholder = "Enter Feedback Question";
    if (feedbackQuestion.value == "") {
        feedbackQuestion.classList.add("Opt-match")
        feedbackQuestion.placeholder = "Feedback Question is Required";
    }
    else {
        question.name = feedbackQuestion.value;
        questiontitle.innerHTML = feedbackQuestion.value;
        feedbackQuestions[value - 1] = question;
        if (btn.value) {
            popup("Question Edited")
        }
        else {
            btn.value = true;
            btn.innerHTML = "Insert Edited Question";
            document.querySelector(`#feedback-question-${value} #del_question_btn`).classList.add("show");
            insertFeedbackQuestion();
            popup("Feedback Question Added")
        }
        //console.log(feedbackQuestions)
    }
}

/* addFeedbackBtn.addEventListener("click", addFeedbackQuestion) */













/* Handling the god damn fucking live quiz */


let quiz_opts = [];
let quiz = {};
let questions = [];
let socket;
let questionIds = [];
const quizDetailsDiv = document.querySelector(".quiz-details");
let currentQuestionId;
let questionNumber = 0;
const nextQuestionBtn = document.querySelector("#nxtq");
const nextPollBtn = document.querySelector("#next_poll")






let nextQuestionTrue = (type) => {
    var myHeaders = new Headers();
    myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    let url;
    if (type == "quiz") {
        url = "https://mighty-sea-62531.herokuapp.com/api/questions/next/" + sessionStorage.getItem("quiz_action_id") + "/" + currentQuestionId;
    }
    if (type == "poll") {
        url = "https://mighty-sea-62531.herokuapp.com/api/questions/next/" + sessionStorage.getItem("poll_action_id") + "/" + currentQuestionId
    }
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            //console.log("falkdsjf;lkdsajf;ldsakf")
            //console.log(result);
            questionNumber++;
            currentQuestionId = result["_id"];
            if (type == "quiz") {
                socket.emit("next question", sessionStorage.getItem("quiz_action_id"));
                if (questionNumber == (questions.length - 1)) {
                    nextQuestionBtn.classList.add("disable-btn");
                }
            }
            if (type == "poll") {
                socket.emit("next question", sessionStorage.getItem("poll_action_id"));
                if (questionNumber == (questions.length - 1)) {
                    nextPollBtn.classList.add("disable-btn");
                }
            }
            renderQuizDetails();
            popup("Next Question Live")
        })
        .catch(error => {
            //console.log('error', error);
            popup("Next Question Error", "Error");
        });
}

nextQuestionBtn.addEventListener("click", () => {
    if (questionNumber == (questions.length - 1)) {
        popup("End of Quiz Questions", "Error");
    }
    else {
        nextQuestionTrue("quiz");
    }
});

nextPollBtn.addEventListener("click", () => {
    if (questionNumber == (questions.length - 1)) {
        popup("End of poll Questions", "Error")
    }
    else {
        nextQuestionTrue("poll");
    }
});


let getQuizDetails = (numberFrom) => {

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("https://mighty-sea-62531.herokuapp.com/api/actions/getActiondetail/" + sessionStorage.getItem("quiz_action_id"), requestOptions)
        .then(response => {
            if (response.status == 200) {
                return response.json();
            }
            else {
                return "Error";
            }
        })
        .then(result => {
            if (result == "Error") {
                //console.log("Error")
            }
            else {
                quiz = result;
                if (quiz["Questions"].length == 1) {
                    nextQuestionBtn.classList.add("disable-btn");
                }
                getQuizOptions(numberFrom);
            }
        })
        .catch(error => {
            // console.log('error', error)
        });

}
let getQuizOptions = (numberFrom) => {
    questions = quiz["Questions"];
    //console.log(questions)
    questions.forEach((ele, i) => {
        if (numberFrom != undefined) {
            if (i > numberFrom) {
                quiz_opts.push(ele["options"])
                questionIds.push(ele["_id"])
            }
        }
        else {
            quiz_opts.push(ele["options"])
            questionIds.push(ele["_id"])
        }
    })
    //console.log(quiz_opts)
    if (numberFrom == undefined) {
        currentQuestionId = questions[0]["_id"];
    }
    socketConnection();
}

let socketConnection = () => {
    socket = io('https://mighty-sea-62531.herokuapp.com/');
    socket.on("connect", () => {
        //console.log(socket.connected)
        renderQuizDetails();
        continueSocketConnection();
    })

}
let continueSocketConnection = () => {
    socket.on('all options', (new_data) => {
        //console.log(new_data)
        //console.log(quiz_opts)
        for (let k of quiz_opts) {
            k.forEach(ele => {
                if (new_data._id == ele._id) {
                    ele.stat = new_data.stat;
                }
            })
        }
        //console.log(quiz_opts)
        renderQuizDetails();
    })
}

let resetStat = () => {
    let optionids = [];
    quiz_opts[questionNumber].forEach(opt => {
        optionids.push(opt["_id"]);
        opt["stat"] = 0;
    })
    socket.emit("reset options", optionids);
    renderQuizDetails();
    popup("Question Stats Reset");
}


const resetStatBtn = document.querySelectorAll(".reset-stat");
resetStatBtn.forEach(ele => {
    ele.addEventListener("click", resetStat);
})



let quiz_labels = [];
let quiz_data = [];
let temp = {};
let ctxa = document.querySelector('.quiz-details').getContext('2d');
let pollChart = document.querySelector('.poll-details').getContext('2d');
let MyChart = new Chart(ctxa, temp);
MyChart.canvas.parentNode.style.width = (0.87 * window.innerWidth) + "px";
MyChart.canvas.parentNode.style.height = (0.57 * window.innerHeight) + "px";
let createChart = (chartDiv, ty) => {
    MyChart.destroy();
    MyChart = new Chart(chartDiv, {
        type: ty,
        data: {
            labels: [],
            datasets: [{
                label: "No. of ppl chose",
                data: [],
                backgroundColor: [
                    'rgba(254, 87, 81, 1)',
                    'rgba(82, 156, 251, 1)',
                    'rgba(50, 179, 115, 1)',
                    'rgba(254, 200, 52, 1)'
                ]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: ""
            },
            maintainAspectRatio: false,
            responsive: true
        }

    })
    MyChart.canvas.parentNode.style.width = (0.87 * window.innerWidth) + "px";
    MyChart.canvas.parentNode.style.height = (0.57 * window.innerHeight) + "px";

}


let renderQuizDetails = () => {
    if (questions[questionNumber]["name"].length > 80) {
        MyChart.options.title.text = questions[questionNumber]["name"].substr(0, 80) + "...";
    }
    else {
        MyChart.options.title.text = questions[questionNumber]["name"];
    }
    MyChart.data.labels = [];
    MyChart.data.datasets[0].data = []
    quiz_opts[questionNumber].forEach((ele, index) => {
        quiz_labels.push(ele["option"])
        if (ele["option"].length > 30) {
            MyChart.data.labels[index] = ele["option"].substr(0, 30) + "...";
        }
        else {
            MyChart.data.labels[index] = ele["option"];
        }
        quiz_data.push(ele["stat"]);
        MyChart.data.datasets[0].data[index] = ele["stat"];
    })

    MyChart.update();

}

let resetActionVariables = (type) => {
    currentQuestionId = "";
    questionNumber = 0;
    quiz_opts = [];
    quiz = {};
    questions = [];
    questionIds = [];
    if (type == "quiz") {
        questionsData = [];
        quizQuestionsLength = undefined;
        document.querySelector(".quiz-collapsible").innerHTML = `
        <li id="quiz-question-1" class="active">
            <div class="collapsible-header question-header">
                <p>Question 1</p>
                <p class = "question-title">Question Title</p>
                <i class="material-icons">arrow_drop_down</i>
            </div>
            <div class="collapsible-body">
                <div class="quiz-question-create">
                    <label for="question_name">Question</label>
                    <input type="text" id="question_name" class="question_name main-input" placeholder="Enter Question">
                    <label for="correct_option">Correct Option</label>
                    <input type="text" id="correct_option" class="correct_option main-input" placeholder="Correct Option(must match an option)">
                    <label for="quiz_options">Options</label>
                    <div id="quiz_options_div_1" class="quiz_options_div"><input type="text" class="main-input quiz-option" placeholder="Enter Option"></div>
                    <div class="add-remove-options">
                        <button class="add-option-btn quiz_options_div_1 main-button" onclick = "addOption(this)">+ Add</button>
                        <button class="delete-option-btn quiz_options_div_1 main-button" onclick="deleteOption(this)">- Remove</button>
                    </div>
                    <div class="quiz-actions">
                        <button id="add_question_btn" onclick = "addQuizQuestion(this)" class="main-button 1">+ Add Question</button>
                        <button class="main-button quiz 1 del-btn" id = "del_question_btn" onclick = "delQuestion(this)">Delete Question</button>
                    </div>
                </div>
            </div>
        </li>`;
        QuestionDivsNo = 1;
        quizCollapsible = M.Collapsible.init(elems, collOpts);
    }
    else if (type == "poll") {
        pollQuestionsData = [];
        pollQuestionsLength = undefined;
        document.querySelector(".poll-collapsible").innerHTML = `
        <li id="poll-question-1" class="active">
            <div class="question-header collapsible-header">
                <p>Question 1</p>
                <p class="question-title">Question Title</p>
                <i class="material-icons" id="drop">arrow_drop_down</i>
            </div>
            <div class="collapsible-body">
                <div class="poll-question-create">
                    <label for="poll_name">Question</label>
                    <input type="text" id="poll_name" class="question_name main-input" placeholder="Enter Question">
                    <label for="poll_options">Options</label>
                    <div id="poll_options_div_1" class="poll_options_div"><input type="text" class="main-input poll-option" placeholder="Enter Option"></div>
                    <div class="add-remove-options">
                        <button class="add-option-btn poll_options_div_1 main-button" onclick="addOption(this)">+ Add</button>
                        <button class="delete-option-btn poll_options_div_1 main-button" onclick="deleteOption(this)">- Remove</button>
                    </div>
                    <div class="poll-actions">
                        <button id="add_poll_btn" onclick="addPollQuestion(this)" class="main-button 1">+ Add Poll Question</button>
                        <button class="main-button poll 1 del-btn" id="del_question_btn" onclick="delQuestion(this)">Delete Question</button>
                    </div>
                </div>
            </div>
        </li>`;
        pollQuestionDivsNo = 1;
        pollCollapsible = M.Collapsible.init(pollelems, collOpts);
    }
    else {
        pollQuestionsData = [];
        questionsData = [];
        quizQuestionsLength = undefined;
        pollQuestionsLength = undefined;
        document.querySelector(".quiz-collapsible").innerHTML = `
        <li id="quiz-question-1" class="active">
            <div class="collapsible-header question-header">
                <p>Question 1</p>
                <p class = "question-title">Question Title</p>
                <i class="material-icons">arrow_drop_down</i>
            </div>
            <div class="collapsible-body">
                <div class="quiz-question-create">
                    <label for="question_name">Question</label>
                    <input type="text" id="question_name" class="question_name main-input" placeholder="Enter Question">
                    <label for="correct_option">Correct Option</label>
                    <input type="text" id="correct_option" class="correct_option main-input" placeholder="Correct Option(must match an option)">
                    <label for="quiz_options">Options</label>
                    <div id="quiz_options_div_1" class="quiz_options_div"><input type="text" class="main-input quiz-option" placeholder="Enter Option"></div>
                    <div class="add-remove-options">
                        <button class="add-option-btn quiz_options_div_1 main-button" onclick = "addOption(this)">+ Add</button>
                        <button class="delete-option-btn quiz_options_div_1 main-button" onclick="deleteOption(this)">- Remove</button>
                    </div>
                    <div class="quiz-actions">
                        <button id="add_question_btn" onclick = "addQuizQuestion(this)" class="main-button 1">+ Add Question</button>
                        <button class="main-button quiz 1 del-btn" id = "del_question_btn" onclick = "delQuestion(this)">Delete Question</button>
                    </div>
                </div>
            </div>
        </li>`;
        QuestionDivsNo = 1;
        quizCollapsible = M.Collapsible.init(elems, collOpts);
        document.querySelector(".poll-collapsible").innerHTML = `
        <li id="poll-question-1" class="active">
            <div class="question-header collapsible-header">
                <p>Question 1</p>
                <p class="question-title">Question Title</p>
                <i class="material-icons" id="drop">arrow_drop_down</i>
            </div>
            <div class="collapsible-body">
                <div class="poll-question-create">
                    <label for="poll_name">Question</label>
                    <input type="text" id="poll_name" class="question_name main-input" placeholder="Enter Question">
                    <label for="poll_options">Options</label>
                    <div id="poll_options_div_1" class="poll_options_div"><input type="text" class="main-input poll-option" placeholder="Enter Option"></div>
                    <div class="add-remove-options">
                        <button class="add-option-btn poll_options_div_1 main-button" onclick="addOption(this)">+ Add</button>
                        <button class="delete-option-btn poll_options_div_1 main-button" onclick="deleteOption(this)">- Remove</button>
                    </div>
                    <div class="poll-actions">
                        <button id="add_poll_btn" onclick="addPollQuestion(this)" class="main-button 1">+ Add Poll Question</button>
                        <button class="main-button poll 1 del-btn" id="del_question_btn" onclick="delQuestion(this)">Delete Question</button>
                    </div>
                </div>
            </div>
        </li>`;
        pollQuestionDivsNo = 1;
        pollCollapsible = M.Collapsible.init(pollelems, collOpts);
    }
    socket = undefined;
    MyChart.destroy();
    nextQuestionBtn.classList.remove("disable-btn")
    nextPollBtn.classList.remove("disable-btn")
}


let updateStats = (type, id) => {
    return new Promise((resolve, reject) => {
        let url;

        url = "https://mighty-sea-62531.herokuapp.com/api/options/updateStat/" + id;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));

        // questionIds.forEach((questionId, index) => {
        //     quiz_opts[index].forEach(opt => {
        //     })

        // })
        for (let i = 0; i < questionIds.length; i++) {
            for (let j = 0; j < quiz_opts[i].length; j++) {
                let raw = JSON.stringify({ "stat": `${quiz_opts[i][j]["stat"]}`, "option": `${quiz_opts[i][j]["option"]}` });

                let requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch(url + "/" + questionIds[i] + "/" + quiz_opts[i][j]["_id"], requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        // console.log(result)
                    })
                    .catch(error => {
                        // console.log('error', error)
                    });

            }
            if (i == (questionIds.length - 1)) {
                resolve();
            }
        }
    })

}



let closeAction = (type, ref, nohome) => {
    return new Promise((resolve, reject) => {
        let closeUrl;
        if (type == "quiz") {
            closeUrl = "https://mighty-sea-62531.herokuapp.com/api/actions/closeAction/" + sessionStorage.getItem("quiz_action_id");
        }
        if (type == "poll") {
            closeUrl = "https://mighty-sea-62531.herokuapp.com/api/actions/closeAction/" + sessionStorage.getItem("poll_action_id");
        }
        if (type == "feedback") {
            closeUrl = "https://mighty-sea-62531.herokuapp.com/api/actions/closeAction/" + sessionStorage.getItem("feedback_action_id");
        }
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(closeUrl, requestOptions)
            .then(response => response.text())
            .then(async (result) => {
                //console.log(result);
                if (ref == "normal") {
                    continueResultBtn(type);
                    let emitingData = [];
                    if (type == "quiz") {
                        emitingData.push(sessionStorage.getItem("quiz_action_id"));
                        quiz_opts.forEach(ele => {
                            ele.forEach(opt => {
                                emitingData.push(opt["_id"]);
                            })
                        })
                        //console.log(socket)
                        socket.emit("close quiz", emitingData);
                        updateStats("quiz", sessionStorage.getItem("quiz_action_id")).then(() => {
                            //console.log("herea")
                            popup("Quiz Closed")
                            socket.disconnect();
                            resetActionIds("quiz");
                            resetActionVariables("quiz");
                            performCheck();
                            if (nohome != "nohome") {
                                goTo(homeSelector);
                            }
                            resolve();

                        })
                    }
                    if (type == "poll") {
                        emitingData.push(sessionStorage.getItem("poll_action_id"));
                        quiz_opts.forEach(ele => {
                            ele.forEach(opt => {
                                emitingData.push(opt["_id"]);
                            })
                        })
                        socket.emit("close quiz", emitingData);
                        socket.disconnect();
                        await updateStats("poll", sessionStorage.getItem("poll_action_id")).then(() => {
                            popup("Poll Closed")
                            resetActionIds("poll");
                            resetActionVariables("poll");
                            performCheck();
                            if (nohome != "nohome") {
                                goTo(homeSelector);
                            }
                            resolve();
                        })

                    }
                    if (type == "feedback") {
                        popup("Feedback Closed")
                        resetActionIds("feedback")
                        resetFeedbackVariables("okay");
                        performCheck();
                        if (nohome != "nohome") {
                            goTo(homeSelector);
                        }
                        resolve()
                    }
                    sessionStorage.setItem(`${type}_active`, "false")
                }
                else if (ref = "clean action") {
                    if (type == "quiz") {
                        popup("Quiz Closed")
                        resetActionIds("quiz");
                        resetActionVariables("quiz");
                        performCheck();
                        if (nohome != "nohome") {
                            goTo(homeSelector);
                        }
                        resolve();
                    }
                    if (type == "poll") {
                        popup("Poll Closed")
                        resetActionIds("poll");
                        resetActionVariables("poll");
                        performCheck();
                        if (nohome != "nohome") {
                            goTo(homeSelector);
                        }
                        resolve();
                    }
                    if (type == "feedback") {
                        popup("Feedback Closed")
                        resetActionIds("feedback")
                        resetFeedbackVariables("okay");
                        performCheck();
                        if (nohome != "nohome") {
                            goTo(homeSelector);
                        }
                        resolve()
                    }
                    sessionStorage.setItem(`${type}_active`, "false")

                }
                else if (ref = "ref") {
                    let emitingData = [];
                    emitingData.push(sessionStorage.getItem(`${type}_action_id`));
                    sessionStorage.removeItem(`${type}_action_id`);
                    performCheck();
                    socket = io('https://mighty-sea-62531.herokuapp.com/');
                    socket.on("connect", () => {
                        socket.emit("close quiz", emitingData);
                    })
                    popup("Previous Action ended due to refresh")
                    sessionStorage.setItem(`${type}_active`, "false")

                    resolve();
                }
            })
            .catch(error => {
                //console.log('error', error);
                popup("Error in closing Action", "Error");
            });
    })
}

const closeQuizBtn = document.querySelector("#close_quiz");
closeQuizBtn.addEventListener("click", () => {
    closeAction("quiz", "normal");
});
const closePollBtn = document.querySelector('#close_poll');
closePollBtn.addEventListener("click", () => {
    closeAction("poll", "normal")
})
const closeFeedbackBtn = document.querySelector("#close_feedback");
closeFeedbackBtn.addEventListener("click", () => {
    closeAction("feedback", "normal")
})


/* Handling the rendering and functioning of a live Quiz Event: End */


/* Handling the rendering and functioning of a live Poll Event  */




let getPollDetails = (numberFrom) => {

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch("https://mighty-sea-62531.herokuapp.com/api/actions/getActiondetail/" + sessionStorage.getItem("poll_action_id"), requestOptions)
        .then(response => {
            if (response.status == 200) {
                return response.json();
            }
            else {
                return "Error";
            }
        })
        .then(result => {
            if (result == "Error") {
                //console.log("Error")
            }
            else {
                quiz = result;
                if (quiz["Questions"].length == 1) {
                    nextPollBtn.classList.add("disable-btn");
                }
                getQuizOptions(numberFrom);
            }
        })
        .catch(error => {
            // console.log('error', error)
        });

}



/* Handling the rendering and functioning of a live Poll Event: End */





let feedbackResultQuestions = [];
let feedbackAnswers = [];
const feedbackQuestionDiv = document.querySelector(".feedback-question");
const feedbackAnswerDiv = document.querySelector(".feedback-answer");
const nextFeedbackBtn = document.querySelector("#next_feedback_btn");
const prevFeedbackBtn = document.querySelector("#prev_feedback_btn");
let feedbackNo = 0;
let renderFeedbackDeets = (question, answers) => {
    feedbackQuestionDiv.innerHTML = "";
    feedbackAnswerDiv.innerHTML = "";
    feedbackQuestionDiv.innerHTML = question;
    answers.forEach(answer => {
        let div = document.createElement("div");
        div.innerHTML = answer["option"];
        div.classList.add("answer")
        feedbackAnswerDiv.appendChild(div)
    })

}

if (feedbackNo == 0) {
    prevFeedbackBtn.classList.add("disable-btn")
}

nextFeedbackBtn.addEventListener("click", () => {
    if (feedbackNo == (feedbackResultQuestions.length - 1)) {
        popup("End of Feedback Questions", "Error")
    }
    else {
        feedbackNo++;
        prevFeedbackBtn.classList.remove("disable-btn")
        if (feedbackNo == (feedbackResultQuestions.length - 1)) {
            nextFeedbackBtn.classList.add("disable-btn");
        }
        renderFeedbackDeets(feedbackResultQuestions[feedbackNo], feedbackAnswers[feedbackNo]);
    }
})
prevFeedbackBtn.addEventListener("click", () => {
    if (feedbackNo == 0) {
        popup("First Feedback Question", "Error")
    }
    else {
        feedbackNo--;
        nextFeedbackBtn.classList.remove("disable-btn");
        if (feedbackNo == 0) {
            prevFeedbackBtn.classList.add("disable-btn")
        }
        renderFeedbackDeets(feedbackResultQuestions[feedbackNo], feedbackAnswers[feedbackNo]);
    }
})







let getFeedbackAnswers = (data) => {
    feedbackResultQuestions = [];
    feedbackAnswers = [];
    data.Questions.forEach(question => {
        feedbackResultQuestions.push(question["name"]);
        feedbackAnswers.push(question["options"]);
    })
    //console.log(feedbackResultQuestions, feedbackAnswers)
    renderFeedbackDeets(feedbackResultQuestions[feedbackNo], feedbackAnswers[feedbackNo]);
}




let getFeedbackDeets = () => {
    return new Promise((resolve, reject) => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://mighty-sea-62531.herokuapp.com/api/actions/getActiondetail/" + sessionStorage.getItem("feedback_action_id"), requestOptions)
            .then(response => response.json())
            .then(result => {
                //console.log(result);
                if (result["Questions"].length == 1) {
                    nextFeedbackBtn.classList.add("disable-btn");
                }
                getFeedbackAnswers(result);

                resolve();
            })
            .catch(error => {
                //console.log('error', error);
                popup("Error in getting Feedback Answers", "Error");
            });
    })
}

let resetFeedbackVariables = (action) => {
    feedbackResultQuestions = [];
    feedbackAnswers = [];

    feedbackNo = 0;
    if (action == "okay") {
        feedbackQuestions = [];
        document.querySelector(".feedback-collapsible").innerHTML = `
        <li id="feedback-question-1" class="active">
            <div class="question-header collapsible-header">
                <p>Question 1</p>
                <p class="question-title">Question Title</p>
                <i class="material-icons" id="drop">arrow_drop_down</i>
            </div>
            <div class="collapsible-body">
                <div class="feedback-question-create">
                    <label for="feedback_name">Question</label>
                    <textarea rows="3" type="text" id="feedback_name" class="main-input"
                        placeholder="Enter Feedback Question"></textarea>
                    <div class="feedback-actions">
                        <button id="add_feedback_btn" class="main-button 1" onclick="addFeedbackQuestion(this)">+ Add
                            Question</button>
                        <button class="main-button feedback 1 del-btn" id="del_question_btn"
                            onclick="delQuestion(this)">Delete Question</button>
                    </div>
                </div>
            </div>
        </li>
        `
        feedbackQuestionDivsNo = 1;
        feedbackCollapsible = M.Collapsible.init(feedbackElems, collOpts);
    }
    feedbackQuestionDiv.innerHTML = "";
    feedbackAnswerDiv.innerHTML = "";
    prevFeedbackBtn.classList.add("disable-btn")
    nextFeedbackBtn.classList.remove("disable-btn");
    prevFeedbackBtn.classList.add("disable-btn");
}

const refreshBtn = document.querySelector(".refresh-btn");
refreshBtn.addEventListener("click", async () => {
    resetFeedbackVariables()
    await getFeedbackDeets();
    popup("Refreshed")
});






/* Continue Result Btn */

function continueResultBtn(type) {
    document.querySelector(`.continue-${type}-btn`).classList.toggle("show");
    document.querySelector(`#publish_${type}`).classList.toggle("not-show");
}









/* Continue Result Btn: End */

/* Handling turning isOpen on actions to true */



let firstQuestionPublish = (id, type) => {
    var myHeaders = new Headers();
    myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://mighty-sea-62531.herokuapp.com/api/questions/publishQuestion/" + id, requestOptions)
        .then(response => response.text())
        .then(result => {
            //console.log(result);
            if (type == "quiz") {
                document.querySelector(".quiz-loader").classList.remove("show")
                getQuizDetails();
                createChart(ctxa, sessionStorage.getItem("quizTheme"));
            }
            if (type == "poll") {
                document.querySelector(".poll-loader").classList.remove("show")
                getPollDetails();
                createChart(pollChart, sessionStorage.getItem("pollTheme"));
            }
            if (type == "feedback") {
                document.querySelector(".feedback-loader").classList.remove("show")
                //console.log("action type is feedback");
                getFeedbackDeets()
            }
        })
        .catch(error => {
            // console.log('error', error)
        });
}


let quizQuestionsLength = 0;
let pollQuestionsLength = 0;
let feedbackQuestionsLength = 0;



let addQuestionPublish = (type, numberFrom) => {
    //console.log("number from: ", numberFrom)
    if (type == "quiz") {
        var myHeaders = new Headers();
        myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));
        myHeaders.append("Content-Type", "application/json")
        if (numberFrom != undefined) {
            let data = [];
            questionsData.forEach((ele, i) => {
                if (i > numberFrom) {
                    data.push(ele);
                }
            })
            //console.log(data)
            var raw = JSON.stringify(data);
        }
        else {
            var raw = JSON.stringify(questionsData);
        }
        //console.log(raw)

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://mighty-sea-62531.herokuapp.com/api/questions/addquestionsall/" + sessionStorage.getItem("quiz_action_id"), requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json()
            })
            .then(result => {
                //console.log(result);
                quizQuestionsLength = questionsData.length - 1;
                //console.log("after adding quiz: quizQuestionsLength: ", quizQuestionsLength)
                popup("Quiz Published")
                if (numberFrom != undefined) {
                    popup("Questions Added");
                    nextQuestionBtn.classList.remove("disable-btn")
                    getQuizDetails(numberFrom);
                }
                else {
                    var requestOptions = {
                        method: 'GET',
                        redirect: 'follow'
                    };

                    fetch("https://mighty-sea-62531.herokuapp.com/api/actions/openAction/" + sessionStorage.getItem("quiz_action_id"), requestOptions)
                        .then(response => {
                            if (!response.ok) {
                                throw Error(response.statusText);
                            }
                            return response.json()
                        })
                        .then(result => {
                            //console.log(result);
                            sessionStorage.setItem("quiz_active", "true");
                            continueResultBtn("quiz");
                            firstQuestionPublish(sessionStorage.getItem("quiz_action_id"), "quiz");
                        })
                        .catch(error => {
                            console.log('error', error);
                            masterErrorHandler(error, "reload")
                        });
                }
            })
            .catch(error => {
                console.log('error', error);
                masterErrorHandler(error, "new action")
            });
    }
    if (type == "poll") {
        var myHeaders = new Headers();
        myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));
        myHeaders.append("Content-Type", "application/json")
        if (numberFrom != undefined) {
            let data = [];
            pollQuestionsData.forEach((ele, i) => {
                if (i > numberFrom) {
                    data.push(ele);
                }
            })
            var raw = JSON.stringify(data);
        }
        else {
            var raw = JSON.stringify(pollQuestionsData);
        }

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://mighty-sea-62531.herokuapp.com/api/questions/addquestionsall/" + sessionStorage.getItem("poll_action_id"), requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json()
            })
            .then(result => {
                //console.log(result);
                pollQuestionsLength = pollQuestionsData.length - 1;
                if (numberFrom != undefined) {
                    popup("Questions Added");
                    nextPollBtn.classList.remove("disable-btn");
                    getPollDetails(numberFrom);
                }
                else {
                    popup("Poll Published")
                    var requestOptions = {
                        method: 'GET',
                        redirect: 'follow'
                    };

                    fetch("https://mighty-sea-62531.herokuapp.com/api/actions/openAction/" + sessionStorage.getItem("poll_action_id"), requestOptions)
                        .then(response => {
                            if (!response.ok) {
                                throw Error(response.statusText);
                            }
                            return response.json()
                        })
                        .then(result => {
                            //console.log(result);
                            sessionStorage.setItem("poll_active", "true");
                            continueResultBtn("poll");
                            firstQuestionPublish(sessionStorage.getItem("poll_action_id"), "poll");
                        })
                        .catch(error => {
                            console.log('error', error);
                            masterErrorHandler(error, "reload")
                        });
                }
            })
            .catch(error => {
                console.log('error', error);
                masterErrorHandler(error, "new action")
            });
    }
    if (type == "feedback") {
        var myHeaders = new Headers();
        myHeaders.append("auth-token", sessionStorage.getItem("auth_key"));
        myHeaders.append("Content-Type", "application/json")

        if (numberFrom != undefined) {
            let data = [];
            feedbackQuestions.forEach((ele, i) => {
                if (i > numberFrom) {
                    data.push(ele);
                }
            })
            var raw = JSON.stringify(data);
        }
        else {
            var raw = JSON.stringify(feedbackQuestions);
        }
        //console.log(raw)
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://mighty-sea-62531.herokuapp.com/api/questions/addquestionsall/" + sessionStorage.getItem("feedback_action_id"), requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then(result => {
                //console.log(result);
                feedbackQuestionsLength = feedbackQuestions.length - 1;
                if (numberFrom != undefined) {
                    popup("Questions Added");
                    document.querySelector("#next_feedback_btn").classList.remove("disable-btn");
                    getFeedbackDeets();
                }
                else {
                    var requestOptions = {
                        method: 'GET',
                        redirect: 'follow'
                    };

                    fetch("https://mighty-sea-62531.herokuapp.com/api/actions/openAction/" + sessionStorage.getItem("feedback_action_id"), requestOptions)
                        .then(response => {
                            if (!response.ok) {
                                throw Error(response.statusText);
                            }
                            return response.json();
                        })
                        .then(result => {
                            //console.log(result);
                            sessionStorage.setItem("feedback_active", "true");
                            continueResultBtn("feedback");
                            firstQuestionPublish(sessionStorage.getItem("feedback_action_id"), "feedback");
                        })
                        .catch(error => {
                            console.log('error', error);
                            masterErrorHandler(error, "reload");
                        });
                }
            })
            .catch(error => {
                console.log('error', error);
                masterErrorHandler(error, "new action")
            });
    }
}












async function publishAction(e) {
    e.preventDefault();
    await multipleActions("publish").then(res => {
        if (res == true) {
            let actid = "0";
            let quizLoader = document.querySelector(".quiz-loader")
            let pollLoader = document.querySelector(".poll-loader")
            let feedbackLoader = document.querySelector(".feedback-loader")
            quizLoader.classList.remove("show")
            pollLoader.classList.remove("show")
            feedbackLoader.classList.remove("show")
            if (this.id == "publish_quiz") {
                if (sessionStorage.getItem("quiz_action_id")) {
                    if (questionsData.length == 0) {
                        popup("There are no questions to publish", "Error");
                    }
                    else {
                        quizLoader.classList.add("show")
                        addQuestionPublish("quiz")
                    }
                }
                else {
                    //console.log("no quiz made");
                }
            }
            if (this.id == "publish_poll") {
                if (sessionStorage.getItem("poll_action_id")) {
                    if (pollQuestionsData.length == 0) {
                        popup("There are no questions to publish", "Error");
                    }
                    else {
                        pollLoader.classList.add("show");
                        addQuestionPublish("poll")
                    }
                }
                else {
                    //console.log("no poll made");
                }
            }
            if (this.id == "publish_feedback") {
                if (sessionStorage.getItem("feedback_action_id")) {
                    if (feedbackQuestions.length == 0) {
                        popup("There are no questions to publish", "Error");
                    }
                    else {
                        feedbackLoader.classList.add("show");
                        addQuestionPublish("feedback")
                    }
                }
                else {
                    //console.log("no feedback made");
                }
            }
        }
        else {
            return;
        }
    })
}


const PublishBtn = document.querySelectorAll(".publish-btn");
PublishBtn.forEach(ele => {
    ele.addEventListener("click", publishAction);
})


/* Handling turning isOpen on actions to true: End */






/* handling the ham functionality */


const ham = document.querySelector(".ham");
const mobileNav = document.querySelector(".options-container-mobile");


let open = () => {
    mobileNav.classList.toggle("open");
}
let changeText = (ele) => {
    navText.innerHTML = ele.innerHTML;
}
ham.addEventListener("click", open);
const navButtons = document.querySelectorAll(".options-container-mobile p");
navButtons.forEach(ele => {
    ele.addEventListener("click", () => {
        if (ele.style.cssText == "color: black;") {
            open();
            changeText(ele);
        }
    })
})















/* handling the ham functionality: End */



let performCheck = () => {
    if (!sessionStorage.getItem("quiz_action_id")) {
        quizSelector.forEach(ele => {
            ele.style.color = "rgb(189,189,189)";
            ele.removeEventListener("click", selectItem);
        })
        document.querySelector(".Quiz-internal").classList.remove("show-action");
        document.querySelector(".quiz-result").classList.remove("show-select");
        document.querySelector(".quiz-summary").classList.remove("show");
        document.querySelector(".quiz-create-container").classList.add("show");
        document.querySelector(".quiz-create").classList.add("show-select");
        document.querySelector(".Quiz-name").classList.add("show-action");
        resetActionVariables("quiz");
    }
    if (!sessionStorage.getItem("poll_action_id")) {
        pollSelector.forEach(ele => {
            ele.style.color = "rgb(189,189,189)";
            ele.removeEventListener("click", selectItem);
        })

        document.querySelector(".Poll-internal").classList.remove("show-action");
        document.querySelector(".poll-result").classList.remove("show-select")
        document.querySelector(".poll-summary").classList.remove("show");
        document.querySelector(".poll-create-container").classList.add("show");
        document.querySelector(".poll-create").classList.add("show-select");
        document.querySelector(".Poll-name").classList.add("show-action");
        resetActionVariables("poll")
    }
    if (!sessionStorage.getItem("feedback_action_id")) {
        feedbackSelector.forEach(ele => {
            ele.style.color = "rgb(189,189,189)"
            ele.removeEventListener("click", selectItem);
        })
        document.querySelector(".Feedback-internal").classList.remove("show-action");
        document.querySelector(".feedback-result").classList.remove("show-select")
        document.querySelector(".feedback-summary").classList.remove("show");
        document.querySelector(".feedback-create-container").classList.add("show");
        document.querySelector(".feedback-create").classList.add("show-select");
        document.querySelector(".Feedback-name").classList.add("show-action");

    }
}
performCheck();




let addFormData = (i, type) => {
    //console.log(i, type);
}


const formBtn = document.querySelectorAll(".form-btn");
const reviewBtn = document.querySelectorAll(".review-btn");

let renderReviewPage = (type) => {
    let deetsDisplayDiv = document.querySelector(`.extra-${type}-deets`);
    let title = document.querySelector(`.${type}-title`);
    title.innerHTML = "Action Title: " + sessionStorage.getItem(`${type}-Title`);
    //console.log(deetsDisplayDiv)
    deetsDisplayDiv.innerHTML = "";
    if (type == "quiz") {
        //console.log(questionsData)
        let questionDeetsDiv;
        questionsData.forEach((question, i) => {
            questionDeetsDiv = document.createElement("div");
            questionDeetsDiv.classList.add("question-deets");
            let pSlno = document.createElement("p");
            pSlno.innerHTML = `${(i + 1)}.`;
            let pTitle = document.createElement("p");
            pTitle.innerHTML = `${question["name"]}`
            let Icons = document.createElement("div");
            Icons.classList.add("alt-icons")
            let icon1 = document.createElement("i")
            let icon2 = document.createElement("i")
            icon1.classList.add("material-icons");
            icon2.classList.add("material-icons");
            icon1.innerHTML = "delete";
            icon2.innerHTML = "mode_edit";
            icon1.addEventListener("click", () => {

                renderReviewPage("quiz");
            })
            icon2.addEventListener("click", () => {
                let form = document.querySelector(`.quiz-create-container`);
                let reviewControl = document.querySelector(`.quiz-summary`);
                form.reset();
                reviewControl.classList.remove("show");
                form.classList.add("show-action");
                document.querySelector("#add_question_btn").innerHTML = "Insert Edited Question";
                document.querySelector("#add_question_btn").value = i;
            })
            Icons.appendChild(icon1);
            Icons.appendChild(icon2);
            questionDeetsDiv.appendChild(pSlno)
            questionDeetsDiv.appendChild(pTitle);
            questionDeetsDiv.appendChild(Icons);
            deetsDisplayDiv.appendChild(questionDeetsDiv)
        })

    }
    if (type == "poll") {
        //console.log(pollQuestionsData)
        pollQuestionsData.forEach((question, i) => {
            let questionDeetsDiv = document.createElement("div");
            questionDeetsDiv.classList.add("question-deets");
            let pSlno = document.createElement("p");
            pSlno.innerHTML = `${(i + 1)}.`;
            let pTitle = document.createElement("p");
            pTitle.innerHTML = `${question["name"]}`
            let Icons = document.createElement("div");
            Icons.classList.add("alt-icons")
            let icon1 = document.createElement("i")
            let icon2 = document.createElement("i")
            icon1.classList.add("material-icons");
            icon2.classList.add("material-icons");
            icon1.innerHTML = "delete";
            icon2.innerHTML = "mode_edit";
            icon1.addEventListener("click", () => {
                pollQuestionsData.splice(i, 1);
                //console.log(pollQuestionsData)
                renderReviewPage("poll");
            })
            icon2.addEventListener("click", () => {
                let form = document.querySelector(`.poll-create-container`);
                let reviewControl = document.querySelector(`.poll-summary`);
                form.reset();
                reviewControl.classList.remove("show");
                form.classList.add("show-action");
                document.querySelector("#add_poll_btn").innerHTML = "Insert Edited Question"
                document.querySelector("#add_poll_btn").value = i;
            })
            Icons.appendChild(icon1);
            Icons.appendChild(icon2);
            questionDeetsDiv.appendChild(pSlno)
            questionDeetsDiv.appendChild(pTitle);
            questionDeetsDiv.appendChild(Icons);
            deetsDisplayDiv.appendChild(questionDeetsDiv)
        })
    }
    if (type == "feedback") {
        //console.log(feedbackQuestions)
        feedbackQuestions.forEach((question, i) => {
            let questionDeetsDiv = document.createElement("div");
            questionDeetsDiv.classList.add("question-deets");
            let pSlno = document.createElement("p");
            pSlno.innerHTML = `${(i + 1)}.`;
            let pTitle = document.createElement("p");
            pTitle.innerHTML = `${question["name"]}`
            let Icons = document.createElement("div");
            Icons.classList.add("alt-icons")
            let icon1 = document.createElement("i")
            let icon2 = document.createElement("i")
            icon1.classList.add("material-icons");
            icon2.classList.add("material-icons");
            icon1.innerHTML = "delete";
            icon2.innerHTML = "mode_edit";
            icon1.addEventListener("click", () => {
                //console.log(i);
                feedbackQuestions.splice(i, 1);
                //console.log(feedbackQuestions)
                renderReviewPage("feedback");
            })
            icon2.addEventListener("click", () => {
                let form = document.querySelector(`.feedback-create-container`);
                form.reset();
                let reviewControl = document.querySelector(`.feedback-summary`);
                reviewControl.classList.remove("show");
                form.classList.add("show-action");
                document.querySelector("#add_feedback_btn").innerHTML = "Insert Edited Question";
                document.querySelector("#add_feedback_btn").value = i;
            })
            Icons.appendChild(icon1);
            Icons.appendChild(icon2);
            questionDeetsDiv.appendChild(pSlno)
            questionDeetsDiv.appendChild(pTitle);
            questionDeetsDiv.appendChild(Icons);
            deetsDisplayDiv.appendChild(questionDeetsDiv)
        })
    }
}














function ReviewPage(e) {
    e.preventDefault();
    //console.log(this.classList)
    let form = document.querySelector(`.${this.classList[2]}-create-container`);
    let reviewControl = document.querySelector(`.${this.classList[2]}-summary`);
    form.classList.remove("show")
    reviewControl.classList.add("show");
    renderReviewPage(this.classList[2]);
}




function FormPage() {
    let form = document.querySelector(`.${this.classList[1]}-create-container`);
    let reviewControl = document.querySelector(`.${this.classList[1]}-summary`);
    reviewControl.classList.remove("show");
    form.classList.add("show");
}





reviewBtn.forEach((ele) => {
    ele.addEventListener("click", ReviewPage)
})

formBtn.forEach(ele => {
    ele.addEventListener("click", FormPage)
})



const eventNameDivs = document.querySelectorAll(".current-event-name")

const eventCodeDivs = document.querySelectorAll(".current-event-code")
let renderCurrentEventDeets = () => {
    let event = JSON.parse(sessionStorage.getItem("the_current_event"));
    //console.log(event);
    eventNameDivs.forEach(ele => {
        ele.innerHTML = `Event Name: ${event["Name"]}`
    })
    eventCodeDivs.forEach(ele => {
        ele.innerHTML = `Event Code: ${event["Code"]}`;
    })
}
if (sessionStorage.getItem("the_current_event")) {
    renderCurrentEventDeets();
}




let addTheme = () => {
    if (sessionStorage.getItem("color")) {
        document.documentElement.style.setProperty('--main-color', sessionStorage.getItem("color"));
        document.documentElement.style.setProperty('--main-shadow-hover', `inset -6px -6px 10px ${sessionStorage.getItem("color")}, inset 6px 6px 20px rgba(0, 0, 0, 0.2)`)
    }
}
addTheme();





const overallThemeBtns = document.querySelectorAll(".overall-theme")

function chooseTheme() {
    if (this.id == "red_theme") {
        sessionStorage.setItem("color", "#EA4C89")
    }
    if (this.id == "orange_theme") {
        sessionStorage.setItem("color", "#F89224")
    }
    if (this.id == "blue_theme") {
        sessionStorage.setItem("color", "#2784FB")

    }
    if (this.id == "dark_theme") {
        sessionStorage.setItem("color", "#83D39D")
    }
    addTheme();
}

overallThemeBtns.forEach(ele => {
    ele.addEventListener("click", chooseTheme)
})


/* closing Actions if any active */

function closeActiveActions() {
    let types = ["quiz", "poll", "feedback"];
    types.forEach(ele => {
        if (sessionStorage.getItem(`${ele}_active`) == "true") {
            closeAction(ele, "ref");
        }
    })
}
closeActiveActions();






/* closing Actions if any active: End */

function checkQuestions(e) {
    e.preventDefault();
    //console.log(feedbackQuestionsLength, feedbackQuestions.length)
    if (this.classList[1] == "quiz" && quizQuestionsLength != (questionsData.length - 1)) {
        addQuestionPublish("quiz", quizQuestionsLength);
    }
    if (this.classList[1] == "poll" && pollQuestionsLength != (pollQuestionsData.length - 1)) {
        addQuestionPublish("poll", pollQuestionsLength);
    }
    if (this.classList[1] == "feedback" && (feedbackQuestionsLength != (feedbackQuestions.length - 1))) {
        addQuestionPublish("feedback", feedbackQuestionsLength);
    }
}














/* Handling continuing Action */

const continueBtn = document.querySelectorAll(".continue-btn");

continueBtn.forEach(ele => {
    ele.addEventListener("click", handleInvert);
    ele.addEventListener("click", checkQuestions)
})



/* Handling continuing Action: End */



/* Handling multiple Actions trying to go live */


async function multipleActions(publish) {
    return new Promise(async (resolve, reject) => {
        let types = ["quiz", "poll", "feedback"];
        let closeTypes;
        let flag = 0;
        //console.log("multipleActions")
        types.forEach(ele => {
            if (sessionStorage.getItem(`${ele}_active`) == "true") {
                flag++;
                closeTypes = ele;
            }
        })
        if (flag == 1) {
            if (window.confirm("An Action is still live, you will have to close it?")) {
                if (publish == "publish") {
                    await closeAction(closeTypes, "normal", "nohome")
                }
                else {
                    await closeAction(closeTypes, "normal")
                }
                resolve(true)
            }
            else {
                resolve(false);
            }
        }
        else {
            resolve(true)
        }
    })
}









/* Handling multiple Actions trying to go live: End */



// Login Validation





// Login Validataion: End 
