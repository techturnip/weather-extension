import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { InputBase, IconButton, Paper, Box, Grid } from '@material-ui/core'
import { Add as AddIcon } from '@material-ui/icons'
import 'fontsource-roboto'
import './popup.css'
import WeatherCard from './WeatherCard'
import {
  setStoredCities,
  getStoredCities,
  setStoredOptions,
  getStoredOptions,
  LocalStorageOptions,
} from '../utils/storage'

const App: React.FC<{}> = () => {
  const [cities, setCities] = useState<string[]>([])
  const [cityInput, setCityInput] = useState<string>('')
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)

  useEffect(() => {
    getStoredCities().then((cities) => {
      setCities(cities)
    })
    getStoredOptions().then((options) => {
      setOptions(options)
    })
  }, [])

  const handleCityButtonClick = () => {
    if (cityInput === '') {
      return
    }
    const updatedCities = [...cities, cityInput]
    setStoredCities(updatedCities).then(() => {
      setCities(updatedCities)
      setCityInput('')
    })
  }

  const handleCityDeleteButtonClick = (index: number) => {
    cities.splice(index, 1)
    const updatedCities = [...cities]
    setStoredCities(updatedCities).then(() => setCities(updatedCities))
  }

  if (!options) {
    return null
  }

  return (
    <Box mx={'4px'} my={'16px'}>
      <Grid container>
        <Grid item>
          <Paper className="paper">
            <Box px="15px" py="5px">
              <InputBase
                placeholder="Add a city name"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
              />
              <IconButton onClick={handleCityButtonClick}>
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {cities.map((city, index) => (
        <WeatherCard
          key={index}
          city={city}
          onDelete={() => handleCityDeleteButtonClick(index)}
        />
      ))}
      <Box height="16px"></Box>
    </Box>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
