<script setup>
import { ref, onMounted } from 'vue'

// 状态管理
const cityInput = ref('Beijing') // 默认搜索北京
const weatherData = ref(null)
const loading = ref(false)
const errorMsg = ref('')

// 常见天气代码映射 (Open-Meteo WMO Code)
const weatherCodeMap = {
  0: { label: '晴朗', icon: '☀️' },
  1: { label: '多云', icon: '🌤️' },
  2: { label: '多云', icon: '🌤️' },
  3: { label: '阴天', icon: '☁️' },
  45: { label: '雾', icon: '🌫️' },
  48: { label: '雾凇', icon: '🌫️' },
  51: { label: '小毛毛雨', icon: '🌧️' },
  53: { label: '毛毛雨', icon: '🌧️' },
  55: { label: '大毛毛雨', icon: '🌧️' },
  61: { label: '小雨', icon: '🌧️' },
  63: { label: '中雨', icon: '🌧️' },
  65: { label: '大雨', icon: '⛈️' },
  80: { label: '阵雨', icon: '🌦️' },
  95: { label: '雷雨', icon: '⚡' },
  96: { label: '雷雨伴冰雹', icon: '⛈️' },
  99: { label: '雷雨伴冰雹', icon: '⛈️' }
}

// 获取天气图标和描述
const getWeatherInfo = (code) => {
  return weatherCodeMap[code] || { label: '未知', icon: '❓' }
}

// 搜索天气逻辑
const searchWeather = async () => {
  if (!cityInput.value.trim()) return
  
  loading.value = true
  errorMsg.value = ''
  weatherData.value = null

  try {
    // 1. 地理编码 API：将城市名转换为经纬度
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput.value}&count=1&language=zh&format=json`
    )
    const geoData = await geoRes.json()

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('未找到该城市，请尝试输入英文名称或拼音')
    }

    const location = geoData.results[0]
    const { latitude, longitude, name, country } = location

    // 2. 天气 API：根据经纬度获取天气
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    )
    const weatherResult = await weatherRes.json()

    // 组装数据
    weatherData.value = {
      city: name,
      country: country,
      temp: weatherResult.current_weather.temperature,
      wind: weatherResult.current_weather.windspeed,
      code: weatherResult.current_weather.weathercode,
      isDay: weatherResult.current_weather.is_day,
      // 获取当天的最高/最低温
      maxTemp: weatherResult.daily.temperature_2m_max[0],
      minTemp: weatherResult.daily.temperature_2m_min[0]
    }

  } catch (err) {
    errorMsg.value = err.message || '获取天气数据失败，请稍后重试'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 初始化加载一次
onMounted(() => {
  searchWeather()
})
</script>

<template>
  <div class="weather-container">
    <div class="weather-card">
      <!-- 搜索区域 -->
      <div class="search-box">
        <input 
          v-model="cityInput" 
          @keyup.enter="searchWeather"
          type="text" 
          placeholder="输入城市拼音或英文 (如 Beijing)" 
        />
        <button @click="searchWeather" :disabled="loading">
          {{ loading ? '查询中...' : '🔍 搜索' }}
        </button>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMsg" class="error-msg">
        {{ errorMsg }}
      </div>

      <!-- 天气展示区域 -->
      <div v-if="weatherData" class="weather-info">
        <div class="location">
          <h2>{{ weatherData.city }}</h2>
          <span>{{ weatherData.country }}</span>
        </div>

        <div class="main-info">
          <div class="icon">
            {{ getWeatherInfo(weatherData.code).icon }}
          </div>
          <div class="temp">
            {{ weatherData.temp }}°C
          </div>
          <div class="desc">
            {{ getWeatherInfo(weatherData.code).label }}
          </div>
        </div>

        <div class="details">
          <div class="detail-item">
            <span>风速</span>
            <strong>{{ weatherData.wind }} km/h</strong>
          </div>
          <div class="detail-item">
            <span>最高温</span>
            <strong>{{ weatherData.maxTemp }}°C</strong>
          </div>
          <div class="detail-item">
            <span>最低温</span>
            <strong>{{ weatherData.minTemp }}°C</strong>
          </div>
        </div>
      </div>
      
      <!-- 初始空状态 -->
      <div v-else-if="!loading && !errorMsg" class="empty-state">
        请输入城市名查看天气
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.weather-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #74ebd5 0%, #9face6 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.weather-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #eee;
    border-radius: 12px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s;

    &:focus {
      border-color: #9face6;
    }
  }

  button {
    background: #9face6;
    color: white;
    border: none;
    padding: 0 20px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s;

    &:hover {
      background: #74ebd5;
    }

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
}

.error-msg {
  color: #ff6b6b;
  margin-bottom: 15px;
  font-size: 14px;
  background: #fff0f0;
  padding: 10px;
  border-radius: 8px;
}

.weather-info {
  animation: fadeIn 0.5s ease;

  .location {
    margin-bottom: 20px;
    h2 {
      margin: 0;
      color: #333;
      font-size: 28px;
    }
    span {
      color: #666;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }

  .main-info {
    margin: 30px 0;
    
    .icon {
      font-size: 80px;
      margin-bottom: 10px;
      // 简单的浮动动画
      animation: float 3s ease-in-out infinite;
    }
    
    .temp {
      font-size: 56px;
      font-weight: bold;
      color: #2c3e50;
    }
    
    .desc {
      font-size: 20px;
      color: #7f8c8d;
      margin-top: 5px;
    }
  }

  .details {
    display: flex;
    justify-content: space-between;
    background: #f8f9fa;
    padding: 15px;
    border-radius: 16px;
    margin-top: 20px;

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
      
      span {
        font-size: 12px;
        color: #95a5a6;
      }
      
      strong {
        color: #34495e;
        font-size: 16px;
      }
    }
  }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>



