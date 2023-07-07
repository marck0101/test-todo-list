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
    // Obtém a tarefa a ser excluída
    $tarefa = $_POST['tarefa'];

    // Prepara a instrução SQL para excluir a tarefa
    $stmt = $conn->prepare("DELETE FROM tarefas WHERE tarefa = ?");
    $stmt->bind_param("s", $tarefa);

    // Executa a instrução SQL para excluir a tarefa
    if ($stmt->execute()) {
        echo "Tarefa excluída com sucesso!";
    } else {
        echo "Erro ao excluir a tarefa: " . $stmt->error;
    }

    // Fecha a instrução preparada
    $stmt->close();
}

// Fecha a conexão com o banco de dados
$conn->close();
?>
