import OPEN_WEATHER_API_KEY from './apiKey'

export interface OpenWeatherData {
  name: string
  main: {
    feels_like: number
    temp: number
    temp_min: number
    temp_max: number
    humidity: number
    pressure: number
  }
  weather: {
    description: string
    icon: string
    id: number
    main: string
  }[]
  wind: {
    deg: number
    speed: number
  }
}

export type OpenWeatherTempScale = 'metric' | 'imperial'

export async function fetchOpenWeatherData(
  city: string
): Promise<OpenWeatherData> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${OPEN_WEATHER_API_KEY}`
  )

  if (!res.ok) {
    throw new Error(`City not found`)
  }

  const data: OpenWeatherData = await res.json()
  return data
}
