import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import WkContext from './WkContext'
import { SettingsContext } from './context/settings-context'
import { useCookie } from './hooks/useCookie'

const queryClient = new QueryClient();

function Root() {
    const [prefs, setPrefs] = useCookie();

    return (
        <QueryClientProvider client={queryClient}>
            <SettingsContext.Provider value={{ values: prefs, setValues: setPrefs }}>
                <WkContext />
            </SettingsContext.Provider>
        </QueryClientProvider>
    );
}

export default Root;
