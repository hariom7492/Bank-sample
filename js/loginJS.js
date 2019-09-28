function validateForm() {
    var x = document.getElementById('userNm').value
    console.log(x)
    var y = document.getElementById('pass').value
    console.log(y)
    setTimeout(50000)
    if(x=='Hariom'&& y=='123456789'){
        let url = 'index.html'
        window.location.href = url
    }
}
document.getElementById('logbtn').addEventListener('click', validateForm)
document.getElementById('pass').addEventListener('keypress', function (event) {
    if (event.keyCode == 13) {
        validateForm()
    }
})

//     var user = document.forms["login-form"]["userName"].value
//     var pwd = document.forms["login-form"]["password"].value
//     console.log(` Username is :${user}   & Password is ${pwd}`)