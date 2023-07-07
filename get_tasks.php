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

// Prepara a instrução SQL para selecionar todas as tarefas
$sql = "SELECT tarefa FROM tarefas";

// Executa a instrução SQL e obtém os resultados
$result = $conn->query($sql);

// Verifica se existem resultados
if ($result->num_rows > 0) {
    $tarefas = array();

    // Itera sobre os resultados e adiciona as tarefas ao array
    while ($row = $result->fetch_assoc()) {
        $tarefas[] = $row['tarefa'];
    }

    // Retorna as tarefas como JSON
    echo json_encode($tarefas);
} else {
    echo "Nenhuma tarefa encontrada.";
}

// Fecha a conexão com o banco de dados
$conn->close();
?>
