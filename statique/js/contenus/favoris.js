let lifav=[
    {info : "ligne" , temps : "départ dans" , incident : "RAS" , afflu :"calme" }
];


function affiche(){
    $("#listfav").empty();       // $ remplace document.getElementbyid()
    let html = "";
    for (let objet of lifav) {
        html += "<li>" + objet.info + "</li>";
    }
    $("#listfav").append(html);
}