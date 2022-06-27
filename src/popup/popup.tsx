import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { InputBase, IconButton, Paper, Box, Grid } from '@material-ui/core'
import {
  Add as AddIcon,
  PictureInPicture as PictureInPictureIcon,
} from '@material-ui/icons'
import 'fontsource-roboto'
import './popup.css'
import WeatherCard from '../components/WeatherCard'
import {
  setStoredCities,
  getStoredCities,
  setStoredOptions,
  getStoredOptions,
  LocalStorageOptions,
} from '../utils/storage'
import { Messages } from '../utils/messages'

// ============================================================|
// APP COMPONENT                                               |
// ============================================================|
const App: React.FC<{}> = () => {
  // ============================================================|
  // STATE                                                       |
  // ============================================================|
  const [cities, setCities] = useState<string[]>([])
  const [cityInput, setCityInput] = useState<string>('')
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)

  // ============================================================|
  // LIFECYCLE METHODS                                           |
  // ============================================================|
  useEffect(() => {
    // get stored cities from local storage and set them to state
    getStoredCities().then((cities) => {
      setCities(cities)
    })
    // get stored options from local storage and set them to state
    getStoredOptions().then((options) => {
      setOptions(options)
    })
  }, [])

  // ============================================================|
  // EVENT HANDLER FUNCTIONS                                     |
  // ============================================================|
  /**
   * Adds the city to the list of cities and saves it to local storage.
   *
   * @returns {JSX.Element}
   */
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

  /**
   * Removes the city from the list of cities and saves it to local storage.
   *
   * @param index The index of the city to remove
   */
  const handleCityDeleteButtonClick = (index: number) => {
    cities.splice(index, 1)
    const updatedCities = [...cities]
    setStoredCities(updatedCities).then(() => setCities(updatedCities))
  }

  const handleTempScaleButtonClick = () => {
    const updatedOptions: LocalStorageOptions = {
      ...options,
      tempScale: options.tempScale === 'imperial' ? 'metric' : 'imperial',
    }
    setStoredOptions(updatedOptions).then(() => {
      chrome.tabs.query(
        {
          active: true,
        },
        (tabs) => {
          if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_SCALE)
          }
        }
      )
      setOptions(updatedOptions)
    })
  }

  const handleOverlayButtonClick = () => {
    chrome.tabs.query(
      {
        active: true,
      },
      (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY)
        }
      }
    )
  }

  // ============================================================|
  // RENDER FUNCTIONS                                            |
  // ============================================================|
  /**
   * Return null if the options are null.
   */
  if (!options) {
    return null
  }

  return (
    <Box mx={'4px'} my={'16px'}>
      <Grid container justifyContent="space-evenly">
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
        <Grid item>
          <Paper>
            <Box py="2px">
              <IconButton onClick={handleTempScaleButtonClick}>
                {options.tempScale === 'imperial' ? '\u2109' : '\u2103'}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py="2px">
              <IconButton onClick={handleOverlayButtonClick}>
                <PictureInPictureIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {options.homeCity != '' && (
        <WeatherCard city={options.homeCity} tempScale={options.tempScale} />
      )}
      {cities.map((city, index) => (
        <WeatherCard
          key={index}
          city={city}
          tempScale={options.tempScale}
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
