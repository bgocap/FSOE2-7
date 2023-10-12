import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }
  const reset = () =>{
    const newValue = ''
    setValue(newValue)
  }

  return {
    element:{
        type,
        value,
        onChange
    },
    reset
  }
}

