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

export const TableTache = () => {

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
  const [taches, setTaches] = useState([]);
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState(0);
  const [erreur, setErreur] = useState(false);
  const [id, setId] = useState('')
  const [somme, setSomme] = useState(0)
  const [sommeMax, setSommeMax] = useState(0)
  const [retrait, setRetrait] = useState(0)
  const [voirButton, setVoirButton] = useState(false)

 const user = location.state


  function LogOut() {
    navigate('/login', {state : {}});
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!location.state || !location.state.id) {
        navigate('/login');
        return;
      }

      let { data, error } = await supabase
      .from('utilisateur_lave_voiture')
      .select(`*, utilisateur(*)`);

      let { data: totalPrix, error2 } = await supabase
      .from('utilisateur_lave_voiture')
      .select('prix')
      .eq('fait',true);

      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      if (data.length > 0) {
        console.log(data);
        setTaches(data);
      } else {
        setTaches([]);
      }

      if (totalPrix.length > 0 ) {
        const sommePrix = totalPrix.reduce((acc, item) => acc + item.prix, 0);
        const max = sommePrix - sommePrix*0.2
        
        setSomme(max)
      } else {
        setSomme(0)
      }
    };

    fetchData();
  }, [location, navigate]);

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
        <div className='text-center text-4xl text-[#D6D58E]'>Vous avez en caisse {somme} F CFA</div>
        <div className=' justify-center items-center mx-auto flex'>
          <ul role="list" className="divide-y divide-gray-100 w-[80%]">
          {taches.map((tache) => (
            <li key={tache.id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
              <UserIcon className="h-6 w-6 text-gray-500" />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">{tache.utilisateur.nom}</p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">{tache.date}</p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">{tache.idvoiture}</p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">Niveau : {tache.niveaux}   Prix:{tache.prix}</p>
                </div>
              </div>

              {tache.fait ?<div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">Effectue</p>
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-500">Online</p>
                  </div>
              </div> : 
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">en cours</p>
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
            </div> 
              }

            </li>
          ))}
        </ul>
        </div>

      </div>
  )
}
