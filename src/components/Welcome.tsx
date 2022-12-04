import { If } from 'jsx-conditionals';
import { useEffect, useState } from 'react'
import { GiSadCrab } from 'react-icons/gi'
import { GoX } from 'react-icons/go'

function isValidTokenFormat(possibleToken: string) {
    return /^[a-z0-9]{8}-([a-z0-9]{4}-){3}[a-z0-9]{12}$/g.test(possibleToken);
}

function Welcome(props: { onKeyEntered: (key: string) => void }) {
    const [token, setToken] = useState('');
    const isValidToken = isValidTokenFormat(token);
    useEffect(() => {
        if (isValidToken) {
            props.onKeyEntered(token);
        }
    }, [isValidToken]);
    return (
        <section className='welcome'>
            <h2>Hello</h2>
            <p>This app lets you test your comprehension of Japanese words in context.</p>
            <p>It uses data from <a href='https://www.wanikani.com/' target='_blank'>WaniKani</a> so requires an account
                and an <a href='https://www.wanikani.com/settings/personal_access_tokens' target='_blank'>API key</a>.
            </p>
            <p>The default permissions are fine, i.e. you don't have to check any of the checkboxes.</p>
            <GiSadCrab className='crab' />
            <form>
                <label>API key</label>
                <input type='text'
                    value={token}
                    onChange={e => setToken(e.target.value.trim())}
                    maxLength={36}
                />
                <div className='validity'>
                    <If condition={token.length > 0 && !isValidToken}>
                        <GoX title='Incorrect key' />
                    </If>
                </div>
            </form>
        </section>
    )
}

export default Welcome
