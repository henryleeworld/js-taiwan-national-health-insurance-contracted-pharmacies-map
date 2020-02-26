var myMap = L.map('mapid', {
    center: [22.995115, 120.21826039999999],
    zoom: 14,
    renderer: L.svg()
});

$(".shade").css('display', 'flex');

var markerList = []
var beforeBound = null
var dt = new Date();
var nowPoint = null

nowPoint = [L.circleMarker([0, 0], {
    radius: 20,
    fillColor: '#212529',
    color: '#212529',
    opacity: 1,
    fillOpacity: 0.8
}), L.circleMarker([0, 0], {
    radius: 10,
    fillColor: '#212529',
    color: '#212529',
    opacity: 1,
    fillOpacity: 0.8
})]
nowPoint[0].addTo(myMap)
nowPoint[1].addTo(myMap)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 40,
}).addTo(myMap);

var blueIcon = L.icon({
    iconUrl: 'images/blue-map-maker.png',
    iconSize: [32, 55], // size of the icon
    iconAnchor: [16, 55], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var greenIcon = L.icon({
    iconUrl: 'images/green-map-maker.png',
    iconSize: [32, 55], // size of the icon
    iconAnchor: [16, 55], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var yellowIcon = L.icon({
    iconUrl: 'images/orange-map-maker.png',
    iconSize: [32, 55], // size of the icon
    iconAnchor: [16, 55], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var redIcon = L.icon({
    iconUrl: 'images/pink-map-maker.png',
    iconSize: [32, 55], // size of the icon
    iconAnchor: [16, 55], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var markerOptions = {
    fillColor: 'rgb(242,153,75)',
    color: 'rgb(242,153,75)',
    opacity: 1,
    fillOpacity: 0.8
};

var centerPoint = null

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            centerPoint = [position.coords.latitude, position.coords.longitude]
            myMap.setView([position.coords.latitude, position.coords.longitude], 15);
            nowPoint[0].setLatLng(new L.LatLng(position.coords.latitude, position.coords.longitude))
            nowPoint[1].setLatLng(new L.LatLng(position.coords.latitude, position.coords.longitude))
        });
    } else {

    }
}
getLocation()

const backToCenter = () => {
    if (centerPoint != null) {
        nowPoint[0].setLatLng(new L.LatLng(centerPoint[0], centerPoint[1]))
        nowPoint[1].setLatLng(new L.LatLng(centerPoint[0], centerPoint[1]))
        if (window.innerWidth < 674)
            myMap.setView([centerPoint[0] - 0.005, centerPoint[1]], 15);
        else
            myMap.setView(centerPoint, 15);
    } else
        getLocation()
}

const closeCard = () => {
    $(".info-card").hide()
    document.getElementsByClassName("option-area")[0].style.bottom = "70px";
    document.getElementsByClassName("option-area")[1].style.bottom = "150px";
}

const openGoogleMap = () => {
    window.open(document.getElementsByClassName("btn-bot")[1].value, '_blank');
}

$(".shade").hide()

const closeModal = () => {

    $(".shade").fadeOut("slow", () => {
        document.getElementsByClassName("shade")[0].style.zIndex = 0
        document.getElementsByClassName("shade")[1].style.zIndex = 0
    })
}
document.getElementsByClassName("shade")[0].addEventListener("click", closeModal)
const openModal = () => {
    document.getElementsByClassName("timeShade")[0].style.zIndex = 5
    $(".timeShade").fadeIn("slow")
}

const handleClick = (Element) => {
    if (nowPoint == null) {
        if (window.innerWidth < 674)
            myMap.setView([Element["geometry"]["coordinates"][1] - 0.005, Element["geometry"]["coordinates"][0]], 15);
        else
            myMap.setView([Element["geometry"]["coordinates"][1], Element["geometry"]["coordinates"][0]], 15);
        nowPoint = [L.circleMarker([position.coords.latitude, position.coords.longitude], {
            radius: 20,
            fillColor: '#212529',
            color: '#212529',
            opacity: 1,
            fillOpacity: 0.8
        }), L.circleMarker([position.coords.latitude, position.coords.longitude], {
            radius: 10,
            fillColor: '#212529',
            color: '#212529',
            opacity: 1,
            fillOpacity: 0.8
        })]
        nowPoint[0].addTo(myMap)
        nowPoint[1].addTo(myMap)
    }
    nowPoint[0].setLatLng(new L.LatLng(Element["geometry"]["coordinates"][1], Element["geometry"]["coordinates"][0]))
    nowPoint[1].setLatLng(new L.LatLng(Element["geometry"]["coordinates"][1], Element["geometry"]["coordinates"][0]))
    if (window.innerWidth < 674)
        myMap.panTo(new L.LatLng(Element["geometry"]["coordinates"][1] - 0.005, Element["geometry"]["coordinates"][0]))
    else
        myMap.panTo(new L.LatLng(Element["geometry"]["coordinates"][1], Element["geometry"]["coordinates"][0]))
    const handlePointChange = () => {
        document.getElementsByClassName("card-title")[0].textContent = Element["properties"]["name"];
        document.getElementsByClassName("card-subtitle")[0].textContent = Element["properties"]["address"];
        let realNote = ""
        if (Element["properties"]["note"] != "-") {
            for (let i = 0; i < Element["properties"]["note"].length; ++i) {
                if ((Element["properties"]["note"][i] >= "0" && Element["properties"]["note"][i] <= "9") ||
                    Element["properties"]["note"][i] == ":")
                    realNote += "<strong>" + Element["properties"]["note"][i] + "</strong>"
                else
                    realNote += Element["properties"]["note"][i]
            }
        }

        document.getElementsByClassName("card-text")[0].innerHTML = realNote
        document.getElementsByClassName("btn-bot")[1].value = "https://www.google.com/maps/search/?api=1&query=" + Element["properties"]["county"] + Element["properties"]["name"];
        document.getElementById("tel").textContent = Element["properties"]["phone"];


        let week = dt.getDay() == 0 ? 6 : dt.getDay() - 1
        let hour = 1
        if (dt.getHours() <= 12)
            hour = 0
        else if (dt.getHours() > 17)
            hour = 2

        if (Element["properties"]["service_periods"][week + hour * 7] == "N" && dt.getHours() < 21 && dt.getHours() > 7) {
            document.getElementsByClassName("btn-bot")[0].textContent = "查看營業時間(營業中)"
            document.getElementsByClassName("btn-bot")[0].style.backgroundColor = "rgb(41,171,164)"
            document.getElementsByClassName("btn-bot")[0].style.borderColor = "rgb(41,171,164)"
        } else {
            //console.log(Element["properties"]["service_periods"])
            //console.log(dt.getHours())
            document.getElementsByClassName("btn-bot")[0].textContent = "查看營業時間(休業中)"
            document.getElementsByClassName("btn-bot")[0].style.backgroundColor = "#ef5285"
            document.getElementsByClassName("btn-bot")[0].style.borderColor = "#ef5285"
        }


        document.getElementById("mask-adult").textContent = Element["properties"]["mask_adult"];
        if (Element["properties"]["mask_adult"] > 50)
            document.getElementById("mask-adult").style.backgroundColor = "rgb(41,171,164)"
        else if (Element["properties"]["mask_adult"] > 0)
            document.getElementById("mask-adult").style.backgroundColor = "rgb(242,153,75)"
        else
            document.getElementById("mask-adult").style.backgroundColor = "#ef5285"

        document.getElementById("mask-child").textContent = Element["properties"]["mask_child"];
        if (Element["properties"]["mask_child"] > 50)
            document.getElementById("mask-child").style.backgroundColor = "rgb(41,171,164)"
        else if (Element["properties"]["mask_child"] > 0)
            document.getElementById("mask-child").style.backgroundColor = "rgb(242,153,75)"
        else
            document.getElementById("mask-child").style.backgroundColor = "#ef5285"
        $(".card").show()

        document.getElementsByClassName("modal-title")[0].textContent = Element["properties"]["name"] + " 的營業時間如下";
        for (let j = 0; j < 3; ++j) {
            let code = []
            if (j == 0)
                code.push("<td>早上</td>")
            else if (j == 1)
                code.push("<td>下午</td>")
            else
                code.push("<td>晚上</td>")
            document.getElementsByClassName("time")[j].innerHTML = code.join("")
            for (let i = 0; i < 7; ++i) {
                if (Element["properties"]["service_periods"][j * 7 + i] == "N") {
                    let child = document.createElement('td');
                    child.innerHTML = "○";
                    child.style.color = "rgb(41,171,164)"
                    document.getElementsByClassName("time")[j].appendChild(child);
                } else {
                    let child = document.createElement('td');
                    child.innerHTML = "╳";
                    child.style.color = "#ef5285"
                    document.getElementsByClassName("time")[j].appendChild(child);
                }
            }

        }
    }


    $(".card-body").show(() => {
        if (window.innerWidth < 674) {
            document.getElementsByClassName("option-area")[0].style.bottom = "350px";
            document.getElementsByClassName("option-area")[1].style.bottom = "430px";
        }
    })
    handlePointChange()

}

const checkIsInZoom = () => {
    markerList.forEach((Element, Index) => {
        //myMap.setCenter(test)if(myMap.getZoom()>12){
        if (myMap.getZoom() > 12 && myMap.getBounds().contains(Element.getLatLng())) {
            if (beforeBound == null || !beforeBound.contains(Element.getLatLng()))
                Element.addTo(myMap)
        } else if (beforeBound != null && beforeBound.contains(Element.getLatLng())) {
            myMap.removeLayer(Element)
        }
    })
    if (myMap.getZoom() > 12)
        beforeBound = myMap.getBounds()
    else
        beforeBound = null
}


function getData() {
    $.ajax({
        url: "data/pharmacy-point.json", //請求的url地址
        dataType: "json", //返回格式為json
        async: true, //請求是否非同步，預設為非同步，這也是ajax重要特性
        type: "GET", //請求方式
        beforeSend: function() {
            //請求前的處理
        },
        success: function(data) {

            data["features"].forEach((Element, Index) => {
                //myMap.setCenter(test)
                if (Element["properties"]["note"].indexOf("號") != -1)
                    markerList.push(L.marker([Element["geometry"]["coordinates"][1], Element["geometry"]["coordinates"][0]], {
                        icon: blueIcon
                    }).on("click", () => {
                        handleClick(Element)
                    }))
                else if (Element["properties"]["mask_adult"] > 50)
                    markerList.push(L.marker([Element["geometry"]["coordinates"][1], Element["geometry"]["coordinates"][0]], {
                        icon: greenIcon
                    }).on("click", () => {
                        handleClick(Element)
                    }))
                else if (Element["properties"]["mask_adult"] > 0)
                    markerList.push(L.marker([Element["geometry"]["coordinates"][1], Element["geometry"]["coordinates"][0]], {
                        icon: yellowIcon
                    }).on("click", () => {
                        handleClick(Element)
                    }))
                else
                    markerList.push(L.marker([Element["geometry"]["coordinates"][1], Element["geometry"]["coordinates"][0]], {
                        icon: redIcon
                    }).on("click", () => {
                        handleClick(Element)
                    }))
            })
            markerList.forEach((Element, Index) => {
                if (myMap.getBounds().contains(Element.getLatLng())) {
                    Element.addTo(myMap)
                }
            })
            beforeBound = myMap.getBounds()
        },
        complete: function() {
            //請求完成的處理
        },
        error: function() {
            //請求出錯處理
        }
    });
}

myMap.addEventListener("zoomend", checkIsInZoom)
myMap.addEventListener("move", checkIsInZoom)

getData()

var disData;

function getDisData() {
    $.ajax({
        url: "data/city-district.json", //請求的url地址
        dataType: "json", //返回格式為json
        async: true, //請求是否非同步，預設為非同步，這也是ajax重要特性
        type: "GET", //請求方式
        beforeSend: function() {
            //請求前的處理
        },
        success: function(data) {
            disData = data;
        }
    })
}


getDisData()
const openNextDis = (Index) => {
    $(".btn-dis").css("backgroundColor", "rgba(242,153,75,0.5)");
    document.getElementsByClassName("btn-dis")[Index].style.backgroundColor = "rgb(242,153,75)"
    code = disData[disData["cityList"][Index]].map(Element => {
        return '<button class="btn-town" onclick="setAndClose(' + Element["lat"] + "," + Element["lon"] + ')">' + Element["name"] + "</button>"
    })
    document.getElementsByClassName("SecondSelect")[0].innerHTML = code.join("")
}


const openDis = () => {
    code = disData["cityList"].map((Element, Index) => {
        return '<button class="btn-dis" onclick="openNextDis(' + Index + ')">' + Element + "</button>"
    })
    document.getElementsByClassName("firstSelect")[0].innerHTML = code.join("")
    document.getElementsByClassName("disShade")[0].style.zIndex = 5
    $(".disShade").fadeIn("slow")
    document.getElementsByClassName("SecondSelect")[0].innerHTML = ""
}



const setAndClose = (lat, lon) => {
    myMap.setView([lat, lon], 15);
    closeModal()
}