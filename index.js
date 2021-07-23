let addBtn = document.querySelector(".add");
let body = document.querySelector("body");

let grid = document.querySelector(".grid");

let colors = ["pink", "blue", "green", "black"];

let allFiltersChildren = document.querySelectorAll(".filter div");

for (let i = 0; i < allFiltersChildren.length; i++) {
    allFiltersChildren[i].addEventListener("click", function(e) {

        if (e.currentTarget.classList.contains("color-selected")) {
            e.currentTarget.classList.remove("color-selected");
            loadTasks();
            return;
        } else {
            e.currentTarget.classList.add("color-selected");
        }


        let filterColor = e.currentTarget.classList[0];
        loadTasks(filterColor);

    });
}


let deleteBtn = document.querySelector(".delete");

let deleteMode = false;



//agar localStorage ke pass koi data nhi he so  AllTickets vala object blank hoga matlab undefined hoga
//so AllTickets object bano aur stringfy karo aur localstorage me dal do
//localStorage accpts data in form of only strings so we have to convert object to string means stringfy it so that we can upload it on 
//localStorage and when we want to update or work on that object in code so convert that stringfy object into original object by JSON.parse

if (localStorage.getItem("AllTickets") == undefined) {
    let allTickets = {};

    allTickets = JSON.stringify(allTickets);

    localStorage.setItem("AllTickets", allTickets)
}

loadTasks();

//add a eventlistener to deletebtn
deleteBtn.addEventListener("click", function(e) {
    //if deleteBtn ke pass "delete-selected" class he tho usko remove kardo aur deletemode ko false set kardo
    //kyuki deletebtn already selected he by user

    if (e.currentTarget.classList.contains("delete-selected") == true) {
        e.currentTarget.classList.remove("delete-selected");
        deleteMode = false;
    } else if (e.currentTarget.classList.contains("delete-selected") == false) {
        e.currentTarget.classList.add("delete-selected");
        deleteMode = true;
    }

});


addBtn.addEventListener("click", function() {

    //jab me add button ko click karo tho agar delete button selected tha so off delete
    deleteBtn.classList.remove("delete-selected");
    deleteMode = false;

    let premodal = document.querySelector(".modal");
    if (premodal != null) return;


    let div = document.createElement("div"); //<div></div>

    div.classList.add("modal"); //<div class="modal"></div>

    div.innerHTML =
        `<div class="task-section">
    <div class="task-inner-container" contenteditable="true"></div>
          </div>

<div class="modal-priority-section">

    <div class="priority-inner-container">

        <div class="modal-priority pink"></div>
        <div class="modal-priority blue"></div>
        <div class="modal-priority green"></div>
        <div class="modal-priority black selected"></div>

    </div>

</div>`;

    let ticketColor = "black";

    let allModalPriority = div.querySelectorAll(".modal-priority");

    for (let i = 0; i < allModalPriority.length; i++) {
        //sarro par gya aur check kara kaunsa click he
        allModalPriority[i].addEventListener("click", function(e) {
            //sarro par gya aur unmese class "selected" ko remove kiya
            for (let j = 0; j < allModalPriority.length; j++) {
                allModalPriority[j].classList.remove("selected")
            }
            //phir jho clicked he uspar "selected" ko add kar
            e.currentTarget.classList.add("selected");

            ticketColor = e.currentTarget.classList[1];
        });

    }

    let taskInnerContainer = div.querySelector(".task-inner-container");

    taskInnerContainer.addEventListener("keydown", function(e) {
        if (e.key == "Enter") {
            let id = uid();
            let task = e.currentTarget.innerText;

            //{AllTickets=uniqueid:{color,taskvalue},};
            //example->{AllTickets= #b7JgFk : { color:pink, taskValue:"gois"}}
            // step1 => jobhi data hai localstorage use lekr aao
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            // step2 => usko update kro
            let ticketoj = {
                color: ticketColor,
                taskValue: task
            }

            allTickets[id] = ticketoj;

            // step3 => wapis updated object ko localstorage me save krdo
            localStorage.setItem("AllTickets", JSON.stringify(allTickets));

            let ticketDiv = document.createElement("div");

            ticketDiv.classList.add("ticket");

            ticketDiv.setAttribute("data-id", id);

            ticketDiv.innerHTML = `<div data-id="${id}" class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">
                #${id}
            </div>
            <div data-id="${id}" class="actual-task" contenteditable="true">
               ${task}
            </div>`;

            let ticketColorDiv = ticketDiv.querySelector(".ticket-color");

            let actualTaskDiv = ticketDiv.querySelector(".actual-task");

            actualTaskDiv.addEventListener("input", function(e) {
                let updatedTask = e.currentTarget.innerText;

                let currTicketId = e.currentTarget.getAttribute("data-id");
                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                allTickets[currTicketId].taskValue = updatedTask;

                localStorage.setItem("AllTickets", JSON.stringify(allTickets));
            });


            ticketColorDiv.addEventListener("click", function(e) {
                // let colors = ["pink", "blue", "green", "black"];
                let currTicketId = e.currentTarget.getAttribute("data-id");

                let currColor = e.currentTarget.classList[1]; //green

                let index = -1;

                for (let i = 0; i < colors.length; i++) {
                    if (colors[i] == currColor) index = i;
                }

                index++;
                index = index % 4;

                let newColor = colors[index];

                //1- all tickets lana ; 2- update krna ; 3- wapis save krna

                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                allTickets[currTicketId].color = newColor;

                localStorage.setItem("AllTickets", JSON.stringify(allTickets));


                ticketColorDiv.classList.remove(currColor);
                ticketColorDiv.classList.add(newColor);
            });

            //when deletemode is true means deletebtn is selected so remove ticket which has been clicked
            ticketDiv.addEventListener('click', function(e) {
                if (deleteMode == true) {

                    let currTicketId = e.currentTarget.getAttribute("data-id");
                    e.currentTarget.remove();

                    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                    delete allTickets[currTicketId];

                    localStorage.setItem("AllTickets", JSON.stringify(allTickets));


                }
            });

            grid.append(ticketDiv);

            div.remove();
        } else if (e.key === "Escape") {
            div.remove()
        }


    });

    body.append(div);

});


