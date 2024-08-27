const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
app.use(express.json());


app.get('/getUsers', function(req, res){
    fs.readFile(__dirname + "/" + "Users.json", 'utf8', function(err, data){
        console.log(data);
        res.end(data);
    });
});

app.get('/login/:key', function (req, res) {
    fs.readFile(path.join(__dirname, "Users.json"), 'utf8', function (err, data) {
        if (err) {
            res.status(500).send('Error reading the file');
            return;
        }

        const usersData = JSON.parse(data);
        const users = usersData.users;

        var user;
        var counter = 1;
        users.forEach(element => {
            if(element.key === req.params.key){
                user = element;
            }
            counter++;
        });

        var userDTO = {
            id: user.id,
            balance: user.mount
        }

        if (user) {
            res.json(userDTO);
        } else {
            res.status(404).send('User not found');
        }
    });
});

app.get('/getById/:id', function(req, res){
    fs.readFile(path.join(__dirname, "Users.json"), 'utf8', function (err, data){
        data = JSON.parse(data);

        var users = data.users
        var user;

        users.forEach(element => {
            if(element.id == req.params.id){
                user = element;
            }
        });

        var userDTO = {
            id: user.id,
            balance: user.mount
        }

        if (user) {
            res.json(userDTO);
        } else {
            res.status(404).send('User not found');
        }
    });
});

app.get('/transactions/:userId', function(req, res) {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        return res.status(400).send('Invalid userId');
    }

    fs.readFile(path.join(__dirname, "Transactions.json"), 'utf8', function(err, data) {
        if (err) {
            return res.status(500).send('Error reading the transactions file');
        }

        let transactionsData = JSON.parse(data);
        let userTransactions = transactionsData.transactions.filter(transaction => transaction.userId === userId);

        if (userTransactions.length > 0) {
            res.json(userTransactions);
        } else {
            res.status(404).send('No transactions found for this user');
        }
    });
});

app.post('/transaction', function(req, res) {
    const { userId, amount } = req.body;

    if (typeof userId === 'undefined' || typeof amount === 'undefined') {
        return res.status(400).send('UserId and amount are required');
    }

    fs.readFile(path.join(__dirname, "Transactions.json"), 'utf8', function(err, transactionData) {
        if (err) {
            return res.status(500).send('Error reading the transactions file');
        }

        let transactionsData = JSON.parse(transactionData);
        const newTransactionId = transactionsData.index + 1;
        transactionsData.index = newTransactionId;

        const newTransaction = {
            id: newTransactionId,
            userId: userId,
            amount: amount
        };

        transactionsData.transactions.push(newTransaction);

        fs.writeFile(path.join(__dirname, "Transactions.json"), JSON.stringify(transactionsData, null, 2), function(err) {
            if (err) {
                return res.status(500).send('Error writing to the transactions file');
            }

            fs.readFile(path.join(__dirname, "Users.json"), 'utf8', function(err, usersData) {
                if (err) {
                    return res.status(500).send('Error reading the users file');
                }

                let usersJson = JSON.parse(usersData);
                let user = usersJson.users.find(u => u.id === userId);

                if (user) {
                    user.mount += amount;

                    fs.writeFile(path.join(__dirname, "Users.json"), JSON.stringify(usersJson, null, 2), function(err) {
                        if (err) {
                            return res.status(500).send('Error writing to the users file');
                        }

                        res.status(201).json(newTransaction);
                    });
                } else {
                    res.status(404).send('User not found');
                }
            });
        });
    });
});

var server = app.listen(8080, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server 👌");
})