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
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon, UserIcon } from '@heroicons/react/20/solid'
import UserList from './ListUsers';




const products = [


  {
    id: 1,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black',
  },
  // More products...
]


const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [afficherTravaux, setAfficherTravaux] = useState(false)
  const [affecterTravaux, setAffecterTravaux] = useState(false)
  const [afficherArgent, setAfficherArgent] = useState(false)
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

 const user = location.state



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
          // console.log(sommeRetrait);
          
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
    <div className='bg-[#042940] h-screen'>
      <header className="bg-[#005C53]">
        <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Laverie</span>
              <img alt="" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" className="h-8 w-auto" />
            </a>
          </div>
          <div className="flex lg:hidden ">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#DBF227]"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <PopoverGroup className="hidden lg:flex lg:gap-x-12 justify-between ">

          <button onClick={() => navigate('/Home',{state : user})} className=" hover:text-[#D6D58E] text-center mx-auto h-8 text-base font-semibold text-gray-900 ">
                  
                  Acceuil
              </button>
              <button onClick={() => navigate('/Taches',{state : user})} className=" hover:text-[#D6D58E] text-center mx-auto h-8 text-base font-semibold text-gray-900 ">
                  
                  Table de taches
              </button>
              <button onClick={() => navigate('/Caisse',{state : user})} className=" hover:text-[#D6D58E] text-center mx-auto h-8 text-base font-semibold text-gray-900 ">
                  
                  Table de caisse
              </button>
          </PopoverGroup>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <button onClick={LogOut} className="text-[#DBF227] hover:text-[#042940]">
                  
                  Se déconnecter<span aria-hidden="true">&rarr;</span>
              </button>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-10" />
          <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10 items-center justify-center flex-1">
              <button onClick={() => navigate('/Home',{state : user})} className=" hover:text-[#D6D58E] text-center mx-auto h-8 text-base font-semibold text-gray-900 ">
                  
                  Acceuil
              </button>
              <button onClick={() => navigate('/Taches',{state : user})} className=" hover:text-[#D6D58E] text-center mx-auto h-8 text-base font-semibold text-gray-900 ">
                  
                  Table de taches
              </button>
              <button onClick={() => navigate('/Caisse',{state : user})} className=" hover:text-[#D6D58E] text-center mx-auto h-8 text-base font-semibold text-gray-900 ">
                  
                  Table de caisse
              </button>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div>
        <div className="bg-[#042940] lg:flex">
          <UserList users={users} />            
          
        </div>
      </div>

    </div>
  )
}

export default Home