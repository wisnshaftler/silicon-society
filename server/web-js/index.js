$(document).ready(function () {
    $("#login").on("click", ()=>{
        $("#loginModal").modal({ backdrop: 'static' });
    })

    $("#loginModal").on("keypress", (e)=>{
        if(e.key == "Enter"){
            login()
        }
    })

    $("#signUp").on("click", ()=>{
        $("#createModal").modal({ backdrop: 'static' });
    })

    $("#createModal").on("keypress", (e)=>{
        if(e.key == "Enter"){
            login()
        }
    })
});

async function login(){
    const email = $("#email").val().trim()
    const password = $("#password").val().trim();
    const hashPass = CryptoJS.SHA256(password).toString();

    $("#loginStatus").text("Processing...")

    const result = await $.ajax({
        type: "POST",
        url: "login/",
        data: JSON.stringify({ email: email, password: hashPass }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    })
    console.log(result)
    $("#loginStatus").text(result.msg);
    if(result.status ==0){
        $("#loginStatus").text(result.msg);
    }

    if(result.status ==1){
        $("#loginStatus").text(result.msg);
        
        document.cookie = "email = " + email;
        document.cookie = "password = " + hashPass;
        window.location.replace("/profile")
    }
    if(result.status ==2){
        $("#loginStatus").text("Credentials are invalid or you not confirmed your account. Please check email");
    }
}

async function create(){
    const email = $("#email-create").val().trim();
    const password = $("#password-create").val().trim();
    const name = $("#name-create").val().trim();
    
    $("#createStatus").text("Processing.....");

    const result = await $.ajax({
        type: "POST",
        url: "create-user/",
        data: JSON.stringify({ email: email, password: password, name:name }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
    })
    $("#createStatus").text(result.message)

    if(result.status ==1){
        alert("Account is successfully created. Activation link sent to the your account")
    }
}

