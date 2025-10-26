import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar principal">
      <div className="container-fluid">
        {/* Logo leva para Home */}
        <Link to="/" className="navbar-brand" id="logo-minimalista">
          <img
            id="logo-minimalista"
            src="https://cdn.discordapp.com/attachments/1431799178337583195/1431799425142882384/logo_minimalista.png?ex=68febaa0&is=68fd6920&hm=638eeee0ebd793f40cfff57ffba149e5ec5df33776214dd0dff306478fde6bf9&"
            width="101"
            height="101"
            alt="logo-minimalista"
          />
        </Link>

        {/* Perfil leva para Login */}
        <Link to="/login" className="navbar-brand" id="perfil">
          <img
            id="perfil"
            src="https://cdn.discordapp.com/attachments/1431799178337583195/1431799425847525501/perfil.png?ex=68febaa0&is=68fd6920&hm=fae9357778726e1288481b1a41bcd4f803910ab53ec4605a4d15a7765ff45c5b&"
            width="60"
            height="60"
            alt="perfil"
          />
        </Link>

        {/* Carrinho, exemplo: você pode criar rota /carrinho */}
        <Link to="/carrinho" className="navbar-brand" id="carrinho">
          <img
            id="carrinho"
            src="https://cdn.discordapp.com/attachments/1431799178337583195/1431799331500982404/carrinho.png?ex=68feba8a&is=68fd690a&hm=d838e8caed684904fdaa908fb00705df6bf1b6c1b42ad666f798ba98a04c475e&"
            width="50"
            height="60"
            alt="carrinho"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;


/* rapaiz *//* eu to tentando entender pq o logo n ta aparecendo */