# API Documentation

## Overview
Esta API permite gestionar usuarios y transacciones. La API permite consultar usuarios, iniciar sesión mediante una clave, obtener transacciones por usuario, y realizar nuevas transacciones que afecten el saldo de los usuarios.

## Endpoints

### 1. Obtener Usuarios
**GET** `/getUsers`

#### Descripción
Este endpoint devuelve todos los usuarios registrados.

#### Ejemplo de Respuesta
``` json
{
  "users": [
    {
      "id": 1,
      "key": "abc123",
      "mount": 1000
    },
    {
      "id": 2,
      "key": "def456",
      "mount": 1500
    }
  ]
}
```
### 2. Iniciar Sesión
GET /login/:key

#### Descripción
Este endpoint permite iniciar sesión utilizando una clave específica (key). Si la clave es correcta, devuelve el ID del usuario y su saldo actual.

#### Parámetros
key: Clave del usuario.
#### Ejemplo de Respuesta
``` json
{
  "id": 1,
  "balance": 1000
}
```

#### Respuesta en caso de error
404 Not Found: Si no se encuentra un usuario con el ID proporcionado.

### 4. Obtener Transacciones por Usuario
GET /transactions/:userId

#### Descripción
Este endpoint devuelve todas las transacciones realizadas por un usuario específico.

#### Parámetros
userId: ID del usuario.
#### Ejemplo de Respuesta
``` json
[
  {
    "id": 1,
    "userId": 1,
    "amount": 500
  },
  {
    "id": 2,
    "userId": 1,
    "amount": -200
  }
]
```
#### Respuesta en caso de error
404 Not Found: Si no se encuentran transacciones para el usuario.<br>
400 Bad Request: Si el userId no es válido.

### 5. Realizar una Transacción
POST /transaction

#### Descripción
Este endpoint permite realizar una nueva transacción para un usuario, actualizando su saldo y registrando la transacción.

#### Cuerpo de la Petición
``` json
{
  "userId": 1,
  "amount": 500
}
```
#### Ejemplo de Respuesta
``` json
{
  "id": 3,
  "userId": 1,
  "amount": 500
}
```

#### Respuesta en caso de error
400 Bad Request: Si userId o amount no son proporcionados.<br>
404 Not Found: Si no se encuentra un usuario con el userId proporcionado.<br>
500 Internal Server Error: Si ocurre un error al leer o escribir en los archivos.

### Ejecución del Servidor
El servidor se ejecuta en el puerto 8080. Puedes acceder a la API en la dirección http://localhost:8080.

node server.js

### Notas Adicionales
* Todos los datos de usuarios se almacenan en un archivo JSON llamado Users.json.
* Todas las transacciones se almacenan en un archivo JSON llamado Transactions.json.
* El campo mount en el archivo de usuarios representa el saldo actual del usuario.