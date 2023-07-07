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
    // Obtém a tarefa a ser registrada
    $tarefa = $_POST['tarefa'];

    // Prepara a instrução SQL para inserir a tarefa
    $stmt = $conn->prepare("INSERT INTO tarefas (tarefa) VALUES (?)");
    $stmt->bind_param("s", $tarefa);

    // Executa a instrução SQL para inserir a tarefa
    if ($stmt->execute()) {
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
    } else {
        echo "Erro ao registrar a tarefa: " . $stmt->error;
    }

    // Fecha a instrução preparada
    $stmt->close();
}

// Fecha a conexão com o banco de dados
$conn->close();
?>