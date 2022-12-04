import { If } from 'jsx-conditionals';
import { useEffect, useState } from 'react'
import { GiSadCrab } from 'react-icons/gi'
import { GoX } from 'react-icons/go'
import { isValidApiKeyFormat } from '../util';

function Welcome(props: { onKeyEntered: (key: string) => void }) {
    const [key, setKey] = useState('');
    const isValidKey = isValidApiKeyFormat(key);
    useEffect(() => {
        if (isValidKey) {
            props.onKeyEntered(key);
        }
    }, [isValidKey]);
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
                    value={key}
                    onChange={e => setKey(e.target.value.trim())}
                    maxLength={36}
                />
                <div className='validity'>
                    <If condition={key.length > 0 && !isValidKey}>
                        <GoX title='Incorrect key' />
                    </If>
                </div>
            </form>
        </section>
    )
}

export default Welcome
