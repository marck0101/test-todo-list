let tarefas = []; // Define a variável global

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

  // Busca e atualiza a lista de tarefas ao carregar a página
  fetchTasks();

  if (btnRegistrar) {
    btnRegistrar.addEventListener("click", handleRegister);
  }
});

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
  xhr.open("POST", "/testeBanco/add_task.php", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      fetchTasks(); // Atualiza a lista de tarefas
    }
  };
  xhr.send(formData);

  tarefaInput.value = "";
}

function handleDelete(tarefa) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/testeBanco/delete_task.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (xhr.status === 200) {
      fetchTasks(); // Atualiza a lista de tarefas
    }
  };
  xhr.send("tarefa=" + encodeURIComponent(tarefa));
}

function handleDeleteAll() {
  let confirmar = confirm("Tem certeza que deseja excluir todas as tarefas?");
  if (confirmar) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/testeBanco/delete_all_tasks.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (xhr.status === 200) {
        fetchTasks(); // Atualiza a lista de tarefas
      }
    };
    xhr.send();
  }
}

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
      xhr.open("POST", "/testeBanco/edit_task.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // Alterado para "application/x-www-form-urlencoded"
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
      ); // Envia os dados no formato de formulário
    } else {
      textarea.value = tarefaAntiga;
    }
  });
}

function fetchTasks() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "get_tasks.php", true);
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
          tarefasContainer.appendChild(h2);

          let ul = document.createElement("ul");
          ul.id = "tarefasLista";
          tarefasContainer.appendChild(ul);

          let btnExcluirTodas = document.createElement("button");
          btnExcluirTodas.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Ícone de lixeira
          btnExcluirTodas.classList.add("task-button", "delete-button-all");
          btnExcluirTodas.id = "btnExcluirTodas";
          btnExcluirTodas.textContent = "Excluir Todas as Tarefas";
          tarefasContainer.appendChild(btnExcluirTodas);
          btnExcluirTodas.addEventListener("click", handleDeleteAll);

          tasks.forEach(function (tarefa) {
            let li = document.createElement("li");
            li.classList.add("list-item"); // Adicione esta linha para aplicar a classe

            let divWrapper = document.createElement("div");
            divWrapper.classList.add("task-wrapper");

            let textarea = document.createElement("textarea");
            textarea.value = tarefa;
            textarea.disabled = true;
            textarea.classList.add("task-textarea", "textarea-tarefa"); // Adicione a classe "textarea-tarefa" aqui

            let btnEdit = document.createElement("button");
            btnEdit.innerHTML = '<i class="fas fa-pencil-alt"></i>'; // Ícone de caneta
            btnEdit.classList.add("task-button", "edit-button");

            let btnDelete = document.createElement("button");
            btnDelete.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Ícone de lixeira
            btnDelete.classList.add("task-button", "delete-button");

            divWrapper.appendChild(textarea);
            divWrapper.appendChild(btnEdit);
            divWrapper.appendChild(btnDelete);
            li.appendChild(divWrapper);
            tarefasLista.appendChild(li);

            btnEdit.addEventListener("click", function () {
              enableEditTask(textarea);
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
        }
      }
    }
  };
  xhr.send();
}

function enableEditTask(textarea) {
  textarea.disabled = false;
  textarea.focus();
  textarea.dataset.originalValue = textarea.value;
}

function disableEditTask(textarea) {
  textarea.disabled = true;
  let novaTarefa = textarea.value.trim();
  let tarefaAntiga = textarea.dataset.originalValue;

  if (novaTarefa !== "" && novaTarefa !== tarefaAntiga) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/testeBanco/edit_task.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
      if (xhr.status === 200) {
        fetchTasks(); // Atualiza a lista de tarefas
      }
    };
    xhr.send(
      "tarefa=" +
        encodeURIComponent(tarefaAntiga) +
        "&novaTarefa=" +
        encodeURIComponent(novaTarefa)
    );
  } else {
    textarea.value = tarefaAntiga;
  }
}
