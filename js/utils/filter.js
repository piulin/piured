function filter() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("online-song");
    li = ul.getElementsByTagName("option");
    for (i = 0; i < li.length; i++) {
        txtValue = li[i].innerHTML
        // txtValue = a.innerHTML ;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}