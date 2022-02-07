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
    console.log(ubikeData)

    
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
      })

      marker.addListener('click', () => {

        toggleToListCard(marker)
      })
      
      markerList.push(marker)
    })
    
    new markerClusterer.MarkerClusterer({ map, markers: markerList });

    ubikeData.forEach(el => {
      const cloneInfoCard = infoCard.cloneNode(true).content
      
      const a = cloneInfoCard.querySelector('a')
      const h5 = cloneInfoCard.querySelector('h5')
      const span = cloneInfoCard.querySelector('span')
      const p = cloneInfoCard.querySelector('p')
      const small = cloneInfoCard.querySelector('small')

      a.id = el.sno
      h5.innerText = (el.sna).split('_')[1]
      span.innerText = `${el.sbi} / ${el.tot}`
      p.innerText = `${el.sarea} ${el.ar}`
      small.innerText = `上一次更新日期: ${el.updateTime}`

      infoListGroup.append(cloneInfoCard)
    })

  } catch(error) {
    console.error(error)
  }
}

function toggleToListCard(marker) {
  const latlng = { lat: marker.position.lat(), lng: marker.position.lng() }
  const toggleData = ubikeData.find(x => x.lat == latlng.lat && x.lng == latlng.lng )
  window.location.hash = `#${toggleData.sno}`
  const targetCard = document.getElementById(toggleData.sno)
  targetCard.classList.add('active')
  setTimeout(() => {
    targetCard.classList.remove('active')
  }, 3000)
}
