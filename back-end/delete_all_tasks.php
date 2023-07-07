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
    // Prepara a instrução SQL para excluir todas as tarefas
    $stmt = $conn->prepare("DELETE FROM tarefas");

    // Executa a instrução SQL para excluir todas as tarefas
    if ($stmt->execute()) {
        echo "Todas as tarefas foram excluídas com sucesso!";
    } else {
        echo "Erro ao excluir todas as tarefas: " . $stmt->error;
    }

    // Fecha a instrução preparada
    $stmt->close();
}

// Fecha a conexão com o banco de dados
$conn->close();
?>
