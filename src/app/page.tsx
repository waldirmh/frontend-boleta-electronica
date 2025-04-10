import Link from 'next/link';
import "./Signin.css"

export default function Signin() {
  return (
    <div className="row">
      <div className="col-md-4 offset-md-4">
        <div className="mt-4 text-center">
          <div className="signin-title">INGRESAR</div>
          <div className="card-body">
            <form action="/signin" method="POST">
              <div className="form-group">
                <label htmlFor="username" className="form-label">Usuario</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="correo"
                  className="form-control"
                />
              </div>
              <div className="form-group mt-4 mb-5">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="******"
                  className="form-control"
                />
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-primary mt-4" type="submit" >
                  INICIAR SESIÓN
                </button>

                {/* <Link href="/home" passHref>
                  <button className="btn btn-primary mt-4" type="button">
                    INICIAR SESIÓN
                  </button>
                </Link> */}

              </div>
              <div className='mt-3 fs-6 '>
                <Link href={"/register"} className="text-light txt-register">
                  Registrarse</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
