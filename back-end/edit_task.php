<?php
// Conecta ao banco de dados
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "teste_list";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica se a conexão foi estabelecida corretamente
if ($conn->connect_error) {
    die("Falha na conexão com o banco de dados: " . $conn->connect_error);
}

// Verifica se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtém a tarefa a ser editada e a nova tarefa
    $tarefa = $_POST['tarefa'];
    $novaTarefa = $_POST['novaTarefa'];

    // Prepara a instrução SQL para editar a tarefa
    $stmt = $conn->prepare("UPDATE tarefas SET tarefa = ? WHERE tarefa = ?");
    $stmt->bind_param("ss", $novaTarefa, $tarefa);

    // Executa a instrução SQL para editar a tarefa
    if ($stmt->execute()) {
        echo "Tarefa editada com sucesso!";
    } else {
        echo "Erro ao editar a tarefa: " . $stmt->error;
    }

    // Fecha a instrução preparada
    $stmt->close();
}

// Fecha a conexão com o banco de dados
$conn->close();
?>
