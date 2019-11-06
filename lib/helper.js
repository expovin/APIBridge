module.exports = {

    isAllowedRoute : function (document, path, method) {

        var found=false;
        console.log(document+" == "+path+" == "+method);

        document.endpoints.forEach(element => {
            console.log("Element => "+element.path);
            if ((element.path === path) ) {
                console.log("Metodo esposto esternamente");
                if(element[method])
                    found=element[method].esposto || document.esposto;
                else
                    found=false;
            }
        });

        return found
    }
}