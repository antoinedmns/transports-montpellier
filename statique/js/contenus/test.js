
coordinateur.api.recupererCache('api-flan-boutton').addEventListener('click', async () => {

    const flan = coordinateur.api.recupererCache('api-flan');

    const resultat = await coordinateur.api.getAPI('api/test/woz/');
    if (resultat === undefined) { flan.textContent = 'Le flan n\'a pas pu être récupéré....'; return; }

    const recetteFlan = resultat.objet['flan à la noix de coco'];
    flan.innerHTML = Object.entries(recetteFlan).map(([cle, valeur]) => `${cle}: ${valeur}`).join('<br>');

});
