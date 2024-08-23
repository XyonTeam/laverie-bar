import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from './Supabase';
import { useNavigate } from 'react-router-dom';




const LoginPage = () => {
  const [nom, setNom] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si l'utilisateur existe dans la table `utilisateur`
    const { data, error } = await supabase
      .from('utilisateur')
      .select('*') 
      .eq('nom', nom)
      .eq('password', password);

    if (error) {
      console.error('Error fetching user:', error);
      return;
    }

    if (data.length > 0) {
      const user = data[0];
      // Vérifier le mot de passe
      if (data[0].role == 1) {
        navigate('/home', {state: user })
      }
      if (data[0].role == 2) {
        navigate('/Laverie', {state: user })
      }
      console.log('User authorized:', user);
      
    } else {
        setNom('Oups erreur de données')
        setPassword('')
    }
  };

  return (
    <div className='flex h-screen items-center justify-center bg-[#042940]'>
      <div className='flex h-[50] lg:w-[50] w-80 justify-center border-2 rounded-lg bg-[#005C53] p-4'>
      <div className='w-full'>
        <p className='font-extrabold text-4xl text-[#9FC131] mt-2 text-center'>
          Connexion
        </p>
        <form onSubmit={handleSubmit} className='mt-4'>
          <div className='mb-4'>
            <label className='block text-[#9FC131] text-sm font-bold mb-2' htmlFor='nom'>
              Nom
            </label>
            <input
              type='text'
              id='nom'
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>
          <div className='mb-6'>
            <label className='block text-[#9FC131] text-sm font-bold mb-2' htmlFor='password'>
              Mot de passe
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>
          <div className='flex items-center justify-center'>
            <button
              type='submit'
              className='bg-[#9FC131] hover:bg-[#7FA10F] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
    
  );
};

export default LoginPage;