(function() {
    var temperature = [];
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('Add_Button').addEventListener("click", add);
        document.getElementById('EraseLocation').addEventListener("click", deleteLoc);
        document.getElementById('Get_the_Weather').addEventListener("click", show_weather().getData);
    }, false);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //the main function that showing the weather to the user
    var show_weather = function () {
        getData = function () {
            var myImage = document.querySelector('img');
            var value = getting_the_value();  //we are getting the data from the array when i store the latitude and longitude

            fetch('http://www.7timer.info/bin/api.pl?lon=' + value[1][0] + '&lat=' + value[1][1] + '&product=civillight&output=json')
                .then(function (response) {
                        if (response.status !== 200) {
                            console.log('Looks like there was a problem. Status Code: ' + response.status);
                            return;
                        }
                        response.json().then(function (data) {    //here we are parsing the json to javasript object so we are printing on the screen the data
                            let html = "";
                            document.getElementById("Name_Of_City").innerHTML = value[0];
                            document.getElementById("loadFailed").style.display = "none";
                            let day = 1;
                            document.getElementById("show_the_weather").style.display = "block";
                            for (item of data.dataseries) {
                                var thedate = item.date.toString();
                                thedate = thedate.slice(6, 9) + "/" + thedate.slice(4, 6) + "/" + thedate.slice(0, 4);
                                html = '<th scope="row">' + 'Day' + day + '</th>' +
                                    "<td>" + thedate + "</td>" +
                                    "<td>" + item.weather + "</td>" +
                                    "<td>" + item.temp2m.max + "</td>" +
                                    "<td>" + item.temp2m.min + "</td>" +
                                    "<td>" + wind(item.wind10m_max) + "</td>";
                                document.getElementById("Day" + day++).innerHTML = html;
                            }
                        })
                    })
                .catch(function (err) {   //if the called to server is failled , then we printing on the screena message
                    document.getElementById("loadFailed").style.display = "block";
                    console.log('Fetch Error :', err);
                });
//with this fetch we are called to the server to get a curent picture of weather
            fetch("http://www.7timer.info/bin/astro.php? lon=" + value[1][0] + "&lat=" + value[1][1] + "&ac=0&lang=en&unit=metric&output=internal&tzshift=0")
                .then(function (response) {
                        if (response.status !== 200) {
                            console.log('Looks like there was a problem. Status Code: ' + response.status);
                            return;
                        }
                        response.blob()
                            .then(function (myBlob) {
                                var objectURL = URL.createObjectURL(myBlob);
                                myImage.src = objectURL;
                                document.getElementById("myImage").style.display = "block";
                            })
                    })
                //if the call was failled then we are printing on th escreen a default picture
                .catch(function (err) {
                    document.getElementById("myImage").style.display = "block";
                    myImage.src = "/images/default_image.jpg";
                    console.log('Fetch Error :', err);
                });

        };
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//it's the function that getting the data from the array
        getting_the_value = function () {
            for (radio of document.getElementsByName("radio_buttom"))
                if (radio.checked)
                    return [radio.id, temperature[radio.id]];
        };

       //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       //this function checking if the wind is greater that 1 if yes then we does't print it
        wind = function (winder) {
            if (winder > 1)
                return winder;
            return "";
        };
        return{
            getData:getData
        };
    }
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //this function add any city that i enterred in a list of city if its over the cheking succfully
    function add() {
        const data = { city: "jerusalem" };
        const content = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        fetch('http://localhost:3000/api/position', content)
            .then(text => {
                console.log(text);

            }).catch(function (error){
            console.log(error);
        });
        /*fetch('/api/position', {
            method: 'POST',
            body:    JSON.stringify({city:"jerusalem"}),
            headers: { 'Content-Type': 'application/json' },
        })*/
        /*if (!valid().checkTheInput()) {
            document.getElementById("errorField").style.display = "block";
        } else {
            document.getElementById("errorField").style.display = "none";
            document.getElementById("list1").style.display = "block";
            myradio = document.getElementById("list");
            cityname = document.getElementById("LocationName").value;
            let labelValue = document.createElement('label');
            labelValue.innerHTML = "&emsp;" + cityname;
            labelValue.id = cityname + 1;
            let inputValue = document.createElement('input');
            inputValue.type = "radio";
            inputValue.name = "radio_buttom";
            inputValue.id = cityname;
            myradio.appendChild(inputValue);
            myradio.appendChild(labelValue);
            myradio.appendChild((document.createElement("br")));
            initData();
        }*/
    }
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//this function delete the city that i select with a radiobutton
    deleteLoc = function () {
        document.getElementById("show_the_weather").style.display = "none";
        for (let i = 0; i < myradio.childNodes.length; i++)
            if (myradio.childNodes[i].checked) {
                myradio.removeChild(myradio.childNodes[i]);
                delete temperature[myradio.children[i].id];
                myradio.removeChild(myradio.childNodes[i]);
                myradio.removeChild(myradio.childNodes[i]);
                if (!myradio.childNodes.length)
                    document.getElementById("list1").style.display = "none";
                return;
            }
    }
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //it's a function that save the value of any city that i get in the array
    initTheData = function (lat, lon) {
        temperature[document.getElementById("LocationName").value] = [lat, lon];
    }
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //its a namespaces of validation
    var valid = function()
    {
        //this function get the long &lat of the city and send them to function
        checkTheInput = function () {
            let lat = document.getElementById("Latitudenum").value;
            let lon = document.getElementById("Longitudenum").value;
            if (isOk(lat, lon)) {
                initTheData(lat, lon);
                return true;
            }
            return false;
        };
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        isOk = function (lat, lon) {
            var text_error = "";
            if (!document.getElementById("LocationName").value)
                text_error += "<li>the Location name  need to be entered</li>";
            if (!lat)
                text_error += "<li>the latitude need to be entered</li>";
            else if (lat < -90 || lat > 90)
                text_error += "<li>the latitude needs to be in range of (90)->(-90)</li>";
            else if ((lat - Math.floor(lat)) === 0)
                text_error += "<li>the latitude needs to be a decimal number</li>";
            if (!lon)
                text_error += "<li>the longitude need to be entered</li>";
            else if (lon < -180 || lon > 180)
                text_error += "<li>the latitude needs to be in range of (180)->(-180)</li>";
            else if ((lon - Math.floor(lon)) === 0)
                text_error += "<li>the longitude needs to be a decimal number</li>";
            if (!text_error)
                return true;
            document.getElementById("errorField").innerHTML = text_error;
            return false;
        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
         return{
            checkTheInput:checkTheInput
        };
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //if the city was added succefuly then we are cleanning the input for the next city
    initData =function (){
        document.getElementById("form-group").reset();
    }
})();