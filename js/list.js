const listsContainer = document.querySelector(' [data-lists]')

const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')

const deleteListButton = document.querySelector('[data-delete-list-button]')

const listDisplayContainer = document.querySelector('[data-list-display-container]')

const listElementTitle = document.querySelector('[data-list-title]')
const listElementCount = document.querySelector('[data-list-count]')

const tasksContainer = document.querySelector('[data-tasks]')

const taskTemplate = document.getElementById('task-template')

const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearTaskButton = document.querySelector('[data-clear-list-button]')


const local_storage_key = 'tasks.list';
const local_storage_selected_List_Id_key = 'tasks.selectedListId';

let lists = JSON.parse(localStorage.getItem(local_storage_key)) || []

let selectedListId = localStorage.getItem(local_storage_selected_List_Id_key)



listsContainer.addEventListener('click' , e => {
        if(e.target.tagName.toLowerCase() === 'li'){
            selectedListId = e.target.dataset.listId 
            saveAndRender()
        }
})


tasksContainer.addEventListener('click' , e => {
    if(e.target.tagName.toLowerCase() === 'input'){
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)
    }
})


deleteListButton.addEventListener('click' , e => {
    lists = lists.filter(list =>  list.id !== selectedListId)

    selectedListId = null 
    saveAndRender()
})

clearTaskButton.addEventListener('click' , e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})

newListForm.addEventListener('submit' , e => {
    e.preventDefault()

    const listName = newListInput.value 

    if(listName == null || listName === '')return
    const list = createList(listName)
    newListInput.value = null;

    lists.push(list)

saveAndRender()

})


newTaskForm.addEventListener('submit', e => {
    e.preventDefault()

    const taskName = newTaskInput.value

    if (taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput.value = null;

 const selectedList = lists.find(list => list.id === selectedListId)

 selectedList.tasks.push(task)

    saveAndRender()

})

function createList(name) {
  return  { id : Date.now().toString() , name :name , tasks: [] }
}

function createTask(name) {
  return  { id : Date.now().toString() , name :name , complete : false }
}

function saveAndRender () {
save()
render()
}

function save(){
    localStorage.setItem( local_storage_key , JSON.stringify(lists))
    localStorage.setItem(local_storage_selected_List_Id_key , selectedListId)
}


function render () {
clearElement(listsContainer)
renderList()

let selectedList = lists.find(list => list.id === selectedListId)

if (selectedList == null){
    listDisplayContainer.style.display = 'none'
}else{
    listDisplayContainer.style.display = ''
    listElementTitle.innerText = selectedList.name 

    renderTaskCount(selectedList)
    clearElement(tasksContainer)
    renderTask(selectedList)
}

 }


 function renderTask(selectedList) {

     selectedList.tasks.forEach(task => {
         const taskElement = document.importNode(taskTemplate.content , true)
         const checkBox = taskElement.querySelector('input')
         checkBox.id = task.id
         checkBox.checked = task.complete
         const label = taskElement.querySelector('label')
         label.htmlFor = task.id 
         label.append(task.name)

         tasksContainer.appendChild(taskElement)

     })
 }

 function renderTaskCount(selectedList){
     const incompleteTasks = selectedList.tasks.filter(task =>!task.complete).length

     const taskString = incompleteTasks === 1 ? 'task' : 'tasks'

     listElementCount.innerText = `${incompleteTasks} ${taskString} remaining`
 }


function renderList(){
lists.forEach(list => {
            const listElement = document.createElement('li')
            listElement.dataset.listId = list.id
            listElement.classList.add("list-name")
            listElement.innerText = list.name

            if (list.id === selectedListId) {
                listElement.classList.add('active-list')
            }

            listsContainer.appendChild(listElement)
        }
)}

function clearElement (e) {
while (e.firstChild){
    e.removeChild(e.firstChild)
}
}



render()