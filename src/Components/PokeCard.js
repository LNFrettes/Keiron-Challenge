import { Button, Card, Modal, Tabs } from "antd"
import { useEffect, useState } from "react"
import { getEvolution, getEvolutionData } from "../Helpers/PokemonD"
import {v4 as uuidv4} from 'uuid'


export default function PokeCard ({props}){
  const [preEvolutions, setPreEvolutions] = useState('ninguno')
  const [evolutions, setEvolutions] = useState([])
  
  useEffect(() =>{
    getData()
  },[])


  async function getData  () {

    const evolution = await getEvolution(props.species.url, props.name) //returns preevolution
    setPreEvolutions(evolution)

    const pokemonData = await getEvolutionData(props.species.url) //return array data from each pokemon in evolution chain
    setEvolutions(pokemonData)
    }



    //Modal state and functions
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
      setIsModalVisible(true);
    };

    const handleCancel = (e) => {
      e.stopPropagation();
      setIsModalVisible(false);
    };



    const { TabPane } = Tabs;

    return(
      <>
        <Card hoverable onClick={showModal} style={{ width: 300, boxShadow: '10px', margin: 10 }} >
          <h3>{props.name}</h3>
          <h4>{props.id}</h4>
          <img alt="example" height="100px" src={props.sprites.front_default} />
          <h4>Evoluciona de: {preEvolutions}</h4>
          <div style={{display: 'flex', alignItems: 'baseline', }}>
            <h4>Tipo del pokemon: </h4>
            {props.types.map(t => {return (<h4 key={uuidv4()} style={{marginLeft: 5, minWidth: '40px',padding: 4, backgroundColor: '#e0e0e0', borderRadius: '20px'}}> {t.type.name}</h4>)})}
          </div>
        </Card>

      
        <Modal  visible={isModalVisible}  closable={false} footer={null} onCancel={handleCancel} style={{height: 300, width: 300, backgroundColor: 'white'}}>
          <div>
            <h3>{props.name}</h3>
            <Button onClick={handleCancel}>Atras</Button>
          </div>

          <div>
            <img alt="example" height="100px" src={props.sprites.front_default} />
            <img alt="example" height="100px" src={props.sprites.front_shiny} />
            {props.sprites.back_default ? <img alt="example" height="100px" src={props.sprites.back_default} /> : null}
          </div>

          <Tabs defaultActiveKey="1" >

            <TabPane tab="Evoluciones" key="1" >
              <div style={{display: 'flex'}}>
                {
                  evolutions.length > 1 ?  evolutions.map(c => {

                    return(
                    <div style={{alignContent: 'center'}}>
                      <h3 key={uuidv4()} style={{textAlign: 'center'}}>{c.name}</h3>  
                      <img key={uuidv4()}alt="example" height="100px" src={c.sprites.front_default} />
                  
                    </div> 

                    )
                  })
                  :
                    <h3>No posee evoluciones</h3>
                }
              </div>

            </TabPane>

            <TabPane tab="Informacion" key="2" >
              <div style={{}}>
                <h3>Altura: {props.height}</h3>
                <h3>Peso: {props.weight}</h3>
                <div style={{display: 'flex', alignItems: 'center', }}>
                  <h3>Habilidades:</h3>
                  {props.abilities.map(a => {
                    return (<h4 key={uuidv4()} style={{marginLeft: 5, padding: 5, background: 'linear-gradient(90deg, rgba(228,63,41,1) 0%, rgba(221,23,111,1) 100%)', borderRadius: '10px'}} >{a.ability.name}</h4>)
                  })}

                </div>
              </div>

            </TabPane>

          </Tabs>

        </Modal>
      </>
        )
};