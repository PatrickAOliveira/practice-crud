"use strict"
// Máscara criada para o input de telefone
$("#celular").inputmask({ "mask": "(99) 99999-9999" });

function openModal() {
   return document.getElementById('modal').classList.add('active');
}

function closeModal() {
   clearFields();
   document.getElementById('modal').classList.remove('active');
}


function getLocalStorage() {
   return JSON.parse(localStorage.getItem('db_client')) ?? [];
}
function setLocalStorage(dbClient) {
   return localStorage.setItem("db_client", JSON.stringify(dbClient));
}

// CRUD - create read update delete
function deleteClient(index) {
   const dbClient = readClient();
   dbClient.splice(index, 1);
   setLocalStorage(dbClient);
}
// Atualiza um Cliente
function updateClient(index, client) {
   const dbClient = readClient();
   dbClient[index] = client;
   setLocalStorage(dbClient);
}
// Leitura de todos os Clientes salvos
function readClient() {
   return getLocalStorage();
}
// Cria um novo Cliente
function createClient(client) {
   const dbClient = getLocalStorage();
   dbClient.push(client);
   setLocalStorage(dbClient);
}

function isValidFields() {
   return document.getElementById('form').reportValidity();
}

//Interação com o layout

function clearFields() {
   const fields = document.querySelectorAll('.modal_field');
   fields.forEach(field => field.value = "");
   document.getElementById('nome').dataset.index = 'new';
   document.querySelector(".modal_header>h2").textContent = 'Novo Cliente';
}
// Salva as informações do Cliente
function saveClient() {
   if (isValidFields()) {
      const client = {
         nome: document.getElementById('nome').value,
         email: document.getElementById('email').value,
         celular: document.getElementById('celular').value,
         cidade: document.getElementById('cidade').value
      };
      const index = document.getElementById('nome').dataset.index;
      if (index == 'new') {
         createClient(client);
         updateTable();
         closeModal();
      } else {
         updateClient(index, client);
         updateTable();
         closeModal();
      }
   }
}

function createRow(client, index) {
   const newRow = document.createElement('tr');
   newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `;
   document.querySelector('#tableCliente>tbody').appendChild(newRow);
}

function clearTable() {
   const rows = document.querySelectorAll('#tableCliente>tbody tr');
   rows.forEach(row => row.parentNode.removeChild(row));
}

function updateTable() {
   const dbClient = readClient();
   clearTable();
   dbClient.forEach(createRow);
}

function fillFields(client) {
   document.getElementById('nome').value = client.nome;
   document.getElementById('email').value = client.email;
   document.getElementById('celular').value = client.celular;
   document.getElementById('cidade').value = client.cidade;
   document.getElementById('nome').dataset.index = client.index;
}

function editClient(index) {
   const client = readClient()[index];
   client.index = index;
   fillFields(client);
   document.querySelector(".modal_header>h2").textContent = `Editando ${client.nome}`;
   openModal();
}

function editDelete(event) {
   if (event.target.type == 'button') {

      const [action, index] = event.target.id.split('-');

      if (action == 'edit') {
         editClient(index);
      } else {
         const client = readClient()[index];
         const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`);
         if (response) {
            deleteClient(index);
            updateTable();
         }
      }
   }
}

updateTable()

// Eventos
document.getElementById('cadastrarCliente').addEventListener('click', openModal)

document.getElementById('modalClose').addEventListener('click', closeModal)

document.getElementById('salvar').addEventListener('click', saveClient)

document.querySelector('#tableCliente>tbody').addEventListener('click', editDelete)

document.getElementById('cancelar').addEventListener('click', closeModal)