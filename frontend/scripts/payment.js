function finishOrder() {
    const resultFirstName = /[A-Za-z]/.test(document.getElementById("firstName"));
    const resultLastName = /[A-Za-z]/.test(document.getElementById("lastName"));

    console.log(resultFirstName);
    console.log(resultLastName)

    if (resultFirstName && resultLastName)
    {
        //location.assign('localhost:8000');
        // window.location.pathname = "/";
        window.locatation = 'localhost:8000';
        // location.reload();
    }
    else
    {
        window.alert("Falsche Eingabe");
    }
}