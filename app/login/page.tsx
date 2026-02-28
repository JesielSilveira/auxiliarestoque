"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();
  const [senha,setSenha] = useState("");
  const [erro,setErro] = useState("");

  async function entrar(e:any){
    e.preventDefault();

    const res = await fetch("/api/login",{
      method:"POST",
      body:JSON.stringify({senha})
    });

    if(res.ok){
      router.push("/");
      router.refresh();
    }else{
      setErro("Acesso negado");
    }
  }

  return(
    <main className="min-h-screen flex items-center justify-center bg-slate-100">

      <form
        onSubmit={entrar}
        className="bg-white p-8 rounded-2xl shadow-xl w-80 space-y-4"
      >

        <h1 className="text-xl font-black text-center">
          Acesso Restrito
        </h1>

        <input
          type="password"
          placeholder="Senha"
          className="w-full p-3 bg-slate-100 rounded-xl font-bold"
          value={senha}
          onChange={e=>setSenha(e.target.value)}
        />

        {erro && (
          <p className="text-red-500 text-sm text-center">
            {erro}
          </p>
        )}

        <button className="w-full bg-blue-700 text-white font-black py-3 rounded-xl">
          Entrar
        </button>

      </form>

    </main>
  );
}