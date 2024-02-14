import nodemailer from 'nodemailer'

export const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //Informacion del email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Comprueba tu cuenta",
        text: "Comprueba tu cuenta en UpTask",
        html: `
            <style>
                body {
                    font-family: 'Roboto', sans-serif;
                    background-color: #f8f8f8;
                    padding: 20px;
                    text-align: center;
                    color: #333;
                }

                h1 {
                    color: #007BFF; /* Azul */
                    font-size: 24px;
                    margin-bottom: 15px;
                }

                p {
                    font-size: 18px;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }

                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                img {
                    max-width: 100%;
                    height: auto;
                    margin: 20px 0;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
                }

                a {
                    display: inline-block;
                    margin: 20px 0;
                    padding: 15px 30px;
                    background-color: #FF4500; /* Naranja */
                    color: #fff;
                    text-decoration: none;
                    font-weight: bold;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }

                a:hover {
                    background-color: #FF6347; /* Naranja más claro en hover */
                }
            </style>

        <p>Hola: ${nombre} Comprueba tu cuenta en Uptask</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:</p>

        <div class="container">
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
            <img src="https://images.vexels.com/media/users/3/236231/isolated/preview/5b1c3bffa604aab44d0030cac9f8fdfe-bienvenido-letras-en-espanol.png" alt="Imagen Correo" />
        </div>

        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    })
};

//!-----------------------------------------------------------------------------------------------------//

export const emailOlvidePassword = async (datos) => {
    const { email, nombre, token } = datos

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    //Informacion del email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Reestablece tu Password",
        text: "Reestablece tu Password",
        html: `
            <style>
                body {
                    font-family: 'Roboto', sans-serif;
                    background-color: #f8f8f8;
                    padding: 20px;
                    text-align: center;
                    color: #333;
                }

                h1 {
                    color: #007BFF; /* Azul */
                    font-size: 24px;
                    margin-bottom: 15px;
                }

                p {
                    font-size: 18px;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }

                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                img {
                    max-width: 100%;
                    height: auto;
                    margin: 20px 0;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Sombra suave */
                }

                a {
                    display: inline-block;
                    margin: 20px 0;
                    padding: 15px 30px;
                    background-color: #FF4500; /* Naranja */
                    color: #fff;
                    text-decoration: none;
                    font-weight: bold;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }

                a:hover {
                    background-color: #FF6347; /* Naranja más claro en hover */
                }
            </style>

            <p>Hola: ${nombre} has solicitado restablecer tu contraseña</p>
            <p>Sigue el siguiente enlace para generar una nueva contraseña:</p>

            <div class="container">
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Contraseña</a>
                <img src="https://i0.wp.com/www.elpixelilustre.com/wp-content/uploads/2013/11/VaultBoyFO3.png?resize=390%2C400&ssl=1" alt="Imagen Correo" />
            </div>

            <p>Si no solicitaste este correo electrónico, puedes ignorar este mensaje.</p>
        `
    })
};