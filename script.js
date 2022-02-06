window.onload = () => {
  loadUbikeData()
}

let map
let ubikeData = []

function initMap() {
  // The location of Uluru
  const uluru = { lat: 25.041599, lng: 121.5340941 }
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: uluru,
  });
}

async function loadUbikeData() {
  try {
    const res = await axios({ url: 'https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json' })
    ubikeData = res.data
    
    const markerList = []
    ubikeData.forEach(({ lat, lng })=> {
      const latLng = new google.maps.LatLng(lat, lng)

      const marker = new google.maps.Marker({
        position: latLng,
        map: map,
        label: {
          text: '\ue52f',
          fontFamily: 'Material Icons',
          color: '#ffffff',
          fontSize: '18px'
        }
        // label: 'A'
      })
      markerList.push(marker)
    })
    
    new markerClusterer.MarkerClusterer({ map, markers: markerList });
    
  } catch(error) {
    console.error(error)
  }
}
