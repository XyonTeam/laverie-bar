import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { Card, Dropdown, Button, Checkbox, Label, Modal, TextInput, Select  } from "flowbite-react";
import { supabase } from './Supabase';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon, UserIcon } from '@heroicons/react/20/solid'// Ajustez l'import selon la structure de votre projet

function UserCard({ item }) {
  const [totalLavees, setTotalLavees] = useState(null);
  const [totalGagne, setTotalGagne] = useState(null);
  const [totalRetire, setTotalRetire] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const lavees = await TotalLave(item.id);
      const gagne = await TotalGagne(item.id);
      const retire = await TotalRetire(item.id);
      setTotalLavees(lavees);
      setTotalGagne(gagne);
      setTotalRetire(retire);
    }

    fetchData();
  }, [item.id]);

  const location = useLocation();
  const navigate = useNavigate();
  const [afficherTravaux, setAfficherTravaux] = useState(false)
  const [affecterTravaux, setAffecterTravaux] = useState(false)
  const [afficherArgent, setAfficherArgent] = useState(false)
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);

  const [matricule, setMatricule] = useState('');
  const [niveau, setNiveau] = useState(0);
  const [type, setType] = useState(0);
  const [types, setTypes] = useState([]);
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState(0);
  const [erreur, setErreur] = useState(false);
  const [id, setId] = useState('')
  const [somme, setSomme] = useState(0)
  const [sommeMax, setSommeMax] = useState(0)
  const [retrait, setRetrait] = useState(0)
  const [voirButton, setVoirButton] = useState(false)




  function onCloseModal() {
    setNom('')
    setOpenModal(false);
  }

  function onCloseModal1() {
    setNom('')
    setOpenModal1(false);
    setVoirButton(false)
  }
  async function retraitArgent(id) {
    console.log("test");
    
      
      const { data, error } = await supabase
      .from('caisse')
      .insert([
        { pris: getCurrentDate1(), montant: retrait, idUser: id },
      ])
      .select()
      if (error) {
        console.log(error);
      } else {
        setRetrait(0)
        setSommeMax(0)
        setSomme(0)
        onCloseModal1()
      }
  }

  function annulerRetrait(){
    setRetrait(0)
    setSommeMax(0)
    setSomme(0)
    onCloseModal1()
  }

  async function getPrix(id) {
    console.log(id);
    const { data, error } = await supabase
      .from('type')
      .select('*')
      .eq('id', id);

    if (error) {
      console.error('Error fetching user:', error);
      return;
    }

    if (data.length > 0) {

      setPrix(data[0].prix + data[0].prix * niveau /100);

    } else {
      return 0;
    }
  }

  async function onOpenLodal(id) {

    const { data, error } = await supabase
      .from('utilisateur')
      .select('*')
      .eq('id', id);

    if (error) {
      console.error('Error fetching user:', error);
      return;
    }

    if (data.length > 0) {

      setNom(data[0].nom)
      setId(id)

    } else {
        setUsers([])
    }
    setOpenModal(true);
  }

  const getCurrentDate1 = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  async function onOpenLodal1(id) {

    // console.log(getCurrentDate());
    

    const { data, error } = await supabase
      .from('utilisateur')
      .select('*')
      .eq('id', id);

    if (error) {
      console.error('Error fetching user:', error);
      return;
    }

    if (data.length > 0) {

      setNom(data[0].nom)
      
      let { data: totalPrix, error } = await supabase
      .from('utilisateur_lave_voiture')
      .select('prix')
      .eq('idutilisateur', id)
      .eq('fait',true);
      //.eq('date', getCurrentDate1())

      if (error) {
        console.error(error);
      } else {
        console.log(totalPrix);

        let { data: caisse, error } = await supabase
      .from('caisse')
      .select('montant')
      .eq('idUser', id);
      //.eq('pris', getCurrentDate1());

      if (totalPrix.length > 0 ) {
        let sommeRetrait = 0
        console.log(caisse);
        if (caisse.length > 0) {

          sommeRetrait = caisse.reduce((acc, item) => acc + item.montant, 0);
          console.log(sommeRetrait);
          
        }
        const sommePrix = totalPrix.reduce((acc, item) => acc + item.prix, 0);
        const max = sommePrix - sommePrix*0.2 - sommeRetrait
        setSomme(sommePrix)
        setSommeMax(max)
        setVoirButton(true)
      }

      
      }

      setId(id)

    } else {
        setUsers([])
    }
    setOpenModal1(true);
  }


  async function AllUsers() {
    const { data, error } = await supabase
      .from('utilisateur')
      .select('*')
      .eq('role', 2);

    if (error) {
      console.error('Error fetching user:', error);
      return;
    }

    if (data.length > 0) {

      setUsers(data)

    } else {
        setUsers([])
    }
  }


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function LogOut() {
    navigate('/login', {state : {}});
  }

  async function changeUserState(id, state) {
    
    
      const { data, error } = await supabase
      .from('utilisateur')
      .update({ etat: !state })
      .eq('id', id)
      .select();

      AllUsers()
              
        
  }

  async function name(params) {
    
  }
  
  
  useEffect(() => {
    const fetchData = async () => {
      if (!location.state || !location.state.id) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('utilisateur')
        .select('*')
        .eq('role', 2);

      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      if (data.length > 0) {
        
        setUsers(data);
      } else {
        setUsers([]);
      }
    };

    fetchData();
  }, [location, navigate]);

  useEffect(() => {
    const fetchData = async () => {

      const { data, error } = await supabase
        .from('type')
        .select('*');

      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      if (data.length > 0) {
        
        setTypes(data);
      } else {
        setTypes([]);
      }
    };

    fetchData();
  }, []);

  const handleChangeNiveau = async (event) => {
    setNiveau(event.target.value);
    setType(0)
  };

