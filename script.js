window.onload = () => {
  loadUbikeData()
}

let map, directionsService, directionsRenderer, currentPos
let ubikeData = []

function initMap() {
  // The location of Uluru
  const uluru = { lat: 25.041599, lng: 121.5340941 }
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: uluru,
  })
  
  directionsService = new google.maps.DirectionsService()
  directionsRenderer = new google.maps.DirectionsRenderer()

  directionsRenderer.setMap(map)

  infoWindow = new google.maps.InfoWindow()

  const locationButton = document.createElement("button")
  locationButton.textContent = '取得當前地址'
  locationButton.classList.add("get-location-btn")
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton)

  locationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          currentPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          map.setCenter(currentPos)
          alert(`取得當前位置成功: 目前位置: 經度${currentPos.lng}, 緯度${currentPos.lat}`)
        },
        () => {
          handleLocationError()
        }
      )
    } else {
      handleLocationError()
    }
  })
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
    
    new markerClusterer.MarkerClusterer({ map, markers: markerList })

    ubikeData.forEach(el => {
      const cloneInfoCard = infoCard.cloneNode(true).content
      
      const a = cloneInfoCard.querySelector('a')
      const h5 = cloneInfoCard.querySelector('h5')
      const span = cloneInfoCard.querySelector('span')
      const p = cloneInfoCard.querySelector('p')
      const small = cloneInfoCard.querySelector('small')
      const button = cloneInfoCard.querySelector('button')

      a.id = el.sno
      h5.innerText = (el.sna).split('_')[1]
      span.innerText = `${el.sbi} / ${el.tot}`
      p.innerText = `${el.sarea} ${el.ar}`
      small.innerText = `上一次更新日期: ${el.updateTime}`

      a.addEventListener('click', () => {
        map.setCenter({ lat: el.lat,lng: el.lng })
      })

      button.addEventListener('click', (event) => {
        event.stopPropagation()
        directionToTarget({ lat: el.lat,lng: el.lng })
      })

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

function handleLocationError () {
  console.error('無法取得使用者地理資訊')
}

function directionToTarget(lat, lng) {
  const start = new google.maps.LatLng(currentPos)
  const end = new google.maps.LatLng(lat, lng)
  const request = {
    origin: start,
    destination: end,
    travelMode: 'WALKING'
  }
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(result)
      directionsRenderer.setPanel(document.getElementById('routeCard'))
    }
  })
}