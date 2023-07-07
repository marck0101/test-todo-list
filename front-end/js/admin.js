document.addEventListener("DOMContentLoaded", function () {
  let btnExcluirTodas = document.getElementById("btnExcluirTodas");
  if (btnExcluirTodas) {
    btnExcluirTodas.addEventListener("click", handleDeleteAll);
  }

  let tarefaInput = document.getElementById("tarefaInput");
  let btnRegistrar = document.getElementById("btnRegistrar");

  if (tarefaInput) {
    tarefaInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !btnRegistrar.disabled) {
        handleRegister(event);
      }
    });
  }

  fetchTasks();

  if (btnRegistrar) {
    btnRegistrar.addEventListener("click", handleRegister);
  }
});

let addTaskURL = "../back-end/add_task.php";
let deleteAllTasksURL = "../back-end/delete_all_tasks.php";
let deleteTaskURL = "../back-end/delete_task.php";
let editTaskURL = "../back-end/edit_task.php";
let getTasksURL = "../back-end/get_tasks.php";

// Função para registrar uma tarefa
function handleRegister(event) {
  event.preventDefault();

  let tarefaInput = document.getElementById("tarefaInput");
  let tarefa = tarefaInput.value.trim();

  if (tarefa === "") {
    alert("Digite uma tarefa válida.");
    return;
  }

  let formData = new FormData();
  formData.append("tarefa", tarefa);

  let xhr = new XMLHttpRequest();
  xhr.open("POST", addTaskURL, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      fetchTasks(); // Atualiza a lista de tarefas
    }
  };
  xhr.send(formData);

  tarefaInput.value = "";
}

// Função para excluir uma tarefa
function handleDelete(tarefa) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", deleteTaskURL, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (xhr.status === 200) {
      fetchTasks(); // Atualiza a lista de tarefas
    }
  };
  xhr.send("tarefa=" + encodeURIComponent(tarefa));
}

// Função para excluir todas as tarefas
function handleDeleteAll() {
  let confirmar = confirm("Tem certeza que deseja excluir todas as tarefas?");
  if (confirmar) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", deleteAllTasksURL, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (xhr.status === 200) {
        fetchTasks(); // Atualiza a lista de tarefas
      }
    };
    xhr.send();
  }
}

// Função para editar uma tarefa
function handleEdit(tarefa, textarea) {
  let tarefaAntiga = textarea.value;

  textarea.disabled = false;
  textarea.focus();

  textarea.addEventListener("blur", function handleBlur(event) {
    let textarea = event.target;
    let novaTarefa = textarea.value;
    textarea.disabled = true;
    textarea.removeEventListener("blur", handleBlur);

    if (novaTarefa.trim() !== "" && novaTarefa !== tarefaAntiga) {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", editTaskURL, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onload = function () {
        if (xhr.status === 200) {
          fetchTasks(); // Atualiza a lista de tarefas
        }
      };
      xhr.send(
        "tarefa=" +
          encodeURIComponent(tarefa) +
          "&novaTarefa=" +
          encodeURIComponent(novaTarefa)
      );
    } else {
      textarea.value = tarefaAntiga;
    }
  });
}

// Função para buscar as tarefas
function fetchTasks() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", getTasksURL, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      let response = xhr.responseText;
      let tarefasContainer = document.getElementById("tarefasContainer");
      tarefasContainer.innerHTML = "";

      if (response) {
        if (response.includes("Nenhuma tarefa encontrada.")) {
          return;
        }

        let tasks = JSON.parse(response);
        if (tasks.length > 0) {
          let h2 = document.createElement("h2");
          h2.textContent = "Tarefas:";
          h2.style.textAlign = "center";
          tarefasContainer.appendChild(h2);

          let ul = document.createElement("ul");
          ul.id = "tarefasLista";

          tasks.forEach(function (tarefa) {
            let li = document.createElement("li");
            li.classList.add("list-item"); // Adicione esta linha para aplicar a classe

            let divWrapper = document.createElement("div");
            divWrapper.classList.add("task-wrapper");

            let textarea = document.createElement("textarea");
            textarea.value = tarefa;
            textarea.disabled = true;
            textarea.classList.add("task-textarea", "textarea-tarefa"); 

            let btnEdit = document.createElement("button");
            btnEdit.innerHTML = '<i class="fas fa-pencil-alt"></i>'; 
            btnEdit.classList.add("task-button", "edit-button");

            let btnDelete = document.createElement("button");
            btnDelete.innerHTML = '<i class="fas fa-trash-alt"></i>'; 
            btnDelete.classList.add("task-button", "delete-button");

            divWrapper.appendChild(textarea);
            divWrapper.appendChild(btnEdit);
            divWrapper.appendChild(btnDelete);
            li.appendChild(divWrapper);
            ul.appendChild(li);

            btnEdit.addEventListener("click", function () {
              handleEdit(tarefa, textarea);
            });

            textarea.addEventListener("keydown", function (event) {
              if (event.key === "Enter") {
                event.preventDefault();
                disableEditTask(textarea);
              }
            });

            textarea.addEventListener("blur", function () {
              disableEditTask(textarea);
            });

            btnDelete.addEventListener("click", function () {
              handleDelete(tarefa);
            });
          });

          tarefasContainer.appendChild(ul);

          let btnExcluirTodas = document.createElement("button");
          btnExcluirTodas.id = "btnExcluirTodas";
          btnExcluirTodas.textContent = "Excluir Todas as Tarefas";
          btnExcluirTodas.classList.add("task-button", "delete-button-all"); 
          tarefasContainer.appendChild(btnExcluirTodas);
          btnExcluirTodas.addEventListener("click", handleDeleteAll);
        }
      }
    }
  };
  xhr.send();
}

function disableEditTask(textarea) {
  textarea.disabled = true;
  textarea.removeEventListener("input", updateSaveButton);

  let novaTarefa = textarea.value.trim();
  let tarefaAntiga = textarea.dataset.originalValue;

  if (novaTarefa !== "" && novaTarefa !== tarefaAntiga) {
    let formData = new FormData();
    formData.append("tarefa", tarefaAntiga);
    formData.append("novaTarefa", novaTarefa);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", editTaskURL, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        fetchTasks(); 
      }
    };
    xhr.send(formData);
  } else {
    textarea.value = tarefaAntiga;
  }
}

// Função para atualizar o estado do botão de salvar durante a edição
function updateSaveButton(event) {
  let textarea = event.target;
  let originalValue = textarea.dataset.originalValue;
  let newValue = textarea.value.trim();
  let btnSave = textarea.parentElement.querySelector(".save-button");

  if (btnSave) {
    if (newValue === originalValue) {
      btnSave.disabled = true;
    } else {
      btnSave.disabled = false;
    }
  }
}