const getCurrentDate = () => {
      const date = new Date();
      date.setHours(0, 0, 0, 0); // Réinitialise les heures, minutes, secondes et millisecondes à zéro
      return date;
    };

    const getCurrentTime = () => {
      const date = new Date();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${hours}:${minutes}:${seconds}`;
    };

  async function validerDon (idU)  {
    let { data: voitures, error } = await supabase
      .from('voitures')
      .select("*")
      .eq("immatriculation", matricule)

      if (error) {
        return
      } else {
        if (voitures.length > 0 ) {

            const { data, error } = await supabase
            .from('voitures')
            .update({ compte: voitures[0].compte + 1 })
            .eq("immatriculation", matricule)
            .select()

            if (data) {
              
              const { data, error } = await supabase
              .from('utilisateur_lave_voiture')
              .insert([
                { idutilisateur: idU, idvoiture: matricule, date: getCurrentDate(), heure: getCurrentTime(), niveaux: niveau, prix: prix},
              ])
              .select()
                      
              setMatricule('')
              setNiveau(0)
              setType(0)
            }
                    
          
        } else {

          const { data, error } = await supabase
          .from('voitures')
          .insert([
            { immatriculation: matricule, compte: 1, idtype: type },
          ])
          .select()

          if (data) {
            const { data, error } = await supabase
            .from('utilisateur_lave_voiture')
            .insert([
              { idutilisateur: idU, idvoiture: matricule, date: getCurrentDate(), heure: getCurrentTime(), niveaux: niveau, prix: prix},
            ])
            .select()
                    
            setMatricule('')
            setNiveau(0)
            setType(0)
          }
          
        }
      }
  }

  async function TotalLave(id) {
    const { count, error } = await supabase
      .from('utilisateur_lave_voiture')
      .select('*', { count: 'exact' })
      .eq('idutilisateur', id);

    if (error) {
      console.error(error);
    } else {
      return count
    }

  }

  async function TotalGagne(id) {

    let { data: totalPrix, error } = await supabase
      .from('utilisateur_lave_voiture')
      .select('prix')
      .eq('idutilisateur', id)
      .eq('fait',true);
      //.eq('date', getCurrentDate1())

      if (error) {
        console.error(error);
      } else {
        console.log(totalPrix);

        let { data: caisse, error } = await supabase
      .from('caisse')
      .select('montant')
      .eq('idUser', id);
      //.eq('pris', getCurrentDate1());

      if (totalPrix.length > 0 ) {
        let sommeRetrait = 0
        console.log(caisse);
        if (caisse.length > 0) {

          sommeRetrait = caisse.reduce((acc, item) => acc + item.montant, 0);
          console.log(sommeRetrait);
          
        } else {
          return 0
        }
        const sommePrix = totalPrix.reduce((acc, item) => acc + item.prix, 0);
        const max = sommePrix - sommePrix*0.2
        
        return max
      } else {
        return 0
      }

      
      }

  }

  async function TotalRetire(id) {
        let { data: caisse, error } = await supabase
      .from('caisse')
      .select('montant')
      .eq('idUser', id);
      //.eq('pris', getCurrentDate1());

        let sommeRetrait = 0
        console.log(caisse);
        if (caisse.length > 0) {

          sommeRetrait = caisse.reduce((acc, item) => acc + item.montant, 0);

          return sommeRetrait

          
        } else {
          return 0
        }
  }



  const handleChangeType = (event) => {
    setType(event.target.value);
    getPrix(event.target.value)
  };

  const handleChangeRetrait = (event) => {
    setRetrait(event.target.value)
    if(event.target.value > sommeMax){
      setVoirButton(false)
    }else{
      setVoirButton(true)
    }
  };

  function annulerDon() {
    setMatricule('')
    setNiveau(0)
    setType(0)
    onCloseModal()
  }


  return (
<>
<Modal show={openModal1} size="md" onClose={onCloseModal1} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl text-center font-medium text-gray-900 dark:text-white">{nom}</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nom" value="Vous lui donnez " />
              </div>
              <TextInput
                id="nom"
                placeholder={sommeMax}
                onChange={handleChangeRetrait}
                required
              />
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              Vous lui donner &nbsp;
              <p className="text-cyan-700 hover:underline dark:text-cyan-500">
                {retrait} F CFA
              </p>
            </div>
            <div className="w-full flex justify-between">
              <Button className='bg-[#D6D58E]' onClick={annulerRetrait}>Annuler </Button> 
              {voirButton && <Button onClick={() => retraitArgent(id)}>Donner</Button>}
            </div>
            {erreur && <div className="flex justify-between text-sm font-medium text-red-500 dark:text-red-500">
              Une erreur est survenue !
            </div>}
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl text-center font-medium text-gray-900 dark:text-white">{nom}</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nom" value="Le matricule de la voiture *sans espace* " />
              </div>
              <TextInput
                id="nom"
                placeholder="CE432HJ"
                value={matricule}
                onChange={(event) => setMatricule(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="niveau" value="Le niveau de saleté" />
              </div>
              <TextInput id="niveau" type="number" value={niveau} onChange={handleChangeNiveau} placeholder="10" required />
            </div>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="countries" value="Choisir le type" />
              </div>
              <Select id="countries" value={type} onChange={handleChangeType} required>
                <option value={0}>Choix</option>
                {types.map((item) => (
                  <option key={item.id} value={item.id}>{item.nomtype} === {item.prix}</option>
                ))}
              </Select>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              ça fera &nbsp;
              <p className="text-cyan-700 hover:underline dark:text-cyan-500">
                {prix} F CFA
              </p>
            </div>
            <div className="w-full flex justify-between">
              <Button className='bg-[#D6D58E]' onClick={annulerDon}>Annuler </Button> <Button onClick={() => validerDon(id)}>Donner</Button>
            </div>
            {erreur && <div className="flex justify-between text-sm font-medium text-red-500 dark:text-red-500">
              Une erreur est survenue !
            </div>}
          </div>
        </Modal.Body>
      </Modal>
    <Card key={item.id} className="max-w-sm mx-auto lg:mx-1 my-5">
      <div className="flex justify-end px-4 pt-4">
        <Dropdown inline label="">
          <Dropdown.Item>
            <button 
              onClick={() => changeUserState(item.id, item.etat)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              {item.etat === false ? "Activer" : "Désactiver"}
            </button>
          </Dropdown.Item>
        </Dropdown>
      </div>
      <div className="flex flex-col items-center pb-10">
        <UserIcon className="h-6 w-6 text-gray-500" />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{item.nom}</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Total lavées: {totalLavees !== null ? totalLavees : 'Chargement...'}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Total gagné: {totalGagne !== null ? totalGagne : 'Chargement...'}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Total rétiré: {totalRetire !== null ? totalRetire : 'Chargement...'}
        </span>
        <div className="mt-4 flex space-x-3 lg:mt-6">
          <Button
            className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            onClick={() => onOpenLodal(item.id)}
          >
            Donner une tâche
          </Button>
          <Button
            className="inline-flex items-center rounded-lg bg-[#9FC131] px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            onClick={() => onOpenLodal1(item.id)}
          >
            Donner de l'argent
          </Button>
        </div>
      </div>
    </Card>
</>
    
  );
}

async function TotalLave(id) {
    const { count, error } = await supabase
      .from('utilisateur_lave_voiture')
      .select('*', { count: 'exact' })
      .eq('idutilisateur', id);

    if (error) {
      console.error(error);
    } else {
      return count
    }

  }

  async function TotalGagne(id) {

    let { data: totalPrix, error } = await supabase
      .from('utilisateur_lave_voiture')
      .select('prix')
      .eq('idutilisateur', id)
      .eq('fait',true);
      //.eq('date', getCurrentDate1())

      if (error) {
        console.error(error);
      } else {
        console.log(totalPrix);

        let { data: caisse, error } = await supabase
      .from('caisse')
      .select('montant')
      .eq('idUser', id);
      //.eq('pris', getCurrentDate1());

      if (totalPrix.length > 0 ) {
        let sommeRetrait = 0
        console.log(caisse);
        if (caisse.length > 0) {

          sommeRetrait = caisse.reduce((acc, item) => acc + item.montant, 0);
          console.log(sommeRetrait);
          
        } else {
          return 0
        }
        const sommePrix = totalPrix.reduce((acc, item) => acc + item.prix, 0);
        const max = sommePrix - sommePrix*0.2
        
        return max
      } else {
        return 0
      }

      
      }

  }

  async function TotalRetire(id) {
        let { data: caisse, error } = await supabase
      .from('caisse')
      .select('montant')
      .eq('idUser', id);
      //.eq('pris', getCurrentDate1());

        let sommeRetrait = 0
        console.log(caisse);
        if (caisse.length > 0) {

          sommeRetrait = caisse.reduce((acc, item) => acc + item.montant, 0);

          return sommeRetrait

          
        } else {
          return 0
        }
  }

export default function UserList({ users }) { 
  return (
    <>
      {users.length > 0 && users.map((item) => (
        <UserCard key={item.id} item={item} />
      ))}
    </>
  );
}