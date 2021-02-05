/*
ctr + k +c = comment multiple lines
ctr + k + u = uncomment multiple lines
TODO:


-make a difference between done and not done
    -make a plus button that opens a text box to add a sub-item (maybe too advanced)

  -movie rating idea using idmb

  -Go back to timer and fix the disaply option use mustache
  -make it into a class
DONE:
-make it possible to press the enter key to add a new item
    + enter key now works but I had to use document, so if there are more than one notes it might click all the buttons
    + will probably need to give the buttons unique Ids
-if text box is empty prevent from adding anything
-save the list
-load the list on opening the page...localStorage
*/
var debug

class Todo {
  constructor(name, selector) {
    this.name = name
    this.element = document.querySelector(selector)
    this.itemsTodo = []
    this.itemsDone = []
    if (localStorage[name]) {
       this.items = JSON.parse(localStorage[name])
       this.itemsTodo = this.items.itemsTodo
       this.itemsDone = this.items.itemsDone
       this.items = {itemsTodo:this.itemsTodo, itemsDone:this.itemsDone}
       //checks to see if there is already a counter in local storage
       this.idCounter = this.items.idcounter;
     } else {
      this.items = {itemsTodo:this.itemsTodo, itemsDone:this.itemsDone}
      //id counter make sure that every items will always have a unique ID
      this.idCounter = 1;
      localStorage[name] = JSON.stringify({idCounter: 1})
     }    
  }

  //will render things such as the buttons and text boxes
  renderBones() {
    var view = {name: this.name}
    var todoListBonesTemplate = `<div class="individual-list" id="{{name}}">
    <h2 class="title">
    {{name}}</h2>
    <form autocomplete="off">
    <label>Add something to your list:</label><br>
    <input type="text" id="item-input">
    <button type="button" id="item-button">Add to List</button>
    </form>
    <div id="item-container"></div>
    <button type='submit' id='submit-checks'>Submit Todo List</button>
    </div>`
    var output = Mustache.render(todoListBonesTemplate, view);
    var bones = this.htmlToElements(output);
    debug = output
    bones.querySelector('#item-button').addEventListener('click', this.addItem.bind(this))
    this.enterKeySubmit(bones, '#item-input')
    this.element.appendChild(bones);
    this.renderItems()
  }

   //creates docfragment from html
   htmlToElements(html) {
    return document.createRange().createContextualFragment(html);
  }

  //allows the user to use the enter key to submit their list-item
  enterKeySubmit(dom, selector) {
    dom.querySelector(selector).addEventListener("keydown", function(event) {
    // Number 13 is the "Enter" key on the keyboard
      if (event.key === 'Enter') {
        event.preventDefault();
        //the below click might only activate the first button, may need to look at this if we have more than one todo list
        //I'm confused why dom.querySelector('#item-button').click(); doesn't work? neither does domEl
        //Trigger the button element with a click
        //var domEl = document.getElementById(this.name)
        document.querySelector('#item-button').click();
      }
    })
  }

//will render the items on the todo list
  renderItems() {
    var todoListTemplate = `<form class="list-item-holder">
      {{#items}}
        <label>
        <input type="checkbox" id={{id}} class="list-item" name="checkbox" value="value" >{{item}}</label><br>
      {{/items}}`
    var output = Mustache.render(todoListTemplate, {items:this.items.itemsTodo});
    document.getElementById('item-container').innerHTML = output;
   // document.querySelector('#list-item').addEventListener(this.markDone.bind(this))
  }

//adds an item to the list and calls renderItems() and saveList() and set the text box to ""
    addItem() {
      var value = document.querySelector('#item-input').value;
      if (value !== "") {
        var objValue = {id: String(this.idCounter) + 'id', 'item':value, 'notdone':true}
        this.itemsTodo.push(objValue);
        this.renderItems();
        this.saveList();
        this.idCounter += 1;
        document.querySelector('#item-input').value = "";
      }
  }
  //I don't think I need this function anymore
  //is going to change the status doneKey of the object to true
  removeDoneItem() {
    for (var i = 0; i < this.itemsTodo.length; i++) {
      if (this.itemsTodo[i].notdone === false) {
        this.itemsDone.push(this.itemsTodo[i])
        this.itemsTodo.splice(i, 1)
      } 
    }
  }

  markDone(idSelector) {
    var checkbox = document.getElementById(idSelector).checked
    if (checkbox.checked === true) {
      for (var i = 0; i < this.itemsTodo; i++) {
        if (this.itemsTodo[i].id === idSelector) {
          this.itemsTodo[i].notdone = false
          this.itemsDone.push(this.itemsTodo[i])
          this.itemsTodo.splice(i, 1)
          this.renderItems()
        }
      }
    }
  }

  //saves this.items to localStorage['this.name']
  saveList() {
    localStorage[this.name] = JSON.stringify(this.items);
  }
}

var list = new Todo('list', '#tasks-lists')
list.renderBones()

//how to save the status....

/*
var itemOne = {'note':'this is a task I have to do', 'status':'done'}
var itemTwo = {'note':'this is another task I need to do', 'status':'notdone'}
localStorage['todo'] = JSON.stringify([itemOne, itemTwo])
var todo = JSON.parse(localStorage['todo'])

{list:
  {itemsTodo:[{},{}],
  itemsDone:[{},{}]
  }
}
list.itemsTodo[0].note

  "items": [
    { "name": "Moe" },
    { "name": "Larry" },
    { "name": "Curly" }
  ]
}


for (var i = 0; i < items.length; i++) {
  if (items[i].notdone === true) {
    itemsTodo.push(items[i])
  } else if (items[i].notdone === false) {
    itemsDone.push(items[i])
  }
}
*/