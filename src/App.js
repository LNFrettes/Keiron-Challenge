import './App.css';
import  {AutoComplete} from 'antd';
import PokeCard from './Components/PokeCard';
import { useEffect, useState } from 'react';
import { getPokemonList, getPokemonNames, getPokemonsData } from './Helpers/PokemonD';



function App() {

  //list of pokemons names
  const [list, setList] = useState([])
  // autocomplete render options
  const [options, setOptions] = useState([])
  //pokemon data
  const [data, setData] = useState([])


  useEffect(() =>{
    if(data.length === 0){
      getData()
    }
  }, [data])

  
  async function getData(){

    const pokeNameList = await getPokemonNames() //get list of names {value: name}
    setList(pokeNameList)
    setOptions(pokeNameList)
    
    const pokeList = await getPokemonList() // get list of pokemons {name:, url:}
    const pokeListSliced = pokeList.data.results.slice(0,25) //just first 25
    const urlArray = pokeListSliced.map( p => p.url) // 
    const result = await getPokemonsData(urlArray) // {abilities, name ....}
    setData(result)

  
  }

    


  
  


  const handleSearch = async (value) => {
    let matches = [] //stores all possible matches between input and name
    let urls = [] // stores url

    list.forEach(n => {
      if(n.value.startsWith(value)){
        matches.push({value: n.value})
        urls.push(`https://pokeapi.co/api/v2/pokemon/${n.value}/`)
      }
    })
    setOptions(matches)

    if(matches.length > 0){
      if(value.length > 0){
        const pokemonData = await getPokemonsData(urls.slice(0,25)) // only return 25 pokemons

        Promise.all(pokemonData).then(dat => { //in order to not work with an array of promises
          setData(dat)
        })
      }
      else{
        setData([]) //clear data state for useEffect action
      }
    }
  }
  
  





  return (
    <div className="App">
      <header style={{background: ' radial-gradient(circle, rgba(228,63,41,1) 0%, rgba(221,23,111,1) 100%)', height: 30}}>
        nav bar
      </header>
      <h1>pokedex</h1>

      <AutoComplete style={{width: 300}} options={options} onSearch={handleSearch} onSelect={handleSearch}/>
      
      <div style={{display: 'flex', padding: 10, flexWrap: 'wrap', width: '100vw' }}>
        {
          data.length > 0 ? 
            data.map(p => {
              return(
             
                    <PokeCard  key={p.id} props={p}/>                  
              
            )})
          : null
        }
      </div>
    </div>
  );
}

export default App;
