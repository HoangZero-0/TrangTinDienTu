document.addEventListener("DOMContentLoaded", () => {
    // 1. Tạo thanh Topbar động
    const header = document.querySelector('header');
    if (!header) return;

    const topbar = document.createElement('div');
    topbar.className = 'topbar-weather border-bottom py-2 fixed-top';
    topbar.style.backgroundColor = '#f7f9fa';
    topbar.style.color = '#333';
    topbar.style.fontSize = '14px';
    topbar.style.fontWeight = '500';
    topbar.innerHTML = `
        <div class="container d-flex justify-content-between align-items-center">
            <div id="time-widget" class="d-flex align-items-center">
                <i class="bi bi-clock text-primary me-2"></i> <span class="fst-italic opacity-75">Đang đồng bộ vệ tinh...</span>
            </div>
            <div id="weather-widget" class="d-flex align-items-center">
                <i class="bi bi-cloud-sun text-warning me-2"></i> <span class="fst-italic opacity-75">Đang quét trạm khí tượng...</span>
            </div>
        </div>
    `;
    
    // Chèn nó lên vị trí cao nhất của thẻ header
    header.insertBefore(topbar, header.firstChild);

    // 2. Logic gọi Thời tiết (OpenWeatherMap)
    function loadWeather() {
        const apiKey = '5710ee34077ba9613254f252b6739e02';
        const weatherWidget = document.getElementById('weather-widget');

        // Hỏi quyền Vị trí (GPS)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    fetchWeather(lat, lon);
                },
                error => {
                    // Nếu từ chối GPS hoặc lỗi, lấy mặc định An Giang
                    fetchWeatherByCity('An Giang');
                }
            );
        } else {
            fetchWeatherByCity('An Giang');
        }

        // Fetch theo Lat & Lon
        function fetchWeather(lat, lon) {
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=vi&appid=${apiKey}`)
                .then(res => res.json())
                .then(data => renderWeather(data))
                .catch(err => console.error('Lỗi thời tiết:', err));
        }

        // Fetch theo Thành phố
        function fetchWeatherByCity(city) {
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},VN&units=metric&lang=vi&appid=${apiKey}`)
                .then(res => res.json())
                .then(data => renderWeather(data))
                .catch(err => console.error('Lỗi thời tiết:', err));
        }

        // Cập nhật lên Giao diện
        function renderWeather(data) {
            if (data && data.weather && data.weather.length > 0) {
                const temp = Math.round(data.main.temp);
                const desc = data.weather[0].description;
                const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
                const city = data.name;
                
                weatherWidget.innerHTML = `
                    <span class="text-uppercase fw-bold text-dark me-2" style="letter-spacing: 0.5px;">${city}</span>
                    <img src="${icon}" alt="${desc}" style="width: 32px; height: 32px; object-fit: cover; margin-top:-5px;">
                    <span class="fw-bold text-danger ms-1 me-2" style="font-size: 1.1em;">${temp}°C</span> 
                    <span class="text-muted text-capitalize">(${desc})</span>
                `;
            } else {
                weatherWidget.innerHTML = `<i class="bi bi-cloud-slash text-danger"></i> <span class="text-muted">Không tải được thời tiết</span>`;
            }
        }
    }

    // 3. Logic gọi Thời gian (WorldTimeAPI)
    function loadTime() {
        const timeWidget = document.getElementById('time-widget');
        
        // Dùng API nhận diện qua IP
        fetch('http://worldtimeapi.org/api/ip')
            .then(res => res.json())
            .then(data => {
                // Lấy thời gian UTC + offset để ra giờ địa phương vệ tinh
                let currentTime = new Date(data.datetime);
                renderTime(currentTime);
                
                // Đồng hồ đếm giấy
                setInterval(() => {
                    currentTime.setSeconds(currentTime.getSeconds() + 1);
                    renderTime(currentTime);
                }, 1000);
            })
            .catch(err => {
                console.error('Lỗi WorldTimeAPI, chuyển sang giờ máy tính:', err);
                // Fallback nếu mạng chặn API
                let currentTime = new Date();
                renderTime(currentTime);
                setInterval(() => {
                    currentTime.setSeconds(currentTime.getSeconds() + 1);
                    renderTime(currentTime);
                }, 1000);
            });

        // Hiển thị giờ đẹp mắt
        function renderTime(dateObj) {
            const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
            const dayOfWeek = days[dateObj.getDay()];
            const d = String(dateObj.getDate()).padStart(2, '0');
            const m = String(dateObj.getMonth() + 1).padStart(2, '0');
            const y = dateObj.getFullYear();
            
            const hh = String(dateObj.getHours()).padStart(2, '0');
            const mm = String(dateObj.getMinutes()).padStart(2, '0');
            const ss = String(dateObj.getSeconds()).padStart(2, '0');

            timeWidget.innerHTML = `
                <span class="text-primary fw-bold me-2" style="text-transform: uppercase;">${dayOfWeek}</span> 
                <span class="text-dark fw-semibold">${d}/${m}/${y}</span> 
                <span class="mx-3 text-black-50">|</span> 
                <i class="bi bi-clock text-secondary me-1"></i> <span class="fw-bold text-dark fs-6" style="font-family: monospace;">${hh}:${mm}:${ss}</span>
            `;
        }
    }

    // Kích hoạt
    loadWeather();
    loadTime();
});
