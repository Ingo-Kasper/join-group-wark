let firebase_URL =
  "https://join-2-b992b-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts=[];
let assignedPersons=[];
let category;
let priority;
let subtaskList=[];
let taskInformation=[];
let initials=[];

/**
 * Diese Funktion ist zum rendern der Hauptbausteine.
 */
function initAddTask() {
    renderMainForm();
}

/**
 * Diese Funktion sorgt dafür, dass die Funktionen für den Hauptteil geladen werden.
 */
async function renderMainForm(){
    await loadContacts();
}

/**
 * Diese Funktion soll die Personen, die einen Haken in der Checkbox erhalten feststellen und im Array assignedPersons abspeichern.
 * @param {*} i 
 */
function addAssignedPersons(i){
    let inputCheckbox = document.getElementById(`inputCheckbox-${i}`);
    if (inputCheckbox.checked) {
        if (!assignedPersons.includes(contacts[i].name)) {
            assignedPersons.push(contacts[i].name);
        }
    } else {
        assignedPersons = assignedPersons.filter(name => name !== contacts[i].name);
    }
    showAssignedPersons();
}

/**
 * Diese Funktion dient dazu bei onclick die Liste der Kontakte mit den Initialien und der Checkbox zu rendern.
 */
function rollContactsList(){
    let assignContactsList = document.getElementById('assignContactsList');
    assignContactsList.classList.toggle('d-none');
    assignContactsList.innerHTML='';
    for(i=0; i<contacts.length; i++){
        let isChecked = assignedPersons.includes(contacts[i]['name']) ? 'checked' : '';
        assignContactsList.innerHTML +=`
        <div class="one-person-div">
            <div class="assigned-person-initials">${profileInitials(i)}</div>
            <div>${contacts[i]['name']}</div>
            <input id="inputCheckbox-${i}"type="checkbox" onclick="addAssignedPersons(${i})"${isChecked}>
        </div>`
    }
}

/**
 * Diese Funktion dient erstmal dazu, um im Inputfeld darzustellen, welche Personen zugeordnet worden.
 */
function showAssignedPersons() {
    let showAssignedPersons = document.getElementById('assignedPersons');
    showAssignedPersons.value = assignedPersons.join(", ");
}

/**
 * In dieser Funktion werden die Initialien der Kontakte rausgefiltert und wiedergegeben
 *
 * @param {*} i
 * @returns
 */
function profileInitials(i) {
    let names = contacts[i]['name'].split(" "),
      initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }

/**
 * Diese Funktion soll dazu dienen, die Personen auszuwählen und die Personendaten 
 * sowie der Kreis mit den Initialien drin sollen gesehen werden, wenn man draufklickt.
 * @param {*} i 
 */
function selectPerson(i){
    let inputCheckbox = document.getElementById('inputCheckbox');
    inputCheckbox.innerHTML= assignedPersons += contacts[i]['name'];
    showAssignedPersons();
}

/**Diese Funktion soll den Wert für die Wichtigkeit abspeichern */
function selectPrio(x){
    if(x =='urgent'){
        document.getElementById('urgent').style.backgroundColor = "red";
        document.getElementById('medium').style.backgroundColor = "white";
        document.getElementById('low').style.backgroundColor = "white";
    }else if(x =='medium'){
        document.getElementById('urgent').style.backgroundColor = "white";
        document.getElementById('medium').style.backgroundColor = "yellow";
        document.getElementById('low').style.backgroundColor = "white";
    }else if(x =='low'){
        document.getElementById('urgent').style.backgroundColor = "white";
        document.getElementById('medium').style.backgroundColor = "white";
        document.getElementById('low').style.backgroundColor = "green";
    }
    priority= x;
}

/**
 * Diese Funktion soll zum Toggeln der d-none Klasse bei dem Kategoriefeld sein
 */
function rollCategories(){
    let dropdownCategories = document.getElementById('dropdownCategories');
    dropdownCategories.classList.toggle('d-none');     
}
/**
 * Diese Funktion sorgt dafür, dass alle Inputfelder wieder geleert werden
 */
function clearForm(){
    assignedPersons=[];
    category='';
    subtaskList='';
    priority='';
    document.getElementById('urgent').style.backgroundColor = "white";
    document.getElementById('medium').style.backgroundColor = "white";
    document.getElementById('low').style.backgroundColor = "white";
    document.getElementById('category1').style.backgroundColor ='white';
    document.getElementById('category2').style.backgroundColor = 'white';
}

/**
 * Diese Funktion dient zum abspeichern einer Kategorie.
 * @param {*} x 
 */
function selectCategory(x){
    if(x =='Technical Task'){
        document.getElementById('category1').style.backgroundColor ='grey';
        document.getElementById('category2').style.backgroundColor = 'white';
        document.getElementById('categoryInput').value = x;
    }else if(x=='User Story'){
        document.getElementById('category1').style.backgroundColor ='white';
        document.getElementById('category2').style.backgroundColor = 'grey';
        document.getElementById('categoryInput').value = x;
    }
    category=x;
}

/**
 * Diese Funktion dient dazu Unteraufgaben zu erstellen und speichern.
 */
