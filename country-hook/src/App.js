import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  console.log('how many times useCountry values=> country:',country,'name:',name)
  
  useEffect(() => {
    console.log('value of name in the useEffect hook:',name)
    if(name){
      console.log('insed IF of useffect')
      axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then(response => {
          const newCountry=response.data
          setCountry(newCountry)
    })}
  
  })
  
  return country
}

const Country = ({ country }) => {
  console.log('CountryElement - received country: ',country)
  if (!country) {
    return null
  }

/*   if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  } */

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)


  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
    console.log('WhenClick-country:',country,'name:',name)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App