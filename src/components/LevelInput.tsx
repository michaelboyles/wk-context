import { useState } from 'react'
import { Level } from '../context/settings-context'

type Props = {
    level: Level
    userLevel: number
    setValue: (level: Level) => void
}

function LevelInput(props: Props) {
    const isMine = props.level === 'mine';
    const levelNumber = props.level === 'mine' ? props.userLevel : props.level;
    return (
        <div className='levelInput'>
            <input type='number'
                value={levelNumber} disabled={isMine}
                onChange={e => props.setValue(Number(e.target.value))}
                min={1}
                max={60}
            />
            <label>Use mine</label>
            <input
                type='checkbox' checked={isMine}
                onChange={() => {
                    if (isMine) {
                        props.setValue(props.userLevel);
                    }
                    else {
                        props.setValue('mine');
                    }
                }}
            />
        </div>
    )
}

export default LevelInput
