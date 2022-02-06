window.onload = () => {
  loadUbikeData()
}

let map
let ubikeData = []

function initMap() {
  // The location of Uluru
  const uluru = { lat: -25.344, lng: 131.036 }
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: uluru,
  });
}

async function loadUbikeData() {
  try {
    const res = await axios({ url: 'https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json' })
    ubikeData = res.data
    
    ubikeData.forEach(({ lat, lng })=> {
      const latLng = new google.maps.LatLng(lat, lng)

      new google.maps.Marker({
        position: latLng,
        map: map
      })
    })
  } catch(error) {
    console.error(error)
  }
}
