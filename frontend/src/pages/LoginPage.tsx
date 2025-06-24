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
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" name="email" required className="input w-full" placeholder="Email" />
            <input type="password" name="password" required className="input w-full" placeholder="Password" />
            <button type="submit" className="btn-primary w-full">Sign in</button>
        </form>
    );
};
