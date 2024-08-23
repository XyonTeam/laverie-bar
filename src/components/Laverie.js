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


export const Laverie = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [taches, setTaches] = useState();
  const [voitures, setVoitures] = useState();
  const [total, setTotal] = useState();
  const [retrait, setRetrait] = useState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      TotalGagne()
      TotalLave()
      TotalRetire()
      const { data, error } = await supabase
      .from('utilisateur_lave_voiture')
      .select('*')
      .eq('idutilisateur', user.id);



      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      if (data.length > 0) {
        
        setTaches(data);
      } else {
        setTaches([]);
      }
    };

    fetchData();
  }, [location, navigate]);


  async function TotalLave(id) {
    const { count, error } = await supabase
      .from('utilisateur_lave_voiture')
      .select('*', { count: 'exact' })
      .eq('idutilisateur', id);

    if (error) {
      console.error(error);
    } else {
      setVoitures(count)
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
          setRetrait(sommeRetrait);
          
        } else {
          setTotal(0)
        }
        const sommePrix = totalPrix.reduce((acc, item) => acc + item.prix, 0);
        const max = sommePrix - sommePrix*0.2
        
        return max
      } else {
        setTotal(0)
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

          setRetrait(sommeRetrait)

          
        } else {
          setRetrait(0)
        }
  }


  async function getTaches() {
    const { data, error } = await supabase
      .from('utilisateur_lave_voiture')
      .select('*')
      .eq('idutilisateur', user.id);

      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      if (data.length > 0) {
        
        setTaches(data);
      } else {
        setTaches([]);
      }
  }

  async function deleteTache(id) {
    const { data, error } = await supabase
      .from('utilisateur_lave_voiture')
      .delete()
      .eq('id', id)
      .select();

      if (error) {
        console.log(error);
      }else{
        getTaches()
      }
  }

  async function validerTache(id) {
    const { data, error } = await supabase
      .from('utilisateur_lave_voiture')
      .update({ fait: true })
      .eq('id', id)
      .select();

      if (error) {
        console.log(error);
      }else{
        getTaches()
      }
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

        <div className='text-center text-4xl text-[#D6D58E]'>Vous avez laver {voitures} Vous avez gagne {total} mais vous avez retire {retrait}</div>
    {taches.map((item) =>
    (<Card key={item.id} className="max-w-sm mx-auto lg:mx-1 my-5">
      <div className="flex justify-end px-4 pt-4">
      </div>
      <div className="flex flex-col items-center pb-10">
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{item.idvoiture}</h5>

        {item.fait ?
          <div className="mt-4 flex space-x-3 lg:mt-6">
            <Button
              className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
              onClick={() => deleteTache(item.id)}
            >
              Refuser
            </Button>
            <Button
              className="inline-flex items-center rounded-lg bg-[#9FC131] px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
              onClick={() => validerTache(item.id)}
            >``
              Laver
            </Button>
          </div>
          :
          <div><Button
          className="inline-flex items-center rounded-lg bg-[#9FC131] px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
        >
          Deja lave
        </Button></div>
        }
      </div>
    </Card>))}
    </div>
  )
}