function loadTasks(color) {
    let ticketsOnUi = document.querySelectorAll(".ticket");

    for (let i = 0; i < ticketsOnUi.length; i++) {
        ticketsOnUi[i].remove();
    }
    //1- fetch alltickets data

    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

    //2- create ticket UI for each ticket obj
    //3- attach required listeners
    //4- add tickets in the grid section of ui

    for (x in allTickets) {
        let currTicketId = x;
        let singleTicketObj = allTickets[x]; //pink

        //passed color was black
        if (color) {
            if (color != singleTicketObj.color) continue;
        }

        let ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");

        ticketDiv.setAttribute("data-id", currTicketId);

        ticketDiv.innerHTML = ` <div data-id="${currTicketId}" class="ticket-color ${singleTicketObj.color}"></div>
            <div class="ticket-id">
            #${currTicketId}
            </div>
            <div data-id="${currTicketId}" class="actual-task" contenteditable="true">
            ${singleTicketObj.taskValue}
            </div>`;

        let ticketColorDiv = ticketDiv.querySelector(".ticket-color");

        let actualTaskDiv = ticketDiv.querySelector(".actual-task");

        actualTaskDiv.addEventListener("input", function(e) {
            let updatedTask = e.currentTarget.innerText;

            let currTicketId = e.currentTarget.getAttribute("data-id");
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            allTickets[currTicketId].taskValue = updatedTask;

            localStorage.setItem("AllTickets", JSON.stringify(allTickets));
        });

        ticketColorDiv.addEventListener("click", function(e) {
            // let colors = ["pink", "blue", "green", "black"];

            let currTicketId = e.currentTarget.getAttribute("data-id");

            let currColor = e.currentTarget.classList[1]; //green

            let index = -1;
            for (let i = 0; i < colors.length; i++) {
                if (colors[i] == currColor) index = i;
            }

            index++;
            index = index % 4;

            let newColor = colors[index];

            //1- all tickets lana ; 2- update krna ; 3- wapis save krna

            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            allTickets[currTicketId].color = newColor;

            localStorage.setItem("AllTickets", JSON.stringify(allTickets));

            ticketColorDiv.classList.remove(currColor);
            ticketColorDiv.classList.add(newColor);
        });

        ticketDiv.addEventListener("click", function(e) {
            if (deleteMode) {
                let currTicketId = e.currentTarget.getAttribute("data-id");

                e.currentTarget.remove();

                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                delete allTickets[currTicketId];

                localStorage.setItem("AllTickets", JSON.stringify(allTickets));
            }
        });

        grid.append(ticketDiv);
    }

}