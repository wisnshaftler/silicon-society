function login() {
    const email = $("#email").val().trim();
    const password = $("#password").val().trim();
    const hashPass = CryptoJS.SHA256(password).toString();

    $("#status").text("Processing....");
    $.ajax({
        type: "POST",
        url: "login/credentials",
        data: JSON.stringify({ email: email, password: hashPass }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        timeout:5000,
    }).then((result)=> {
        console.log(result)
        if(result.status ==0) {
            $("#status").text(result.msg);
        }
        if(result.status ==1) {
            $("#status").text(result.msg +" you redirect to dashboard shortly");
            document.cookie = "email = " + email;
            document.cookie = "password = " + hashPass;
            setTimeout(() => {
                window.location.replace("/admin/dashboard")
            }, 2000);
        }
    }).catch((e)=>{
        $("#status").text("Ops!!! something went wrong. Please try again");
    })
}