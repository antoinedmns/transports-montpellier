let dicotest = {vehicule:"tram", ligne : "ligne 1", arret  : "charle de gaule" , temps : "départ dans 15min", incident : "arret", afflu :"moyenne  ", suppr : "X"};
let Vehicule="";
let Ligne="";
let Arret="";
//[
    //{info : "ligne" , temps : "départ dans" , incident : "RAS" , afflu :"calme" },
    //{info : "ligne" , temps : "départ dans" , incident : "RAS" , afflu :"calme" }
//];


function affiche() {
    let maListe = JSON.parse(localStorage.getItem('lifav')) || [];
    var listfav = document.getElementById("listefav"); 
    var html = "";
    for (var i = 0; i < maListe.length; i++) {
        var objet = maListe[i];
        html += "<li>"+ objet.vehicule + "&nbsp" + " Ligne: " + objet.ligne + "&nbsp"+" arret : " + objet.arret +  "&nbsp"+" Départ dans: " + objet.temps + "&nbsp"+" Incident: " + objet.incident +"&nbsp"+ 
        " <a class=\"X\" href = \"#\" onclick=\"suppr(" + i + ")\"> " + objet.suppr + " </a> " + "</li>";
    }

    listfav.innerHTML = html; // Ajoute les éléments de liste générés à la liste

}

function ajouter() {
    document.getElementById('modal').style.display = 'block';

}

function boutono() {
    document.getElementById('bouton').style.display='flex';
}

function boutonf() {
    document.getElementById('bouton').style.display='none';
}

function menu1o(){
    document.getElementById('menu1').style.display='flex';
}

function menu1f(){
    document.getElementById('menu1').style.display='none';
}

function menu2o() {
    document.getElementById('menu2').style.display='flex';
}

function menu2f() {
    document.getElementById('menu2').style.display='none';
}

function fermer() {
  // Masquer la modal en changeant le style de l'élément
  document.getElementById('modal').style.display = 'none';
  boutono();
  menu1f();
  menu2f();

}

function valider(){
    let maListe = JSON.parse(localStorage.getItem('lifav')) || [];
    var dico = {vehicule: Vehicule, ligne : Ligne , arret  : Arret , temps : " ?? ", incident : " ?? ", afflu :" ?? ", suppr : " Supprimer "}
    maListe.push(dico);
    localStorage.setItem('lifav', JSON.stringify(maListe));
    affiche();
    document.getElementById('valider').style.display='none';
    document.getElementById('confirmation').style.display='none';
}


function suppr(i) {
    let maListe = JSON.parse(localStorage.getItem('lifav'));
    maListe.splice(i,1);
    localStorage.setItem('lifav', JSON.stringify(maListe));
    affiche();
}



function afficheligne(v) {
    Vehicule=v;
    var html="";
    var menu1 = document.getElementById("menu1");
    for (var i = 0; i < infoLignes[v].length; i++) {

        html += "<a class = \" ligne \" href = \"#\" onclick=\" affichearret( \'" + infoLignes[v][i] + "\'); menu1f(); menu2o()\"> Ligne "+infoLignes[v][i] + "</a>"
    }   
    menu1.innerHTML = html;
}



async function affichearret(nl) {
    Ligne = nl;
    var html="";
    var menu2 = document.getElementById("menu2");
    const arrets = Object.keys(await coordinateur.api.getAPI(('api/arrets/ligne/'+nl)));
    console.log(arrets)
    for (var i=0; i < arrets.length; i++){
        html+="<a class = \" arret \" href = \"#\" onclick=\" menu2f(); arretchoisi( \'" + arrets[i] + "\')\"> " + arrets[i] +" </a>";
    }
    menu2.innerHTML=html;
}


function confirmation(){
    var html="";
    var conf = document.getElementById('confirmation')
    html = "<div>" + Vehicule  + " Ligne: " + Ligne +" arret : " + Arret  +"</div>";
    conf.innerHTML = html;
    document.getElementById('confirmation').style.display='block';
}

function arretchoisi(a){
    Arret=a;
    confirmation()
    document.getElementById('valider').style.display='block';
}

affiche()
