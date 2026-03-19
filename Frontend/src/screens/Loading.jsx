import { Spinner } from '../components'

function Loading() {
    return (
        <div className='w-full h-dvh flex justify-center items-center'>
            <Spinner scale={150} />
        </div>
    )
}

export default Loading