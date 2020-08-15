const tableBody = document.querySelector('#tableBody');
const homeWorkForm = document.querySelector('#addHomeWorkForm');

const renderDoc = (doc) => {
    const tableRow = document.createElement('tr');
    const updateButtontd = document.createElement('td');
    const updateButton = document.createElement('button');
    const deleteButtontd = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = tableRow.getAttribute('data-id');
        db.collection('HomeWorks').doc(id).delete();
    });

    updateButton.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = tableRow.getAttribute('data-id');
        homeWorkForm.Asignature.setAttribute('data-id',doc.id);
        homeWorkForm.Asignature.value = standardCells.Asignature.innerHTML;
        homeWorkForm.Description.value = standardCells.Description.innerHTML
        homeWorkForm.DueWeek.value = standardCells.DueWeek.innerHTML
        homeWorkForm.Completed.checked = standardCells.Completed
    });
    updateButton.innerHTML = "Update";
    deleteButton.innerHTML = "Delete";
    deleteButtontd.appendChild(deleteButton);
    updateButtontd.appendChild(updateButton);

    let standardCells = {};
    for(const prop in doc){
        eval(`let ${prop}  = document.createElement('td')
        ${prop}.textContent = doc[prop];
        standardCells = {${prop},...standardCells}`);
    }
    tableRow.setAttribute('data-id',doc.id);
    tableRow.appendChild(standardCells.id)
    tableRow.appendChild(standardCells.Asignature)
    tableRow.appendChild(standardCells.Description)
    tableRow.appendChild(standardCells.DueWeek)
    tableRow.appendChild(standardCells.Completed)
    tableRow.appendChild(updateButtontd)
    tableRow.appendChild(deleteButtontd)

    tableBody.appendChild(tableRow);

}

const getHomeWorks = async()=>{
    const snapShot = await db.collection('HomeWorks').get();
    snapShot.docs.forEach(doc => {
        renderDoc({id:doc.id, ...doc.data()});
    });
}



homeWorkForm.addEventListener('submit',(evt)=>{
    evt.preventDefault()
        
        const changeId = homeWorkForm.Asignature.getAttribute('data-id');
    let li = tableBody.querySelector('[data-id=' + changeId + ']');
    if(li)return update(changeId);
    const request = {
        "Asignature":homeWorkForm.Asignature.value,
        "Description":homeWorkForm.Description.value,
        "DueWeek":homeWorkForm.DueWeek.value,
        "Completed":homeWorkForm.Completed.checked,
    };
    for (prop in request){
        if(request[prop] === ""){
            alert("A field is Missing");
            return
        }
    }
    db.collection('HomeWorks').add(request)
    homeWorkForm.reset();
    tableBody.innerHTML = "";
    getHomeWorks();
})

db.collection('HomeWorks').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
         if (change.type == 'removed'){
            let li = tableBody.querySelector('[data-id=' + change.doc.id + ']');
            tableBody.removeChild(li);
        }
    });
});

const update=(id) =>{
    const request = {
        "Asignature":homeWorkForm.Asignature.value,
        "Description":homeWorkForm.Description.value,
        "DueWeek":homeWorkForm.DueWeek.value,
        "Completed":homeWorkForm.Completed.checked,
    };
    db.collection('HomeWorks').doc(id).update(request);
    let li = tableBody.querySelector('[data-id=' + id + ']');
    tableBody.removeChild(li);
    renderDoc({id:id,...request});
    homeWorkForm.reset();
}



getHomeWorks();

