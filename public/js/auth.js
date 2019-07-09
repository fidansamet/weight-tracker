document.addEventListener("DOMContentLoaded", function(event) {
    const username1 = document.getElementById("username1");
    const pass1 = document.getElementById("pass1");
    const username2 = document.getElementById("username2");
    const email2 = document.getElementById("email2");
    const pass2 = document.getElementById("pass2");
    const register = document.getElementById("register");
    const signin = document.getElementById("signin");
    const signreg = document.getElementById("signreg");
    const profile = document.getElementById("profile");
    const setUsername = document.getElementById("setUsername");
    const setEmail = document.getElementById("setEmail");
    const setPassword = document.getElementById("setPassword");
    const addWeight = document.getElementById("addWeight");
    const curWeight = document.getElementById("curWeight");
    const date = document.getElementById("date");
    const logout = document.getElementById("logout");
    const setUsernameIn = document.getElementById("setUsernameIn");
    const setEmailIn = document.getElementById("setEmailIn");
    const setPassIn = document.getElementById("setPassIn");
    const changeUsername = document.getElementById("changeUsername");
    const changeEmail = document.getElementById("changeEmail");
    const changePass = document.getElementById("changePass");

    const resetUsersInput =()=>{
        username1.value = '';
        pass1.value = '';
        username2.value = '';
        email2.value = '';
        pass2.value = '';
    };

    const resetWeights =()=>{
        curWeight.value = '';
        date.value = '';
    };

    const getUsers = ()=>{
        fetch('/getUsers', {method : "get"}).then((response)=>{
            return response.json();
        }).then((data)=>{
            console.log(data);
            document.getElementById("allUsers").innerHTML = "";
            for (var i = 0; i < data.length; i++){
                var node = document.createElement("LI");
                var textnode = document.createTextNode(data[i].username);
                node.setAttribute('class', 'list-group-item');
                node.appendChild(textnode);
                document.getElementById("allUsers").appendChild(node);
            }
        });
    };

    profile.style.display = "none";

    register.addEventListener("click", function (event) {
        event.preventDefault();
        if (username2.value !== '' && email2.value !== '' && pass2.value !== '' && emailIsValid(email2.value)) {
            fetch('/register', {
                method : 'post',
                body : JSON.stringify({username : username2.value, email : email2.value, password : pass2.value, weightinfo : []}),
                headers : {
                    "Content-Type" : "application/json; charset=utf-8",
                    "Accept": "application/json"
                }
            }).then((response)=>{
                return response.json();

            }).then((data)=>{
                setUsername.innerHTML = username2.value;
                setEmail.innerHTML = email2.value;
                setPassword.innerHTML = pass2.value;
                resetUsersInput();
                profile.style.display = "block";
                signreg.style.display = "none";
                console.log(data.weightinfo);

                x = [];
                y = [];

                var weightPlot = document.getElementById('weightPlot');
                Plotly.plot( weightPlot, [{
                    x: x,
                    y: y }], {
                    margin: { t: 0 } }, {displayModeBar: false} );
                getUsers();
            });
        }
    });

    signin.addEventListener("click", function (event) {
        event.preventDefault();
        if (username1.value !== '' && pass1.value !== '') {
            fetch('/signin', {
                method : 'post',
                body : JSON.stringify({username : username1.value, password : pass1.value, weightinfo : []}),
                headers : {
                    "Content-Type" : "application/json; charset=utf-8",
                    "Accept": "application/json"
                }
            }).then((response)=>{
                if (response) {
                    setUsername.innerHTML = username1.value;
                    setPassword. innerHTML = pass1.value;
                    resetUsersInput();
                    profile.style.display = "block";
                    signreg.style.display = "none";

                    console.log(response);
                    return response.json();
                }

            }).then((data)=>{

                if (data !== null) {
                    setEmail.innerHTML = data.email;
                    console.log(data.weightinfo);

                    x = [];
                    y = [];

                    for (var i = 0; i < data.weightinfo.length; i++) {

                        x[i] = data.weightinfo[i].date;
                        y[i] = data.weightinfo[i].curWeight;

                    }
                    var weightPlot = document.getElementById('weightPlot');
                    Plotly.plot( weightPlot, [{
                        x: x,
                        y: y }], {
                        margin: { t: 0 } }, {displayModeBar: false} );
                    getUsers();
                }
            });

        }
    });

    addWeight.addEventListener("click", function (event) {
        event.preventDefault();
        if (date.value !== '' && curWeight !== '') {
            fetch('/addWeightInfo', {
                method : 'post',
                body : JSON.stringify({username: setUsername.innerHTML, weight : {date : date.value, curWeight : curWeight.value}}),
                headers : {
                    "Content-Type" : "application/json; charset=utf-8",
                    "Accept": "application/json"
                }
            }).then((response)=>{
                return response.json();

            }).then((data)=>{

                if (data !== null) {
                    console.log(data.weightinfo);

                    x = [];
                    y = [];

                    for (var i = 0; i < data.weightinfo.length; i++) {

                        x[i] = data.weightinfo[i].date;
                        y[i] = data.weightinfo[i].curWeight;

                    }
                    var weightPlot = document.getElementById('weightPlot');
                    Plotly.plot( weightPlot, [{
                        x: x,
                        y: y }], {
                        margin: { t: 0 } }, {displayModeBar: false} );
                    getUsers();
                    date.value = '';
                    curWeight.value = '';
                }
            })
        }
    });

    logout.addEventListener("click", function (event)  {
        event.preventDefault();
        fetch('/logout', {
            method : 'get'
        })
    });

    changeUsername.addEventListener("click", function (event) {
        event.preventDefault();
        if (setUsernameIn.value !== '' && usernameIsValid(setUsernameIn.value)) {
            fetch('/changeUsername', {
                method : "post",
                body : JSON.stringify({username : setUsernameIn.value, email: setEmail.innerHTML}),
                headers : {
                    "Content-Type" : "application/json; charset=utf-8",
                    "Accept": "application/json"
                }
            }).then((response)=>{
                return response.json();
            }).then((data)=>{
                console.log(data);
                setUsernameIn.value = '';
                setUsername.innerHTML = data.username;
            });

        }
    });

    changeEmail.addEventListener("click", function (event) {
        event.preventDefault();
        if (setEmailIn.value !== '' && emailIsValid(setEmailIn.value)) {
            fetch('/changeEmail', {
                method : "post",
                body : JSON.stringify({username : setUsername.innerHTML, email: setEmailIn.value}),
                headers : {
                    "Content-Type" : "application/json; charset=utf-8",
                    "Accept": "application/json"
                }
            }).then((response)=>{
                return response.json();
            }).then((data)=>{
                console.log(data);
                setEmailIn.value = '';
                setEmail.innerHTML = data.email;
            });
        }
    });

    changePass.addEventListener("click", function (event) {
        event.preventDefault();
        if (setPassIn.valueOf !== '') {
            fetch('/changePassword', {
                method : "post",
                body : JSON.stringify({username : setUsername.innerHTML, password: setPassIn.value}),
                headers : {
                    "Content-Type" : "application/json; charset=utf-8",
                    "Accept": "application/json"
                }
            }).then((response)=>{
                return response.json();
            }).then((data)=>{
                console.log(data);
                setPassIn.value = '';
                setPassword.innerHTML = data.password;
            });
        }
    })
});