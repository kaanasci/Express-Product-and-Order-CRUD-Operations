const mysql = require('mysql');
const express = require("express");
const app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'MDP' ,
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if(!err)
        console.log('DB connection succeded. ');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err,undefined,2));
});

app.get("/", (req, res) => {
    res.json({ message: "ok" });
  });

app.get('/products', function(req,res){
    mysqlConnection.query('SELECT * FROM Products',(err,rows,fields)=>{
        if(!err)
            res.send(rows)
        else    
            console.log(err);
    })
});

app.get('/products/:id', function(req,res){
    mysqlConnection.query('SELECT * FROM Products WHERE productID = ?',[req.params.id],(err,rows,fields)=>{
        if(!err)
            res.send(rows)
        else    
            console.log(err);
    })
});

app.delete('/products/:id', function(req,res){
    mysqlConnection.query('DELETE FROM Products WHERE productID = ?',[req.params.id],(err,rows,fields)=>{
        if(!err)
            res.send('Deleted successfully. ')
        else    
            console.log(err);
    })
});

app.post('/products', function(req,res){
    let prod = req.body;
    var sql = "SET @productID = ?;SET @productCode = ?;SET @name = ?;SET @price = ?; CALL new_procedure(@productID,@productCode,@name,@price);";
    mysqlConnection.query(sql, [prod.productID, prod.productCode, prod.name, prod.price],(err,rows,fields)=>{
        if(!err)
        rows.forEach(element => {
            if(element.constructor == Array)
            res.send('Inserted Product ID : '+ element[0].productID);
            });
        else    
            console.log(err);
    })
});

app.put('/products', function(req,res){
    let prod = req.body;
    var sql = "SET @productID = ?;SET @productCode = ?;SET @name = ?;SET @price = ?; CALL new_procedure(@productID,@productCode,@name,@price);";
    mysqlConnection.query(sql, [prod.productID, prod.productCode, prod.name, prod.price],(err,rows,fields)=>{
        if(!err)
            res.send('Updated successfully');
        else    
            console.log(err);
    })
});

app.listen(3000,function(){
    console.log('Server started on port 3000...');
});