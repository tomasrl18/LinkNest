import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useAuth } from "../context/AuthProvider"
import { supabase } from "../lib/supabase"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Alert } from "../components/ui/alert"

export function ProfilePage() {
    const { t } = useTranslation()
    const { session } = useAuth()
    const email = session?.user.email ?? ""

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [closeOthers, setCloseOthers] = useState(false)

    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const [errors, setErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmNewPassword?: string; global?: string }>({})
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

    const getStrength = (password: string): "weak" | "medium" | "strong" => {
        let score = 0
        if (password.length >= 8) score++
        if (/[a-z]/.test(password)) score++
        if (/[A-Z]/.test(password)) score++
        if (/[0-9]/.test(password)) score++
        if (/[^A-Za-z0-9]/.test(password)) score++
        if (score <= 2) return "weak"
        if (score <= 4) return "medium"
        return "strong"
    }

    const strength = newPassword ? getStrength(newPassword) : undefined

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (loading) return
        setErrors({})
        setSuccess("")

        const newErrors: { currentPassword?: string; newPassword?: string; confirmNewPassword?: string; global?: string } = {}

        if (!currentPassword) newErrors.currentPassword = t('profile.password.required')
        if (!newPassword) newErrors.newPassword = t('profile.password.required')
        else if (!passwordPattern.test(newPassword)) newErrors.newPassword = t('profile.password.invalid')
        if (!confirmNewPassword) newErrors.confirmNewPassword = t('profile.password.required')
        else if (newPassword !== confirmNewPassword) newErrors.confirmNewPassword = t('profile.password.mismatch')

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            setLoading(true)
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword })
            if (signInError) {
                setErrors({ currentPassword: t('profile.password.currentIncorrect') })
                return
            }

            const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
            if (updateError) {
                setErrors({ global: updateError.message })
                return
            }

            if (closeOthers) {
                await supabase.auth.signOut({ scope: 'others' })
            }

            setCurrentPassword("")
            setNewPassword("")
            setConfirmNewPassword("")
            setCloseOthers(false)
            setSuccess(t('profile.password.success'))
        } finally {
            setLoading(false)
        }
    }

    const isValid =
        currentPassword &&
        newPassword &&
        confirmNewPassword &&
        passwordPattern.test(newPassword) &&
        newPassword === confirmNewPassword

    return (
        <section className="flex-1 flex items-center justify-center p-4 px-4 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 text-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 dark:text-gray-100 transition-colors">
            <Card className="w-full max-w-md rounded-2xl backdrop-blur border shadow-lg bg-white/90 border-gray-200 text-gray-900 dark:bg-gray-900/80 dark:border-gray-800 dark:text-gray-100">
                <CardHeader>
                    <CardTitle>{t('profile.title')}</CardTitle>
                    <CardDescription>{t('profile.password.title')}</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} noValidate>
                    <CardContent className="space-y-4">
                        {success && <Alert className="mb-4">{success}</Alert>}
                        {errors.global && <Alert variant="destructive" className="mb-4">{errors.global}</Alert>}

                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">{t('profile.password.current')}</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrent ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    aria-invalid={errors.currentPassword ? 'true' : 'false'}
                                    aria-describedby={errors.currentPassword ? 'currentPassword-error' : undefined}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent((v) => !v)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                    aria-label={showCurrent ? t('auth.hidePassword') : t('auth.showPassword')}
                                >
                                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p id="currentPassword-error" className="text-sm text-red-600">
                                    {errors.currentPassword}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">{t('profile.password.new')}</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    aria-invalid={errors.newPassword ? 'true' : 'false'}
                                    aria-describedby={errors.newPassword ? 'newPassword-error' : undefined}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew((v) => !v)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                    aria-label={showNew ? t('auth.hidePassword') : t('auth.showPassword')}
                                >
                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {strength && (
                                <p className="text-sm text-muted-foreground">
                                    {t(`profile.password.strength.${strength}`)}
                                </p>
                            )}
                            {errors.newPassword && (
                                <p id="newPassword-error" className="text-sm text-red-600">
                                    {errors.newPassword}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmNewPassword">{t('profile.password.confirm')}</Label>
                            <div className="relative">
                                <Input
                                    id="confirmNewPassword"
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    aria-invalid={errors.confirmNewPassword ? 'true' : 'false'}
                                    aria-describedby={errors.confirmNewPassword ? 'confirmNewPassword-error' : undefined}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                    aria-label={showConfirm ? t('auth.hidePassword') : t('auth.showPassword')}
                                >
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.confirmNewPassword && (
                                <p id="confirmNewPassword-error" className="text-sm text-red-600">
                                    {errors.confirmNewPassword}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                id="closeOthers"
                                type="checkbox"
                                checked={closeOthers}
                                onChange={(e) => setCloseOthers(e.target.checked)}
                            />
                            <Label htmlFor="closeOthers" className="font-normal">
                                {t('profile.password.closeOthers')}
                            </Label>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading || !isValid} className="w-full">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? t('profile.password.saving') : t('profile.password.save')}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </section>
    )
}
