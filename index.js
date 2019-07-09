const express = require('express');
const session = require('express-session');
const bodyParser = require("body-parser");
const app = express();
const path = require('path');
const db = require("./db");
const collection = "users";

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/stylesheet", express.static(path.join(__dirname + '/public/stylesheet')));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/images", express.static(__dirname + '/public/images'));
app.use("/vendor", express.static(__dirname + '/public/vendor'));
app.use("/fonts", express.static(__dirname + '/public/fonts'));

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/getUsers', (req, res)=>{
    db.getDB().collection(collection).find({}).toArray((err, documents)=>{
        if (err)
            console.log(err);
        else {
            console.log(documents);
            res.json(documents);
        }
    });
});

app.get('/getUser', (req, res)=>{
    db.getDB().collection(collection).findOne( { $or: [{email : userInput.email}, {username : userInput.username}]}, function(err, result) {
        if (err) throw err;
        console.log(result);
        res.json(result);
    });
});

app.put('/:id', (req, res)=>{
    const userID = req.params.id;
    const userInput = req.body;

    db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(userID)},
        {$set : {user : userInput.user}}, {returnOriginal  : false},
        (err, result)=>{
            if (err)
                console.log(err);
            else {
                res.json({result : result, document : result.ops[0]});
            }
        })
});

app.post('/register', (req, res)=>{
    const userInput = req.body;
    db.getDB().collection(collection).findOne( { $or: [{email : userInput.email}, {username : userInput.username}]}, function(err, result) {
        if (err) throw err;
        console.log(result);

        if (result) {
            console.log("already registered");
            // alert add
        } else {

            db.getDB().collection(collection).insertOne(userInput, (err, result) => {
                if (err)
                    console.log(err);
                else {
                    res.json({result : result, document : result.ops[0]});
                }
            });
        }
    });
});

app.post('/signin', (req, res)=>{
    const userInput = req.body;
    db.getDB().collection(collection).findOne( {username : userInput.username}, function(err, result) {
        if (err) throw err;
        console.log(result);
        if (!result) {
            console.log("no result");
        } else if (result.password !== userInput.password) {

            console.log("wrong password");
        } else {
            console.log("signed in");
            res.json(result);
        }
        // res.send(result.json);
        console.log("sent");
    });
});

app.post('/addWeightInfo', (req, res)=>{
    const userInput = req.body;
    db.getDB().collection(collection).findOne( {username : userInput.username}, function(err, result) {
        if (result) {
            var count = 0;

            for (var i = 0; i < result.weightinfo.length; i++) {
                if (result.weightinfo[i].date === userInput.weight.date) {
                    count++;
                    result.weightinfo[i].curWeight = userInput.weight.curWeight;
                    result.weightinfo = result.weightinfo.sort(function(a, b) {
                        var x = a['date']; var y = b['date'];
                        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                    });
                    db.getDB().collection(collection).updateOne(
                        {"_id" : result._id},
                        {$set:{
                                "weightinfo" : result.weightinfo
                            }
                        });
                    console.log("already registered");
                    res.json(result);
                }
            }

            if (count === 0) {
                result.weightinfo.push(userInput.weight);
                result.weightinfo = result.weightinfo.sort(function(a, b) {
                    var x = a['date']; var y = b['date'];
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });
                db.getDB().collection(collection).updateOne(
                    {"_id" : result._id},
                    {$set:{
                            "weightinfo" : result.weightinfo
                        }
                    });
                console.log("already registered");
                res.json(result);
            }
        } else {
            console.log("no user such that");
        }
    });
});

app.post('/changeUsername', (req, res)=>{
    const userInput = req.body;
    db.getDB().collection(collection).findOne( {email : userInput.email}, function(err, result) {
        if (result) {
            result.username = userInput.username;
            db.getDB().collection(collection).updateOne(
                {"_id" : result._id},
                {$set:{
                        "username" : userInput.username
                    }
                });
            res.json(result);
        }
    });
});

app.post('/changeEmail', (req, res)=>{
    const userInput = req.body;
    db.getDB().collection(collection).findOne( {username : userInput.username}, function(err, result) {
        if (result) {
            result.email = userInput.email;
            db.getDB().collection(collection).updateOne(
                {"_id" : result._id},
                {$set:{
                        "email" : userInput.email
                    }
                });
            res.json(result);
        }
    });
});

app.post('/changePassword', (req, res)=>{
    const userInput = req.body;
    db.getDB().collection(collection).findOne( {username : userInput.username}, function(err, result) {
        if (result) {
            result.password = userInput.password;
            db.getDB().collection(collection).updateOne(
                {"_id" : result._id},
                {$set:{
                        "password" : userInput.password
                    }
                });
            res.json(result);
        }
    });
});

app.delete('/:id', (req, res)=>{
    const userID = req.params.id;
    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(userID)}, (err, result)=>{
        if (err)
            console.log(err);
        else
            res.json(result);
    });
});

app.get('/logout', (req, res)=>{
    res.redirect('/');
});

db.connect((err) =>{
    if (err) {
        console.log('unable to connect to database');
        process.exit(1);
    } else {
        app.listen(3000, ()=>{
            console.log('connected to database, app listening on port 3000')
        });
    }
});