function addSubtask(){
    let subtask = document.getElementById('subtask').value.trim();
    if (subtask) {
        subtaskList.push(subtask);
        subtask.value = "";
    }
    renderSubtasks();
}

/**
 * Diese Funktion soll die erstellten Unteraufgaben, die im array subtaskList gespeichert sind rendern.
 */
function renderSubtasks(){
    let subtaskListDiv= document.getElementById('subtaskList');
    subtaskListDiv.innerHTML='';
    for(i=0; i<subtaskList.length; i++){
        subtaskListDiv.innerHTML +=`
        <div class="oneSubtask" id="oneSubtask-${i}" onmouseover="subtaskHoverEffekt(${i})" onmouseout= "subtaskNoHoverEffekt(${i})">
            <div class="" id="subtaskListText-${i}">${subtaskList[i]}</div>
            <input class="d-none" value="${subtaskList[i]}" id="editInput-${i}">
            <div class="d-none" id="editAndTrash-${i}">
                <img src="../assets/img/editTask.png" id="leftImage-${i}" onclick="editSubtask(${i})">
                |
                <img src="../assets/img/deleteTask.png" id="rightImage-${i}" onclick="deleteSubtask(${i})">
            </div>
        </div>
        `;
    }
}

/**
 * Mit dieser Funktion soll man die Subtask an genau der entsprechenden stelle ändern können.
 * @param {*} i 
 */
function editSubtask(i){
    let subtaskListText = document.getElementById(`subtaskListText-${i}`);
    subtaskListText.classList.add('d-none');
    let editInput = document.getElementById(`editInput-${i}`);
    editInput.classList.remove('d-none');
    let editAndTrash = document.getElementById(`editAndTrash-${i}`);
    editAndTrash.innerHTML='';
    editAndTrash.innerHTML= `
    <img src="../assets/img/deleteTask.png" id="leftImage-${i}" onclick="deleteSubtask(${i})">
    |
    <img src="../assets/img/checkTask.png" id="rightImage-${i}" onclick="saveChangedSubtask(${i})">
    `
}

/**
 * Durch Aktivierung dieser Funktion können Änderungen an Unteraufgaben gespeichert werden.
 * @param {*} i 
 */
function saveChangedSubtask(i){
    let editInput = document.getElementById(`editInput-${i}`).value.trim();
    subtaskList.splice(i,1, editInput);
    renderSubtasks();
}

/**
 * Diese Funktion dient zum Löschen von subtasks.
 * @param {*} i 
 */
function deleteSubtask(i){
    subtaskList.splice(i,1);
    renderSubtasks();
}

/**
 * Diese Funktion soll den onmouseover effekt wieder mit onmouseout rückgängig machen.
 * @param {*} i 
 */
function subtaskNoHoverEffekt(i){
    let oneSubtask = document.getElementById(`oneSubtask-${i}`);
    oneSubtask.style.backgroundColor ="white";
    let trashAndEdit = document.getElementById(`editAndTrash-${i}`);
    trashAndEdit.classList.add('d-none');
}

/**
 * Diese Funktion soll den onmouseover effekt hinzufügen.
 * @param {*} i 
 */
function subtaskHoverEffekt(i){
    let oneSubtask = document.getElementById(`oneSubtask-${i}`);
    oneSubtask.style.backgroundColor ="grey";
    let trashAndEdit = document.getElementById(`editAndTrash-${i}`);
    trashAndEdit.classList.remove('d-none');
}

/**
 * Diese Funktion speichert die ausgewählten Daten in einem Array und schickt sie an die Funktion, die sie an den Server verschickt.
 */
async function createTask(){
    let titleOfTask = document.getElementById('titleOfTask').value.trim();
    let descriptionOfTask = document.getElementById('descriptionOfTask').value.trim();
    // assignedPersons;
    let dateOfTask = document.getElementById('dateOfTask').value.trim();
    // category;
    // priority;
    // subtaskList;
    let newTaskInformation ={
        title: titleOfTask,
        description: descriptionOfTask,
        assigned: assignedPersons,
        dueDate: dateOfTask,
        category:category,
        priority:priority,
        subtaskList:subtaskList,
    }
    await postData("/tasks", newTaskInformation);
    clearForm();
}

/**
 * Mit dieser Funktion werden Daten im Firebase gespeichert.
 * @param {*} path 
 * @param {*} data 
 */
async function postData(path="", data){
    await fetch(firebase_URL + path + ".json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
}

/**
 * In dieser Funktion werden die Daten aus dem Firebase geladen.
 *
 * @param {*} path
 */
async function loadContacts(path = "/contacts") {
    let response = await fetch(firebase_URL + path + ".json");
    let responseToJson = await response.json();
    if (responseToJson) {
        contacts = [];
      Object.keys(responseToJson).forEach((key) => {
        contacts.push({
          id: key,
          name: responseToJson[key]["name"],
          email: responseToJson[key]["email"],
          phone: responseToJson[key]["phone"],
        });
      });
      // Sortiere die Kontakte alphabetisch nach Name
      contacts.sort((a, b) => a.name.localeCompare(b.name));
    }
  }