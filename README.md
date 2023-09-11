# ToDo-list local

Esse projeto é um projeto local que ainda que esteja em desenvolvimento já está funcional.

Nele é feito um CRUD de informações no banco de dados MySql. As funções de registar tarefas, editar, excluir estão 100% funcionais.

O que está e, desenvolvimento no momento são filtro de tarefaz e o botão de tarefa concluída.

A interface foi criada para ser responsiva, sendo possível acessar com aparelhos mobiles e desktops.

Para você usar esse sistema no seu compurador, siga os seguintes passos:

# Instale o XAMP

É preciso ter um gerenciador de banco de dados

```
https://www.apachefriends.org/pt_br/download.html
```

## Informações importantes

Para instalar o projeto vai ser preciso acessar a pasta do Xampp, acessar o Htdocs para por os arquivos, assim os arquivos vão ficar acessáveis no servidor que está sendo criado.
Sendo assim acessando o ip do server que está sendo criado, vai ser possível usar o sistema em outros aparelhos ao invés so o computador.
Como padão o ip de acesso será:

```
http://127.0.0.1
```

Entãoi depois de ter instalado o xampp, vamos acessaa-lo para poder dar continuidade.

No gerenciador de arquivos vamos pegar a "URL"

```
C:\xampp\htdocs
```

e abrir ela no terminal com o seguinte comando:

```
cd C:\xampp\htdocs
```

# Clone do repositório

Depois de acessar o server, vamos fazer o clone do repositório.
```
git clone https://github.com/marck0101/test-todo-list.git
```

# Ajuste no banco de dados
Agora precisamos receber os dados, as informações do nosso sistema.

Vai ter um arquivo chamado `tarefas`, vamos acessar o mysql e criar uma base de dados.
Essa vai ser a URL no navegador
```
http://127.0.0.1/phpmyadmin/
```
Vamos clicar em `novo` e vamos criar nossa base de dados que vai se chamar `teste_list`.
Aí dentro do `teste_list` vamos importar o arquivo chamado `tarefas`. Ali tem todas colunas para clirar o banco de fato.

A princípio com esses comandos está tudo certo para testar a conexão com o banco de dados, e o sistema já estará operacional.

Em caso de dúvidas, revise os passos, ou pode entrar em contato comigo através do meu portfólio, lá tem todas as formas de contato.
```
https://marck0101.com.br
```