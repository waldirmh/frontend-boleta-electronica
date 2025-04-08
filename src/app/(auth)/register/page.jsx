import "./Register.css";

export default function Register() {
  return (
    <div className="row">
      <div className="col-md-4 offset-md-4">
        <div className="mt-4 text-center">
          <div className="signin-title">REGISTRAR</div>
          <div className="card-body">
            <form action="/signin" method="POST">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Correo
                </label>
                <input
                  type="text"
                  name="gmail"
                  id="username"
                  placeholder="correo"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="nombre de usuario"
                  className="form-control"
                />
              </div>
              <div className="form-group mt-4 mb-5">
                <label htmlFor="password" className="form-label">
                  Clave
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="******"
                  className="form-control"
                />
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-primary mt-4" type="submit">
                  REGISTRAR
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
