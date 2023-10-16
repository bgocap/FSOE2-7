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

  useEffect(() => {
      if(name){
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        .then(response => {
            setCountry({...response,found:true})
        })
        .catch(error => setCountry({found:false}))
      }
  
  },[name])
  
  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

   if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h2>{country.data.name.common} </h2>
      <p>Capital: <b>{country.data.capital}</b></p>
      <p>Population: <b>{country.data.population}</b></p>
      <p style={{fontSize:150,margin:0}}>{country.data.flag}</p>  
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