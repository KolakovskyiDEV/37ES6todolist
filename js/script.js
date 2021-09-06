"use strict";
let num = 0;
const todoController = {
  getData() {
    if (!todoModel.getData()) return false;
    return JSON.parse(todoModel.getData());
  },
  setData(inputs) {
    const todoItemObject = this.handleInputs(inputs);
    todoModel.saveData(todoItemObject);
    return todoItemObject;
  },
  handleInputs(inputs) {
    const obj = {};
    for (const input of inputs) {
      obj[input.name] = input.value;
    }
    obj.checkbox = false;
    obj.completed = "false";
    return obj;
  },
  makeCheckBox(boxCheck) {
    let index = Number(boxCheck.target.parentElement.id);
    const arr = todoController.getData();
    arr[index].completed = "true";
    arr[index].checkbox = !arr[index].checkbox;
    todoModel.reSetData(arr);
    return arr;
  },
  deletElem(elemDel) {
    let index = Number(elemDel.target.parentElement.id);
    const arr = todoController.getData();
    arr.splice(index, 1);
    todoModel.reSetData(arr)
    return arr;
  },
  deletAllElem(delAll) {
    num = 0;
    const arr = todoController.getData();
    todoModel.removeData();
    return arr;
  }
};

const todoModel = {
  dbName: "saved_data",
  saveData(todoItem) {
    if (localStorage[this.dbName]) {
      const data = JSON.parse(localStorage[this.dbName]);
      data.push(todoItem);
      localStorage.setItem(this.dbName, JSON.stringify(data));
      return data;
    }
    const data = [todoItem];
    localStorage.setItem(this.dbName, JSON.stringify(data));
    return data;
  },
  getData() {
    if (!localStorage.getItem(this.dbName)) return false;
    return localStorage.getItem(this.dbName);
  },
  reSetData(arr) {
    localStorage.clear();
    localStorage.setItem(todoModel.dbName, JSON.stringify(arr));
  },
  removeData() {
    localStorage.clear();
  },

};

const todoView = {
  form: document.querySelector("#todoForm"),
  template: document.querySelector("#todoItems"),
  removeAll: document.querySelector("#todoForm"),

  setEvents() {
    window.addEventListener("load", this.onLoadFunc.bind(this));
    this.form.addEventListener("submit", this.formSubmit.bind(this));
    this.template.addEventListener("change", this.checkBoxFunc.bind(this));
    this.template.addEventListener("click", this.deletElemFunc.bind(this));
    this.removeAll.addEventListener("click", this.deletAllFunc.bind(this));
  },
  formSubmit(e) {
    e.preventDefault();
    const inputs = e.target.querySelectorAll("input, textarea");

    for (const input of inputs) {
      if (!input.value.length) return alert("No way you can add this shit");
    }
    todoController.setData(inputs);
    const todoItemObject =
      todoController.getData()[todoController.getData().length - 1];
    this.renderItem(todoItemObject);
    e.target.reset();
  },
  onLoadFunc() {
    if (!localStorage.getItem("saved_data")) return false;
    num = 0;
    todoController.getData().forEach((item) => this.renderItem(item));
  },
  checkBoxFunc(boxCheck) {
    todoController.makeCheckBox(boxCheck);
    this.template.textContent = "";
    todoView.onLoadFunc();
  },
  deletElemFunc(elemDel) {
    if (elemDel.target.className === 'taskButton') {
      todoController.deletElem(elemDel);
      this.template.innerHTML = '';
      todoView.onLoadFunc();
    }
  },
  deletAllFunc(delAll) {

    if (delAll.target.className === 'taskdeleteAll') {
      todoController.deletAllElem(delAll);
      this.template.innerHTML = '';

    }
  },
  createTemplate(
    titleText = "",
    descriptionText = "",
    completedText = "",
    checkboxTick = false,
    buttonText = "Delete element",
  ) {
    const mainWrp = document.createElement("div");

    mainWrp.className = "col-4";

    const wrp = document.createElement("div");
    wrp.className = "taskWrapper";
    wrp.id = `${num++}`;
    mainWrp.append(wrp);

    const title = document.createElement("div");
    title.innerHTML = titleText;
    title.className = "taskHeading";
    wrp.append(title);

    const description = document.createElement("div");
    description.innerHTML = descriptionText;
    description.className = "taskDescription";
    wrp.append(description);

    const completed = document.createElement("div");
    completed.innerHTML = completedText;
    completed.className = "taskCompleted";
    wrp.append(completed);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checkboxTick;
    checkbox.className = "taskCheckbox";
    wrp.append(checkbox);

    const button = document.createElement("button");
    button.innerHTML = buttonText;
    button.className = "taskButton";
    wrp.append(button);

    return mainWrp;
  },
  renderItem({ title, description, completed, checkbox }) {
    const template = this.createTemplate(
      title,
      description,
      completed,
      checkbox
    );
    document.querySelector("#todoItems").prepend(template);
  },
  creatDeleteAllButt(deleteAllText = 'Delete All') {
    const deleteAll = document.createElement("button");
    const dellBut = document.querySelector("#todoForm");
    deleteAll.innerHTML = deleteAllText;
    deleteAll.className = "taskdeleteAll";
    deleteAll.setAttribute('type', 'button');
    dellBut.append(deleteAll);

  }
};
todoView.setEvents();
todoView.creatDeleteAllButt();

// localStorage.clear();

//— Добавить к каждому todo item который создается при сабмите формы поле completed
//— поле completed должно содержать false когда пользователь только что создал todo item
//— Поле completed можно изменить прямо из элемента todo http://joxi.ru/GrqX0JLf4v1Y5A — нужно добавить в него checkbox
//— Если задача не выполнена — нежно чтобы в чекбоксе не было галочки, а если выполнена — чтобы была (сразу после создания todo item галочки нету)
//— Если пользователь нажимает на текущем элементе на галочку то нужно изменять статус текущей задачи на выполненный (completed: true)
//— Так как все todo items у нас хранятся в массиве внутри localStorage то с ним нам и нужно работать
//— Добавить возможность удалять каждый отдельный todo item
//— Добавить возможность удалять сразу все todo items
