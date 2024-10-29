import Link from 'next/link'
import { Lora, Teko } from 'next/font/google'

const lora = Lora({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin']
})

const teko = Teko({
  weight: ['300', '600'],
  subsets: ['latin']
})

export default function CreatePost() {
  return (
    <div className='flex flex-col items-center m-8'>
      <h1 className={`font-bold text-orange-500 ${lora.className}`}>Create Post Page!</h1>
      <Link href='/' className={`mt-4 p-4 rounded-md bg-amber-600 text-white hover:bg-amber-950 ${teko.className}`}>
        Move Create Post Page
      </Link>
    </div>
  )
}