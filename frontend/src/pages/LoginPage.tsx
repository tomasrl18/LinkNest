import { useAuth } from '../context/AuthProvider';

export const LoginPage = () => {
    const { signIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = e.currentTarget.email.value;
        const pass  = e.currentTarget.password.value;
        try {
            await signIn(email, pass);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className='min-h-screen flex items-center justify-center px-4'>
            <form onSubmit={handleSubmit} className="card w-full max-w-sm bg-base-200/60 backdrop-blur-md shadow-xl">
                <div className="card-body space-y-4">
                    <h2 className="card-title">Inicia sesión</h2>

                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="Email"
                        className="input input-bordered w-full"
                    />
                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="Contraseña"
                        className="input input-bordered w-full"
                    />

                    <button type="submit" className="btn btn-primary w-full">Entrar</button>
                </div>
            </form>
        </section>
    );
};
